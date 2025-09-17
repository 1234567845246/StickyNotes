<template>
    <CustomDialog  v-model="modelValue" :title="isEncrypted ? t('encryption.title2') : t('encryption.title1')" @close="handleClose">
        <div class="encryption-dialog">
            <template v-if="!isEncrypted">
                <div class="algorithm-selector">
                    <label>{{ t('encryption.selectalgorithm') }}：</label>
                    <select class="select" autocomplete="off" v-model="selectedAlgorithm">
                        <option value="aes-256-gcm">{{ t('encryption.aes256gcm') }}</option>
                        <option value="aes-256-cbc">{{ t('encryption.aes256cbc') }}</option>
                        <option value="aes-256-ctr">{{ t('encryption.aes256ctr') }}</option>
                        <option value="aes-256-cfb">{{ t('encryption.aes256cfb') }}</option>
                        <option value="aes-256-ofb">{{ t('encryption.aes256ofb') }}</option>
                    </select>
                </div>
            </template>

            <div class="password-input">
                <label>{{ isEncrypted ? t('encryption.passwordlabel1') : t('encryption.passwordlabel2') }}</label>
                <input type="password" v-model="password" :placeholder="isEncrypted ? t('encryption.passwordPlaceholder1') : t('encryption.passwordPlaceholder2')"
                    @keyup.enter="handleConfirm" class="input" />
                <div v-if="!isEncrypted" class="password-confirm">
                    <input type="password" v-model="confirmPassword" :placeholder="t('encryption.confirmPasswordPlaceholder')" @keyup.enter="handleConfirm" class="input"  />
                </div>
            </div>

            <div class="error-message" v-if="errorMessage">
                {{ errorMessage }}
            </div>

            <div class="dialog-footer">
                <button @click="handleClose" class="button">{{ $t('cancel') }}</button>
                <button :disabled="!isValid" @click="handleConfirm" class="button primary_button ">
                    {{ isEncrypted ? t('encryption.decrypt') : t('encryption.encrypt') }}
                </button>
            </div>
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomDialog from './CustomDialog.vue'
import { EncryptionAlgorithm } from "../../type"
import { useI18n } from 'vue-i18n'


const { t } = useI18n()
const  modelValue = defineModel<boolean>({required: true})
const props = defineProps<{
    isEncrypted: boolean
}>()

const emit = defineEmits<{
    (event: 'close'): void
    (event: 'confirm', password: string, algorithm: EncryptionAlgorithm): void
}>()

const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const selectedAlgorithm = ref<EncryptionAlgorithm>(EncryptionAlgorithm.AES_256_GCM)

const isValid = computed(() => {
    if (!password.value) return false
    if (!props.isEncrypted) {
        if (password.value.length < 6) { return false } return password.value === confirmPassword.value
    } return true
})
const handleClose = () => {
    password.value = ''
    confirmPassword.value = ''
    errorMessage.value = ''
    emit('close')
}

const handleConfirm = () => {
    if (!isValid.value) { return }

    if (!props.isEncrypted && password.value.length < 6) {
        errorMessage.value =    t('encryption.weakPassword');
        return
    }
    emit('confirm', password.value, selectedAlgorithm.value)
    handleClose()
}
</script>
<style scoped>
.encryption-dialog {
    padding: 20px;
}

.algorithm-selector {
    margin-bottom: 20px;
}



.password-input {
    margin-bottom: 20px;
}

.password-input label {
    display: block;
    margin-bottom: 10px;
}

.password-input input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 4px;
}

.error-message {
    color: #ff4444;
    margin-bottom: 20px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}


</style>