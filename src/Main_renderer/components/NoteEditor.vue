<template>
  <div class="note-editor">
    <div class="editor-header">
      <LimitInput v-model="editedNote.title" @input="updateContent" />
      <button @click="closeEditor" class="button">❌</button>
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
      <MdEditor v-model="editedNote.content" ref="editorRef" :language="language" :theme="theme"
        :preview-theme="previewTheme" :toolbars="toolbars" style="height: calc(-50px + 100%);"
        :onHtmlChanged="handleHtmlChange" @onDrop="handleDrag" @onUploadImg="handleUploadImg" @onInput="updateContent">
        <template #defToolbars>
          <Emoji>
            <template #trigger> Emoji </template>
          </Emoji>
          <ThemeSwitch v-model="theme" />
          <PreviewThemeSwitch v-model="previewTheme" />
          <ExportToolBar :markdown="editedNote.content" :html="html" />
          <ImportTooBar />
        </template>
      </MdEditor>

    </div>

    <TagSelector v-model="showTagSelector" :current-tags="editedNote.tags" @add="addTag" />
  </div>

</template>
<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { useNoteStore, useTagStore } from '../store/store';
import { Note } from '../../type';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import screenfull from 'screenfull';
import hljs from 'highlight.js';
import prettier from "prettier"
import parserMarkdown from 'prettier/plugins/markdown'
import katex from "katex"
import mermaid from "mermaid"
import cropper from 'cropperjs';

import TagSelector from './TagSelector.vue';
import LimitInput from './LimitInput.vue';
import ExportToolBar from './ExportToolBar.vue';
import ImportTooBar from './ImportTooBar.vue';

import { Emoji, PreviewThemeSwitch, ThemeSwitch } from '@vavt/v3-extension';
import { MdEditor, config, PreviewThemes, Themes, ToolbarNames, ExposeParam } from 'md-editor-v3';
import { getRandomColor } from '../../tools';

const editorRef = useTemplateRef<ExposeParam>('editorRef');
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const html = ref('');
let language = window.electronAPI.configurate().language === 'en' ? 'en-US' : 'zh-CN';
const previewTheme = ref<PreviewThemes>('default');
const theme = ref<Themes>(document.body.getAttribute('data-theme') as 'light' | 'dark');
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
  3,
  4,
  'fullscreen',
  'preview',
  'previewOnly',
  'catalog',
  1,
  2
];
onMounted(() => {
  editorRef.value?.domEventHandlers({
    paste(event, view) {

      const clipboardItems = event.clipboardData?.items;
      if (!clipboardItems) return;
      for (let i = 0; i < clipboardItems.length; i++) {
        let item = clipboardItems[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          event.preventDefault();

          const file = item.getAsFile();
          if (!file) return;
          let filepath = window.electronAPI.getPathForFile(file);
          const state = view.state;
          const seletion = state.selection.main;
          const currentPos = seletion.head;
          if (filepath !== '') {
            const template = `![](image://${filepath})`;
            const anchor = currentPos + template.length;
            view.dispatch({
              changes: {
                from: currentPos,
                to: currentPos,
                insert: template
              },
              selection: { anchor },
              scrollIntoView: true
            })
            view.focus();
          } else {
            readFileAsBase64(file).then((base64: string) => {
              if (base64 !== '') {
                const template = `![](${base64})`;
                const anchor = currentPos + template.length;
                view.dispatch({
                  changes: {
                    from: currentPos,
                    to: currentPos,
                    insert: template
                  },
                  selection: { anchor },
                  scrollIntoView: true
                })
                view.focus();

              }
            })
          }

          break;
        }
      }
    }
  })
})



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

const observer = new MutationObserver((mutations: MutationRecord[]) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      let t = document.body.getAttribute('data-theme') as Themes
      theme.value = t;

    }
  })
})

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-theme']
})


const tagStore = useTagStore();
const noteStore = useNoteStore();

const editedNote = ref<Note>(getInitialNote());

function getInitialNote(): Note {
  if (route.name === 'create') {
    // 创建新便签
    let note = {
      id: crypto.randomUUID(),
      title: t('newNoteTitle'),
      content: '',
      color: getRandomColor(),
      tags: [],
      pinned: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    useNoteStore().addNote(note);
    return note;
  } else {
    // 编辑现有便签
    let note = noteStore.getNoteById(route.params.id as string);
    if (note) {
      return note
    } else {
      note = {
        id: crypto.randomUUID(),
        title: t('newNoteTitle'),
        content: '',
        color: getRandomColor(),
        tags: [],
        pinned: false,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      useNoteStore().addNote(note);
      return note;
    }
  }
}

// 保存笔记并返回首页
async function saveNote() {
  if (editedNote.value.id) {
    noteStore.updateNote(editedNote.value.id, editedNote.value);
  } else {
    editedNote.value = await noteStore.addNote(editedNote.value) as Note;
  }

}

function closeEditor() {
  router.push({ name: 'home' });
}





//添加标签
function addTag(tagId: string) {
  useNoteStore().addTagToNote(editedNote.value.id, tagId)
}

function handleHtmlChange(h: string) {
  html.value = h;
}


function removeTag(tagId: string) {
  useNoteStore().removeTagFromNote(editedNote.value.id, tagId);
}

function updateContent() {
  // editedNote.value[field] = value;
  saveNote();
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function handleDrag(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer !== null) {
    if (e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type.startsWith('image/')) {
          let filepath = window.electronAPI.getPathForFile(file);
          if (filepath !== '') {
            editorRef.value?.insert(() => {
              return {
                targetValue: `![](image://${filepath})`,
                select: false
              }
            });
          }
        }
      }
    }
  }
}

async function handleUploadImg(files: Array<File>, callback: (urls: string[] | { url: string; alt: string; title: string }[]) => void) {
  const res = await Promise.all(
    files.map(file => {
      return new Promise((resolve) => {
        let filepath = window.electronAPI.getPathForFile(file);
        if (filepath !== '') {
          resolve(`image://${filepath}`)
        } else {
          readFileAsBase64(file).then((base64: string) => {
            resolve(base64)
          })
        }
      })
    })
  ) as string[];
  callback(res)
}


const showTagSelector = ref(false);

</script>
<style lang="css" scoped>
.note-editor {
  border-radius: 10px;
  box-shadow: var(--shadow);
  padding: 20px;
  position: relative;
  height: calc(-40px + 100%);
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
  height: calc(-100px + 100%);
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