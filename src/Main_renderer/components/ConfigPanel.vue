<template>
  <CustomDialog v-model="props.modelValue"  @close="closConfigPanel()">
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
              {{ $t('config.visabledatatype') }}
            </label>
            <CustomCheckbox v-model="tempConfig.is8BitInteger">
              {{ $t('config.is8BitInteger') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.is16BitInteger">
              {{ $t('config.is16BitInteger') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.is32BitInteger">
              {{ $t('config.is32BitInteger') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.is64BitInteger">
              {{ $t('config.is64BitInteger') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.is16BitFloat">
              {{ $t('config.is16BitFloat') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.is32BitFloat">
              {{ $t('config.is32BitFloat') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.is64BitFloat">
              {{ $t('config.is64BitFloat') }}
            </CustomCheckbox>
            <CustomCheckbox v-model="tempConfig.isUtf8Encoding">
              {{ $t('config.isUtf8Encoding') }}
            </CustomCheckbox>

          </div>
          <div class="grid_item adjoin-child-margins v-align-top">
            <label>
              {{ $t('config.addressOffsetBase') }}
            </label>
            <p>
              <select class="select" v-model="tempConfig.addressOffsetBase" autocomplete="off">
                <option value="bin">{{ $t('config.bin') }}</option>
                <option value="otc">{{ $t('config.otc') }}</option>
                <option value="dec">{{ $t('config.dec') }}</option>
                <option value="hex">{{ $t('config.hex') }}</option>
              </select>
            </p>
            <CustomCheckbox v-model="tempConfig.hideAddressOffsetLeadingZeros">
              {{ $t('config.hideAddressOffsetLeadingZeros') }}
            </CustomCheckbox>
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
import { ref, onMounted, Ref, toRaw } from 'vue';
import { Config, defaultconfig } from '../../type';
import CustomDialog from './CustomDialog.vue';
import CustomCheckbox from "./CustomCheckbox.vue"
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emit = defineEmits(['close'])
import { useConfigStore } from '../store/store';
import { setTheme } from '../theme/theme';
const config = useConfigStore().config;
const tempConfig: Ref<Config> = ref(defaultconfig);
const props = defineProps({
  modelValue: {
    type: Boolean,
    required:true,
    default: false
  }
});

function setLanguage() {
  alert(t('alert1'));
}







async function loadConfig() {
  tempConfig.value = structuredClone(toRaw(config))
}
async function saveConfig() {

  useConfigStore().setConfig(structuredClone(toRaw(tempConfig.value)));
  useConfigStore().saveConfig();
  setTheme(tempConfig.value.theme);
  closConfigPanel();
}
function closConfigPanel() {
  emit('close');
}

function resetConfig() {
  useConfigStore().resetConfig();
  loadConfig();
}


onMounted(() => {
  loadConfig();
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