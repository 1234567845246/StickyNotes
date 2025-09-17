import { Buffer } from 'buffer';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto';

export enum EncryptionAlgorithm {
    AES_256_GCM = 'aes-256-gcm',
    AES_256_CBC = 'aes-256-cbc',
    AES_256_CTR = 'aes-256-ctr',
    AES_256_CFB = 'aes-256-cfb',
    AES_256_OFB = 'aes-256-ofb'
}

export class CryptoTools {
    private static readonly KEY_LENGTH = 32; // 256 bits
    private static readonly IV_LENGTH = 16;
    private static readonly SALT_LENGTH = 16;
    private static readonly ITERATIONS = 100000;

    /**
     * 从密码生成加密密钥
     */
    private static deriveKey(password: string, salt: Buffer): Buffer {
        return pbkdf2Sync(password, salt, this.ITERATIONS, this.KEY_LENGTH, 'sha256');
    }

    /**
     * 加密文本
     */
    public static encrypt(text: string, password: string, algorithm: EncryptionAlgorithm): {
        encryptedData: string,
        salt: string,
        iv: string
    } {
        // 生成随机盐值和IV
        const salt = randomBytes(this.SALT_LENGTH);
        const iv = randomBytes(this.IV_LENGTH);

        // 从密码派生密钥
        const key = this.deriveKey(password, salt);

        // 创建加密器
        const cipher = createCipheriv(algorithm, key, iv);

        // 加密数据
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final()
        ]);

        // 如果使用GCM模式，需要获取认证标签
        let authTag: Buffer | undefined;
        if (algorithm === EncryptionAlgorithm.AES_256_GCM) {
            authTag = (cipher as any).getAuthTag();
        }

        // 组合最终的加密数据
        const finalData = authTag 
            ? Buffer.concat([encrypted, authTag])
            : encrypted;

        return {
            encryptedData: finalData.toString('base64'),
            salt: salt.toString('base64'),
            iv: iv.toString('base64')
        };
    }

    /**
     * 解密文本
     */
    public static decrypt(encryptedData: string, password: string, salt: string, iv: string, algorithm: EncryptionAlgorithm): string {
        try {
            // 解码Base64数据
            const encryptedBuffer = Buffer.from(encryptedData, 'base64');
            const saltBuffer = Buffer.from(salt, 'base64');
            const ivBuffer = Buffer.from(iv, 'base64');

            // 从密码派生密钥
            const key = this.deriveKey(password, saltBuffer);

            // 分离加密数据和认证标签（如果使用GCM模式）
            let data = encryptedBuffer;
            let authTag: Buffer | undefined;
            
            if (algorithm === EncryptionAlgorithm.AES_256_GCM) {
                authTag = encryptedBuffer.slice(-16);
                data = encryptedBuffer.slice(0, -16);
            }

            // 创建解密器
            const decipher = createDecipheriv(algorithm, key, ivBuffer);
            
            if (algorithm === EncryptionAlgorithm.AES_256_GCM && authTag) {
                (decipher as any).setAuthTag(authTag);
            }

            // 解密数据
            const decrypted = Buffer.concat([
                decipher.update(data),
                decipher.final()
            ]);

            return decrypted.toString('utf8');
        } catch (error) {
            throw new Error('解密失败：密码错误或数据已损坏');
        }
    }
}