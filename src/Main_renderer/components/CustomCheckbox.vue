<template>
    <p @click="toggle">
        <span class="checkbox" role="checkbox" aria-checked="true" >
            <span class="checkmark">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99 78.4" class="checkmark" v-if="model">
                    <path d="M84 0L37 48 15 27 0 42l37 36 62-63z"></path>
                </svg>
            </span>
            <slot />
        </span>
    </p>
</template>
<script setup lang="ts">

const model = defineModel({ type: Boolean ,required:true})


const emit = defineEmits(['change'])


function toggle() {
    model.value = ! model.value
    emit('change', model.value);
}
</script>
<style scoped>
.checkbox {
    contain: content;
    display: block;
    position: relative;
    min-height: 23px;
    overflow: hidden;
    line-height: 23px;
    text-indent: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.checkbox span {
    content: "";
    display: block;
    position: absolute;
    top: 4px;
    width: 16px;
    height: 16px;
    border: 1px solid var(--baseColor-gray4);
    border-radius: 3px;
    text-indent: 0;
}

.checkbox span .checkmark {
    display: block;
    width: 10px;
    margin: 3px 2px 0;
    fill: var(--baseColor-gray6);
}

.checkbox:not(.disabled):hover,
.checkbox:focus {
    outline: 0;
    text-decoration: underline;
}
</style>