<template>
  <CustomDialog v-model="model" @close="closConfigPanel()">
    <template #title>
      <span>{{ t('config.title') }}</span>
    </template>
    <div style="display: contents;">
      <div class="content">
        <div class="grid" style="grid-template-columns: 1fr 1fr;gap: 50px;">
          <div class="grid_item adjoin-child-margins v-align-top">
            <label>
              {{ $t('config.language') }}
            </label>
            <p>
              <select class="select" v-model="tempConfig.language" autocomplete="off" @change="setLanguage()">
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </p>
            <label>
              {{ $t('config.theme') }}
            </label>
            <p>
              <select class="select" v-model="tempConfig.theme" autocomplete="off">
                <option value="system">{{ $t('config.system') }}</option>
                <option value="light">{{ $t('config.light') }}</option>
                <option value="dark">{{ $t('config.dark') }}</option>
              </select>
            </p>
            <label>
                {{ $t('config.contextmenu') }} 
            </label>
            <p>
              <select class="select" v-model="tempConfig.contextmenutheme" autocomplete="off">
                <option value="default">{{ $t('config.default') }}</option>
                <option value="flat">{{ $t('config.flat') }}</option>
                <option value="win10">{{ $t('config.win10') }}</option>
                <option value="mac">{{ $t('config.mac') }}</option>
              </select>
            </p>
            <label>
              {{ $t('config.trashconfig') }}
            </label>
            <CustomCheckbox v-model="tempConfig.autoClean">
              {{ $t('config.autoclean') }}
            </CustomCheckbox>
            <label>
              {{ $t('config.retentiondays') }}
            </label>
            <IntegerInput v-model="tempConfig.retentionDays" :min="0" :max="30" />
          </div>
        </div>
      </div>
      <div class="buttons grid" style="grid-template-columns: minmax(min-content, auto) minmax(min-content, auto);">
        <div class="grid_item v-align-bottom h-align-left" style="grid-auto-flow: column">
          <button class="button" @click="resetConfig">{{ $t('reset') }}</button>
        </div>
        <div class="grid_item h-align-right v-align-bottom" style="grid-auto-flow: column">
          <button class="button primary_button" style="margin-left: 10px;" @click="saveConfig">{{ $t('save')
          }}</button>
          <button class="button" style="margin-left: 10px;" @click="closConfigPanel();">{{ $t('cancel') }}</button>
        </div>
      </div>
    </div>
  </CustomDialog>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Config } from '../../type';
import CustomDialog from './CustomDialog.vue';
import CustomCheckbox from "./CustomCheckbox.vue"
import IntegerInput from './IntegerInput.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emit = defineEmits(['close'])
import { useConfigStore } from '../store/store';
import { setTheme } from '../theme/theme';

const configStore = useConfigStore();
const tempConfig = ref(configStore.config);

watch(() => configStore.config, (newConfig: Config) => {
  if (newConfig) {
    tempConfig.value = JSON.parse(JSON.stringify(newConfig));
  }
}, { immediate: true, deep: true }
)

 const model =  defineModel<boolean>({ required: true })

function setLanguage() {
  window.electronAPI.restart({ language: tempConfig.value.language });
}

async function saveConfig() {
  // 保存时创建新对象
  await configStore.setConfig(JSON.parse(JSON.stringify(tempConfig.value)));
  await configStore.saveConfig();
  setTheme(tempConfig.value.theme);
  closConfigPanel();
}

function closConfigPanel() {
  // 关闭时重置为最新的 store 配置
  tempConfig.value = {
    ...configStore.config
  };
  model.value = false;
}

function resetConfig() {
  configStore.resetConfig();
  tempConfig.value = {
    ...configStore.config
  };
}


onMounted(() => {
});
</script>
<style lang="css" scoped>
.content {
  padding-right: 8px;
  overflow: auto;
}

.content label {
  line-height: 23px;
}

.content p {
  margin: 0 0 5px;
}

.adjoin-child-margins label:first-child {
  margin-top: 0;
}

.grid {
  contain: content;
  display: grid;
}

.h-align-left {
  justify-self: start;
}

.h-align-right {
  justify-self: end;
  text-align: right;
}

.v-align-bottom {
  align-content: end
}

.v-align-top {
  align-content: start;
}



.adjoin-child-margins {
  display: block;
}


.adjoin-child-margins label {
  display: block;
  margin-top: 15px;
}






.buttons {
  padding-top: 12px;
  padding-right: 8px;
}




@keyframes modal-dialog-dialog-fade-in {
  0% {
    transform: scale(0.85);
  }

  100% {
    transform: scale(1);
  }
}
</style>