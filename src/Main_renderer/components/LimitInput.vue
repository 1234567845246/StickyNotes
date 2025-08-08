<template>
  <div class="limited-input-container">
    <input
      ref="inputRef"
      type="text"
      class="limited-input"
      v-model="model"
      @input="handleInput"
      :placeholder="t('placeholder') + '...'" 
    />
    <div class="counter">{{ displayCount }}/50</div>
  </div>
</template>
<script setup lang="ts">
import {computed, useTemplateRef} from 'vue'
import { useI18n } from 'vue-i18n';
const {t} = useI18n();

const model = defineModel({ type: String ,required:true,default:''});
const emit = defineEmits(['input'])

const inputRef = useTemplateRef<HTMLInputElement|null>('inputRef');

function handleInput(){
    if(model.value.length > 50){
        model.value = model.value.substring(0,50);
        emit('input');
    }
}

const displayCount = computed(()=>{
    return Math.min(model.value.length,50)
})


</script>
<style lang="css" scoped>
.limited-input-container {
    display: flex
;
    align-items: center;
    justify-content: space-around;
    width: 500px;
}

.limited-input {
  width: 100%;
  padding: 10px 70px 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.limited-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.counter {
  color: #909399;
  font-size: 12px;
  background: white;
  padding: 0 4px;
}

</style>