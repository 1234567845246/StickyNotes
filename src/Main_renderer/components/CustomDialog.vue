<template>
    <dialog class="custom-dialog" ref="dialogRef">
        <div class="caption" style="grid-template-columns: auto min-content;">
            <div class="title grid_item">
                <slot name="title">{{ props.title }}</slot>
            </div>
            <div class="grid_item" @click="closeDialog">
                <a role="button" class="close" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" class="close-icon">
                        <path d="M.3 1.7L1.7.3l6 6-1.4 1.4-6-6z"></path>
                        <path d="M6.3.3l1.4 1.4-6 6L.3 6.3z"></path>
                    </svg>
                </a>
            </div>
        </div>
        <div class="content_wrapper">
            <slot />
        </div>
    </dialog>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref, watch } from 'vue';
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: false
    },
    title: {
        type: String,
        default: 'Dialog Title'
    }
});
const emit = defineEmits(['close']);
const dialogRef = ref<HTMLDialogElement | null>(null);


const isOpen = ref(props.modelValue);


watch(
    () => props.modelValue, (val) => {
        isOpen.value = val;
        if (val) {
            dialogRef.value?.showModal();
        } else {
            closeDialog();
        }
    }
);

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
})


function closeDialog() {

    dialogRef.value?.close();
    emit('close');
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog();
    }
}
</script>

<style scoped>
.custom-dialog {
    contain: content;
    /* display: flex; */
    display: none;
    flex-direction: column;
    max-width: calc(100% - 20px);
    min-height: 130px;
    max-height: calc(100% - 20px);
    padding: 6px;
    animation: modal-dialog-dialog-fade-in 300ms ease-out;
    border-radius: 6px;
    background: var(--dialog-borderColor);
    box-shadow: var(--dialog-boxShadow);
    text-align: left;
    border: none;
    margin: auto;
    visibility: hidden;
    opacity: 0;
}

/* .custom-dialog::backdrop {

    animation: modal-dialog-overlay-fade-in 250ms ease-out;
    background: var(--dialog-overlay-background);
} */

dialog[open] {
    opacity: 1;
    visibility: visible;
    display: flex;
}

dialog[open]::backdrop {
    animation: modal-dialog-overlay-fade-in 250ms ease-out;
    background: var(--dialog-overlay-background);
}

@keyframes modal-dialog-overlay-fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}


.caption {
    margin-bottom: 6px;
    contain: content;
    display: grid;
}

.title {
    display: block;
    padding: 0 6px;
    overflow: hidden;
    color: var(--dialog-title-foreground);
    font-weight: 700;
    letter-spacing: .5px;
    line-height: 24px;
    text-overflow: ellipsis;
    text-shadow: var(--dialog-title-textShadow);
    white-space: nowrap;
}

.grid_item {
    contain: content;
    display: inline-grid;
    grid-auto-flow: row;
    align-content: center;
    align-self: stretch;
    min-height: 23px;
    overflow: hidden;
}

.close {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    cursor: pointer;
}

.close:focus,
.close:hover {
    background-color: var(--dialog-close-activeBackground);
}

.close-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    transform: translate(-50%, -50%);
    fill: var(--dialog-close-foreground);
}

.content_wrapper {
    display: flex;
    flex-direction: column;
    min-width: 800px;
    max-width: 100%;
    padding: 16px;
    padding-right: 8px;
    overflow: hidden;
    border-radius: 3px;
    background: var(--dialog-background);
    color: var(--diglog-foreground);
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