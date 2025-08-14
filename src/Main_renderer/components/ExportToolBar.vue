<template>
    <DropdownToolbar :title="$t('export')" :visible="visible" :onChange="handleChange">
        <template #overlay>

            <ol class="md-editor-menu" role="menu">
                <li @click="exportmarkdown" class="md-editor-menu-item md-editor-menu-item-image" role="menuitem"
                    tabindex="0">
                    Markdown
                </li>
                <li @click="exporthtml" class="md-editor-menu-item md-editor-menu-item-image" role="menuitem"
                    tabindex="0">
                    HTML
                </li>
            </ol>

        </template>
        <svg t="1755068370317"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="11569"  class="lucide lucide-forward-icon md-editor-icon"  width="24" height="24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
                d="M469.333333 682.666667V42.666667c0-23.466667 19.2-42.666667 42.666667-42.666667s42.666667 19.2 42.666667 42.666667v640c0 23.466667-19.2 42.666667-42.666667 42.666666s-42.666667-19.2-42.666667-42.666666"
                fill="currentColor"  p-id="11570"></path>
            <path
                d="M226.210133 268.0576L481.826133 12.433067a42.7776 42.7776 0 0 1 60.330667 0c16.597333 16.597333 16.597333 43.776 0 60.330666L286.5408 328.388267a42.7776 42.7776 0 0 1-60.330667 0 42.7776 42.7776 0 0 1 0-60.330667"
                fill="currentColor"  p-id="11571"></path>
            <path
                d="M542.0544 12.4416l255.616 255.616a42.7776 42.7776 0 0 1 0 60.330667c-16.597333 16.605867-43.776 16.605867-60.330667 0L481.723733 72.789333a42.7776 42.7776 0 0 1 0-60.330666 42.7776 42.7776 0 0 1 60.330667 0M896 1024H128c-70.570667 0-128-57.429333-128-128V640c0-23.594667 19.072-42.666667 42.666667-42.666667s42.666667 19.072 42.666666 42.666667v256c0 23.552 19.114667 42.666667 42.666667 42.666667h768c23.552 0 42.666667-19.114667 42.666667-42.666667V640c0-23.594667 19.072-42.666667 42.666666-42.666667s42.666667 19.072 42.666667 42.666667v256c0 70.570667-57.429333 128-128 128"
                fill="currentColor" p-id="11572"></path>
        </svg>
    </DropdownToolbar>

</template>


<script setup lang="ts">
import { DropdownToolbar } from 'md-editor-v3';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = withDefaults(defineProps<{ markdown: string, html: string }>(), { markdown: '', html: '' })

const visible = ref<boolean>(false);
function handleChange(_visible: boolean) {
    visible.value = _visible;
}

function exportmarkdown() {
    handleChange(false);
    exportData({
        suggestedName: `note-${new Date().toISOString().slice(0, 10)}.md`,
        types: [{
            description: t('filterfile'),
            accept: {
                "text/markdown": ['.md', '.markdown', '.mdown']
            }
        }]
    }, props.markdown)
}

function exporthtml() {
    handleChange(false);
    exportData({
        suggestedName: `note-${new Date().toISOString().slice(0, 10)}.html`,
        types: [{
            description: t('filterfile1'),
            accept: {
                'text/html': ['.html']
            }
        }]
    },removeImageProtocol(props.html))
}

function removeImageProtocol(html:string){
     return html.replace(
        /<img([^>]*)src="image:\/\/([^"]+)"([^>]*)>/gi,
        (_, before, path, after) => {
          return `<img${before}src="${path}"${after}>`;
        }
      );
}


async function exportData(options: SaveFilePickerOptions, content: string) {
    try {
        const handle = await window.showSaveFilePicker(options);
        const writableStream = await handle.createWritable();
        await writableStream.write(content);
        await writableStream.close();
    } catch (err) {

    }
}

</script>