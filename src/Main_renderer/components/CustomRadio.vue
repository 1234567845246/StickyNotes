<template>
  <label
    class="custom-radio"
    :class="{
      'is-checked': isChecked,
      'is-disabled': isDisabled
    }"
  >
    <input
      type="radio"
      class="custom-radio__input"
      :value="radioValue"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="onChange"
    />
    <span class="custom-radio__icon"></span>
    <span class="custom-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Boolean],
  value: [String, Number, Boolean],
  label: [String, Number, Boolean],
  disabled: Boolean
});
const emit = defineEmits(['update:modelValue']);

// 取实际的 value
const radioValue = computed(() => props.value ?? props.label);

// 检查是否在 RadioGroup 内部
const radioGroup = inject('customRadioGroup', null) as null | {
  name: string;
  modelValue: string | number | boolean | undefined;
  disabled?: boolean;
  change: (val: any) => void;
};

const isGroup = computed(() => !!radioGroup);
const isChecked = computed(() => {
  if (isGroup.value) {
    return radioGroup!.modelValue === radioValue.value;
  }
  return props.modelValue === radioValue.value;
});
const isDisabled = computed(() => (radioGroup ? radioGroup.disabled : false) || props.disabled);

function onChange() {
  if (isGroup.value) {
    radioGroup!.change(radioValue.value);
  } else {
    emit('update:modelValue', radioValue.value);
  }
}
</script>

<style scoped>
.custom-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  color: var(--content-color);
  user-select: none;
  margin-right: 18px;
  position: relative;
}
.custom-radio.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.custom-radio__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.custom-radio__icon {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--button-border);
  border-radius: 50%;
  background: #fff;
  margin-right: 7px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-radio.is-checked .custom-radio__icon {
  border-color: var(--button-primary);
}
.custom-radio__icon::after {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--button-primary);
  opacity: 0;
  transition: opacity 0.2s;
  margin: auto;
}
.custom-radio.is-checked .custom-radio__icon::after {
  opacity: 1;
}
.custom-radio__label {
  line-height: 1;
  color: inherit;
}
</style>