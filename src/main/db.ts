import sqlite3 from 'better-sqlite3';
import { app, dialog } from 'electron';
import { join } from 'path';
import { Note, Tag } from '../type';
import { existsSync } from 'fs';
import { i18n } from './I18n';

app.setPath('userData', join(app.getPath('appData'), 'StickyNotes'));
const dbpath = join(app.getPath('userData'), 'db.sqlite3');

class Database {
    private static instance: Database | undefined = undefined;
    private db: sqlite3.Database;
    private constructor() {
        let dbExists = existsSync(dbpath);
        //https://github.com/WiseLibs/better-sqlite3/releases
        this.db = new sqlite3(dbpath, {
            verbose: console.log,
        });


        if (!dbExists) {
            // 创建notes表（增加新字段，包含加密相关字段）
            this.db.exec(`CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                color TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                deleted INTEGER DEFAULT 0,
                pinned INTEGER DEFAULT 0,
                star INTEGER DEFAULT 0,
                deletedAt TEXT,
                originalPosition INTEGER,
                isEncrypted INTEGER DEFAULT 0,
                encryptedContent TEXT,
                salt TEXT,
                iv TEXT,
                algorithm TEXT
            )`);

            // 创建tags表
            this.db.exec(`CREATE TABLE IF NOT EXISTS tags (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                color TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            )`);

            // 创建note_tags关联表（多对多关系）
            this.db.exec(`CREATE TABLE IF NOT EXISTS note_tags (
                note_id TEXT NOT NULL,
                tag_id TEXT NOT NULL,
                PRIMARY KEY (note_id, tag_id),
                FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
            )`);
        } else {
            // 如果数据库已存在，检查并添加新的加密字段
            this.addEncryptionFieldsIfNotExists();
        }



    }

    // 检查并添加加密字段（如果不存在）
    private addEncryptionFieldsIfNotExists() {
        try {
            // 检查是否已经有isEncrypted字段
            const tableInfo = this.db.prepare("PRAGMA table_info(notes)").all() as { name: string }[];
            const hasEncryptionFields = tableInfo.some(column => column.name === 'isEncrypted');
            const hasStarField = tableInfo.some(column => column.name === 'star');

            // 添加star字段
            if (!hasStarField) {
                console.log('正在添加star字段...');
                this.db.exec(`ALTER TABLE notes ADD COLUMN star INTEGER DEFAULT 0`);
                console.log('star字段添加完成');
            }

            if (!hasEncryptionFields) {
                console.log('正在添加加密相关字段...');

                // 添加加密相关字段
                this.db.exec(`ALTER TABLE notes ADD COLUMN isEncrypted INTEGER DEFAULT 0`);
                this.db.exec(`ALTER TABLE notes ADD COLUMN encryptedContent TEXT`);
                this.db.exec(`ALTER TABLE notes ADD COLUMN salt TEXT`);
                this.db.exec(`ALTER TABLE notes ADD COLUMN iv TEXT`);
                this.db.exec(`ALTER TABLE notes ADD COLUMN algorithm TEXT`);

                console.log('加密相关字段添加完成');
            }
        } catch (error) {
            console.error('添加加密字段失败:', error);
        }
    }
    public static getDatabaseInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    public close() {
        if (this.db) {
            this.db.close();
            Database.instance = undefined;
        }
    }

    // 标签相关方法
    public getTags(): Tag[] {
        const stmt = this.db.prepare('SELECT * FROM tags');
        return stmt.all() as Tag[];
    }

    public saveTag(tag: Tag): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const stmt = this.db.prepare(
                    'INSERT OR REPLACE INTO tags (id, name, color, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
                );
                stmt.run(tag.id, tag.name, tag.color, tag.createdAt, tag.updatedAt);
                resolve(true);
            } catch (error) {
                console.error('Error saving tag:', error);
                resolve(false);
            }
        });
    }

    public deleteTag(tagId: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {

                this.db.transaction(() => {

                    const deleteTagRelationsStmt = this.db.prepare(
                        'DELETE FROM note_tags WHERE tag_id = ?'
                    );
                    deleteTagRelationsStmt.run(tagId);


                    const deleteTagStmt = this.db.prepare('DELETE FROM tags WHERE id = ?');
                    deleteTagStmt.run(tagId);
                    resolve(true);
                })();


            } catch (error) {
                console.error('Error deleting tag:', error);
                resolve(false);
            }
        });
    }

    // 获取便签的标签
    public getNoteTags(noteId: string): string[] {
        const stmt = this.db.prepare(
            'SELECT tag_id FROM note_tags WHERE note_id = ?'
        );
        const result = stmt.all(noteId) as { tag_id: string }[];
        return result.map(row => row.tag_id);
    }

    // 添加便签标签关联
    public addTagToNote(noteId: string, tagId: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const stmt = this.db.prepare(
                    'INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)'
                );
                stmt.run(noteId, tagId);
                resolve(true);
            } catch (error) {
                console.error('Error adding tag to note:', error);
                resolve(false);
            }
        });
    }

    // 移除便签标签关联
    public removeTagFromNote(noteId: string, tagId: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const stmt = this.db.prepare(
                    'DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?'
                );
                stmt.run(noteId, tagId);
                resolve(true);
            } catch (error) {
                console.error('Error removing tag from note:', error);
                resolve(false);
            }
        });
    }

    // 修改获取便签的方法，包含标签信息和加密信息
    public getNotes(): Note[] {
        const stmt = this.db.prepare('SELECT * FROM notes');
        const notes = stmt.all() as Note[];

        // 为每个便签获取标签并处理加密字段
        return notes.map(note => ({
            ...note,
            tags: this.getNoteTags(note.id),
            deleted: Boolean(note.deleted),
            pinned: Boolean(note.pinned),
            isEncrypted: Boolean(note.isEncrypted),
            // 确保加密相关字段存在
            encryptedContent: note.encryptedContent || undefined,
            salt: note.salt || undefined,
            iv: note.iv || undefined,
            algorithm: note.algorithm || undefined
        }));
    }

    // 修改保存便签的方法，同时保存标签关系和加密信息
    public saveNote(note: Note): Promise<boolean> {
        return new Promise(async (resolve) => {
            try {
                // 保存便签基本信息（包括加密相关字段）
                const stmt = this.db.prepare(
                    'INSERT OR REPLACE INTO notes (id, title, content, color, createdAt, updatedAt, deleted, pinned,star, deletedAt, originalPosition, isEncrypted, encryptedContent, salt, iv, algorithm) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)'
                );
                stmt.run(
                    note.id,
                    note.title,
                    note.content,
                    note.color,
                    note.createdAt,
                    note.updatedAt,
                    note.deleted ? 1 : 0,
                    note.pinned ? 1 : 0,
                    note.star ? 1 : 0,
                    note.deletedAt,
                    note.originalPosition,
                    note.isEncrypted ? 1 : 0,
                    note.encryptedContent,
                    note.salt,
                    note.iv,
                    note.algorithm
                );

                // 先移除所有现有标签关联
                const removeStmt = this.db.prepare(
                    'DELETE FROM note_tags WHERE note_id = ?'
                );
                removeStmt.run(note.id);

                // 添加新的标签关联
                for (const tagId of note.tags) {
                    await this.addTagToNote(note.id, tagId);
                }

                resolve(true);
            } catch (error) {
                console.error('Error saving note:', error);
                resolve(false);
            }
        });
    }

    public updateNote(note: Partial<Note>): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const stmt = this.db.prepare(
                    'UPDATE notes SET title = ?, content = ?, color = ?, updatedAt = ?, deleted = ?, pinned = ?, star=? ,deletedAt = ?, originalPosition = ?, isEncrypted = ?, encryptedContent = ?, salt = ?, iv = ?, algorithm = ? WHERE id = ?'
                );
                console.log('Updating note with data:', note);
                stmt.run(
                    note.title,
                    note.content,
                    note.color,
                    note.updatedAt || new Date().toISOString(),
                    note.deleted ? 1 : 0,
                    note.pinned ? 1 : 0,
                    note.star ? 1 : 0,
                    note.deletedAt,
                    note.originalPosition,
                    note.isEncrypted ? 1 : 0,
                    note.encryptedContent,
                    note.salt,
                    note.iv,
                    note.algorithm,
                    note.id
                );
                resolve(true);
            } catch (error) {
                console.error('Error updating note:', error);
                resolve(false);
            }
        });
    }
    public deleteNote(noteId: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                // 先删除与便签关联的标签关系
                const deleteTagsStmt = this.db.prepare(
                    'DELETE FROM note_tags WHERE note_id = ?'
                );
                deleteTagsStmt.run(noteId);

                // 再删除便签本身
                const deleteNoteStmt = this.db.prepare(
                    'DELETE FROM notes WHERE id = ?'
                );
                deleteNoteStmt.run(noteId);

                resolve(true);
            } catch (error) {
                // console.error('Error deleting note:', error);
                this.showErrorMessage(String(error));
                resolve(false);
            }
        });
    }


    private showErrorMessage(message: string) {
        dialog.showErrorBox(i18n.t('title'), message);
    }
}

export let database = Database.getDatabaseInstance();