<template>
    <NormalToolbar :title="$t('import')" :onclick="handleClick">
  
        <svg t="1755068502907"  viewBox="0 0 1030 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="13554" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-expand-icon md-editor-icon">
            <path
                d="M140.8 1017.6c-38.4 0-70.4-12.8-96-38.4-25.6-25.6-38.4-57.6-38.4-96v-185.6c0-12.8 6.4-25.6 12.8-32s19.2-12.8 32-12.8 25.6 6.4 32 12.8 12.8 19.2 12.8 32v185.6c0 12.8 6.4 32 12.8 38.4s19.2 12.8 38.4 12.8h742.4c12.8 0 32-6.4 38.4-12.8 6.4-6.4 12.8-19.2 12.8-38.4v-185.6c0-12.8 6.4-25.6 12.8-32 6.4-6.4 19.2-12.8 32-12.8s25.6 6.4 32 12.8c6.4 6.4 12.8 19.2 12.8 32v185.6c0 38.4-12.8 70.4-38.4 96-25.6 25.6-57.6 38.4-96 38.4H140.8z"
                fill="currentColor" p-id="13555"></path>
            <path
                d="M537.6 12.8c6.4 6.4 12.8 19.2 12.8 32v544c0 6.4 6.4 6.4 6.4 6.4h6.4l153.6-160c6.4-6.4 12.8-19.2 25.6-19.2s25.6 6.4 32 12.8 12.8 19.2 12.8 32-6.4 25.6-12.8 32l-224 236.8c-6.4 6.4-19.2 12.8-32 12.8s-25.6-6.4-38.4-19.2L249.6 492.8c-6.4-6.4-12.8-19.2-12.8-32 0-6.4 6.4-12.8 19.2-25.6 6.4-6.4 19.2-12.8 32-12.8 0 0 19.2 6.4 25.6 12.8l147.2 160h6.4c6.4 0 6.4-6.4 6.4-6.4V51.2c0-12.8 6.4-25.6 12.8-32s19.2-12.8 32-12.8c6.4 0 12.8 0 19.2 6.4z"
                fill="currentColor" p-id="13556"></path>
        </svg>
     
    </NormalToolbar>
</template>

<script setup lang="ts">
import { NormalToolbar } from 'md-editor-v3';
import { useI18n } from 'vue-i18n';




const { t } = useI18n();

async function handleClick() {
    const fileHandles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
            description: t('filterfile'),
            accept: {
                "text/markdown": ['.md', '.markdown', '.mdown']
            }
        }]
    })
    const contents = await Promise.allSettled(
        fileHandles.map(async (handle) => {
            const file = await handle.getFile();
            return file.text();
        })
    )
    console.log(contents[0]);
}

</script>