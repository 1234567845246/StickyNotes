<template>
  <div class="note-editor">
    <div class="editor-header">
      <LimitInput v-model="editedNote.title" @input="updateContent('title', editedNote.title)" />
      <button @click="emit('close')" class="button">❌</button>
    </div>

    <div class="tags-section">
      <div class="tags-container">
        <div v-for="tagId in editedNote.tags" :key="tagId" class="tag-item"
          :style="{ backgroundColor: tagStore.getTagColor(tagId) }" @click="removeTag(tagId)">
          {{ tagStore.getTagName(tagId) }}
          <span class="remove-tag">❌</span>
        </div>
      </div>

      <button @click="showTagSelector = true" class="add-tag-btn">
        + {{ $t('addtag') }}
      </button>
    </div>

    <div class="content-editor">
      <MdEditor v-model="editedNote.content" :language="language" :theme="theme" :preview-theme="previewTheme" :toolbars="toolbars" >
        <template #defToolbars>
          <Emoji>
            <template #trigger> Emoji </template>
          </Emoji>
           <ThemeSwitch v-model="theme" />
            <PreviewThemeSwitch v-model="previewTheme" />
          
        </template>
      </MdEditor>
    </div>

    <TagSelector v-model="showTagSelector" :current-tags="editedNote.tags" @add="addTag"
      @close="showTagSelector = false" />
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useTagStore } from '../store/store';
import { Note } from '../../type';
// import { useI18n } from 'vue-i18n';
import screenfull from 'screenfull';
import hljs from 'highlight.js';
import prettier from "prettier"
import parserMarkdown from 'prettier/plugins/markdown'
import katex from "katex"
import mermaid from "mermaid"
import cropper from 'cropperjs';

import TagSelector from './TagSelector.vue';
import LimitInput from './LimitInput.vue';
// import { useConfigStore } from '../store/store';

import { Emoji, PreviewThemeSwitch, ThemeSwitch } from '@vavt/v3-extension';
import { MdEditor, config , PreviewThemes,Themes ,ToolbarNames} from 'md-editor-v3';
// const useconfig = useConfigStore()

let language = window.electronAPI.configurate().language === 'en'? 'en-US' : 'zh-CN';
const previewTheme = ref<PreviewThemes>('default');
const theme = ref<Themes>('light');
const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  0,
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'catalog',
  1,
  2
];

config({
  editorExtensions: {
    screenfull: {
      instance: screenfull
    },
    highlight: {
      instance: hljs
    },
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    katex: {
      instance: katex
    },
    mermaid: {
      instance: mermaid
    },
    cropper: {
      instance: cropper
    }
  }
})

const observer = new MutationObserver((mutations:MutationRecord[])=>{
    mutations.forEach(mutation=>{
      if(mutation.type === 'attributes'){
            let t = document.body.getAttribute('data-theme') as Themes
          theme.value = t;

      }
    })
})

observer.observe(document.body,{
  attributes:true,
  attributeFilter:['data-theme']
})


const tagStore = useTagStore();
const props = defineProps<{ note: Note }>();

const emit = defineEmits(['update:note', 'close']);
const editedNote = ref<Note>({ ...props.note });

//添加标签
function addTag(tagId: string) {
  if (editedNote.value.tags.includes(tagId)) {
    editedNote.value.tags = [...editedNote.value.tags, tagId];
  }
  emit('update:note', editedNote.value);
}


function removeTag(tagId: string) {
  editedNote.value.tags = editedNote.value.tags.filter(id => id !== tagId);
  emit('update:note', editedNote.value);
}

function updateContent(field: 'title' | 'content', value: any) {
  editedNote.value[field] = value;
  emit('update:note', editedNote.value);
}

const showTagSelector = ref(false);

</script>
<style lang="css" scoped>
.note-editor {
  background-color: var(--content-color);
  border-radius: 10px;
  box-shadow: var(--shadow);
  padding: 20px;
  position: relative;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}



.tags-section {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.remove-tag {
  margin-left: 5px;
  font-size: 1.1rem;
  font-weight: bold;
}

.add-tag-btn {
  background: none;
  border: 1px dashed #ddd;
  color: #666;
  padding: 4px 12px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.add-tag-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
  color: #333;
}

.content-editor {
  margin-top: 10px;
}

.note-content {
  width: 100%;
  min-height: 200px;
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
  line-height: 1.6;
  font-family: inherit;
}
</style>