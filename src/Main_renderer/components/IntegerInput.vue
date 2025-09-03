<template>
    <input 
        type="text" 
        :value="modelValue" 
        @input="handleInput" 
        @keydown="handleKeyDown"
        @paste="handlePaste"
        @blur="handleBlur" 
        class="input integer-input"
    >
</template>

<script setup lang="ts">
const props = defineProps({
    min: {
        type: Number,
        default: -Infinity
    },
    max: {
        type: Number,
        default: Infinity
    }
})

// 使用 defineModel 进行双向绑定
const modelValue = defineModel<number>({ required: true })

// 验证并更新数值
function validateAndUpdateValue(value: string): void {
    if (value === '' || value === '-') {
        // 空值或只有负号时不更新modelValue，等待用户继续输入
        return
    }
    
    const numValue = Number(value)
    if (!isNaN(numValue) && isFinite(numValue)) {
        const clampedValue = Math.max(props.min, Math.min(numValue, props.max))
        if (clampedValue !== modelValue.value) {
            modelValue.value = clampedValue
        }
    }
}

// 过滤和规范化输入值
function filterInput(value: string): string {
    // 只保留数字和负号
    const filtered = value.replace(/[^0-9-]/g, '')
    
    // 处理负号：只能在开头，且只能有一个
    let result = ''
    if (filtered.startsWith('-')) {
        result = '-'
        // 移除其他位置的负号，只保留数字部分
        const numbersOnly = filtered.slice(1).replace(/-/g, '')
        result += numbersOnly.slice(0, 10) // 限制最大长度10位
    } else {
        // 移除所有负号，只保留数字
        result = filtered.replace(/-/g, '').slice(0, 10)
    }
    
    return result
}

// 按键预处理 - 在输入前就阻止非法字符
function handleKeyDown(e: KeyboardEvent) {
    const key = e.key
    const input = e.target as HTMLInputElement
    const currentValue = input.value
    const cursorPosition = input.selectionStart || 0
    
    // 允许的控制键
    const allowedControlKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown'
    ]
    
    // 允许 Ctrl/Cmd 组合键（复制、粘贴、全选等）
    if (e.ctrlKey || e.metaKey) {
        return
    }
    
    // 允许控制键
    if (allowedControlKeys.includes(key)) {
        return
    }
    
    // 严格阻止科学计数法相关字符和其他非法字符
    const illegalChars = ['e', 'E', '+', '.', ',', ' ']
    if (illegalChars.includes(key) || !/^[0-9-]$/.test(key)) {
        e.preventDefault()
        return
    }
    
    // 负号只能在开头输入
    if (key === '-') {
        if (cursorPosition !== 0 || currentValue.includes('-')) {
            e.preventDefault()
            return
        }
    }
    
    // 限制数字长度（不包括负号）
    if (/^[0-9]$/.test(key)) {
        const numbersOnly = currentValue.replace('-', '')
        if (numbersOnly.length >= 10) {
            e.preventDefault()
            return
        }
        
        // 预先验证范围：检查输入后的值是否会超出范围
        const futureValue = currentValue.slice(0, cursorPosition) + key + currentValue.slice(cursorPosition)
        const futureNum = Number(futureValue)
        if (!isNaN(futureNum) && isFinite(futureNum)) {
            if (futureNum > props.max || futureNum < props.min) {
                e.preventDefault()
                return
            }
        }
    }
}

// 粘贴事件处理
function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    
    const pastedText = e.clipboardData?.getData('text') || ''
    const filteredValue = filterInput(pastedText)
    
    if (filteredValue) {
        const input = e.target as HTMLInputElement
        input.value = filteredValue
        validateAndUpdateValue(filteredValue)
    }
}

// 输入处理 - 作为最后的安全网
function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    const filteredValue = filterInput(input.value)
    
    // 如果过滤后的值与当前值不同，更新输入框
    if (filteredValue !== input.value) {
        input.value = filteredValue
    }
    
    // 验证并更新modelValue
    validateAndUpdateValue(filteredValue)
}

// 失焦时验证
function handleBlur(e: Event) {
    const input = e.target as HTMLInputElement
    let value = input.value
    
    // 处理无效输入（空值、只有负号等）
    if (value === '' || value === '-') {
        // 使用合理的默认值
        const defaultValue = Math.max(props.min, Math.min(0, props.max))
        const finalValue = defaultValue < props.min ? props.min : defaultValue
        
        input.value = finalValue.toString()
        modelValue.value = finalValue
        return
    }
    
    const numValue = Number(value)
    if (!isNaN(numValue) && isFinite(numValue)) {
        const clampedValue = Math.max(props.min, Math.min(numValue, props.max))
        
        // 更新输入框显示和modelValue
        input.value = clampedValue.toString()
        if (clampedValue !== modelValue.value) {
            modelValue.value = clampedValue
        }
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