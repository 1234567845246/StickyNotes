<template>
  <div class="limited-input-container">
    <input
      ref="inputRef"
      type="text"
      class="input limited-input"
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

.limited-input{
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
}


.counter {
  color: var(--input-foreground);
  font-size: 12px;
  background: var(--input-background);
  padding: 0 4px;
}

</style>