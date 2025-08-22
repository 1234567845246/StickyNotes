<template>
  <dialog class="custom-dialog" ref="dialogRef">
    <div class="caption" style="grid-template-columns: auto min-content;">
      <div class="title grid_item">
        <slot name="title">{{ title }}</slot>
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

// 使用defineModel替换defineProps
const modelValue = defineModel<boolean>({ required: true });
const title = defineModel<string>('title', { default: 'Dialog Title' });

const dialogRef = ref<HTMLDialogElement | null>(null);

watch(modelValue, (val) => {
  if (val) {
    dialogRef.value?.showModal();
  } else {
    closeDialog();
  }
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function closeDialog() {
  dialogRef.value?.close();
  modelValue.value = false;
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
    max-width: calc(100vw - 20px);
    min-height: 130px;
    max-height: calc(100vh - 20px);
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
    overflow: auto;
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