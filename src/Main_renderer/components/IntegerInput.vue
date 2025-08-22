<template>
    <input type="text" :value="displayValue" @input="handleInput" @blur="handleBlur" class="input integer-input">
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    },
    min: {
        type: Number,
        default: -Infinity
    },
    max: {
        type: Number,
        default: Infinity
    }
})

const emit = defineEmits(['update:modelValue'])


const displayValue = ref(props.modelValue.toString())

watch(() => props.modelValue, (newVal) => {
    if (newVal.toString() !== displayValue.value) {
        displayValue.value = newVal.toString()
    }
})

// 输入处理
function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    let value = input.value

    // 过滤非法字符（允许负号和数字）
    const filtered = value.replace(/[^0-9-]/g, '')

    // 处理多个负号的情况
    const hasNegative = filtered.startsWith('-')
    const numbers = filtered.replace(/-/g, '')

    // 重组有效值
    let newValue = hasNegative ? '-' : ''
    newValue += numbers.slice(0, 10) // 限制最大长度

    // 更新显示值
    displayValue.value = newValue

    // 转换为数字并验证范围
    const numValue = Number(newValue)
    if (!isNaN(numValue)) {
        const clamped = Math.max(props.min, Math.min(numValue, props.max))
        emit('update:modelValue', clamped)
    }
}

// 失焦时验证
function handleBlur() {
    let numValue = Number(displayValue.value)

    // 处理无效输入
    if (isNaN(numValue) || displayValue.value === '-') {
        numValue = props.min
        displayValue.value = props.min.toString()
    }

    // 确保最终值在范围内
    const finalValue = Math.max(props.min, Math.min(numValue, props.max))

    // 避免无限循环
    if (finalValue !== props.modelValue) {
        emit('update:modelValue', finalValue)
    }
}
</script>

<style scoped>
.integer-input {
    background: var(--dialog-background);
    padding: 10px 0px 10px 5px;
    width: calc(100% - 5px);
}
</style>