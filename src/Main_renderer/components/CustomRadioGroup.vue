<template>
  <div class="custom-radio-group">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Boolean],
  disabled: Boolean
});
const emit = defineEmits(['update:modelValue']);

const value = ref(props.modelValue);

watch(() => props.modelValue, v => value.value = v);

function change(val: any) {
  emit('update:modelValue', val);
}

provide('customRadioGroup', {
  name: 'CustomRadioGroup',
  get modelValue() { return value.value; },
  disabled: props.disabled,
  change
});
</script>

<style scoped>
.custom-radio-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 18px;
}
</style>