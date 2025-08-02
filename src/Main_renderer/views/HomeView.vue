<template>

  <div class="app-container">
    <div class="sidebar-wrapper" :class="{ 'sidebar-visible': showSidebar }">
      <Sidebar :show="showSidebar" @close="showSidebar = false" @create-note="createNewNote"
        @toggle-tag-manager="showTagManager = !showTagManager" @export-data="exportData" @import-data="importData"
         @show-trash="showTrashView = true" />
    </div>
    <div class="main-content" :class="{ 'main-narrow': showSidebar }">
      <AppHeader @toggle-sidebar="showSidebar = !showSidebar" @create-note="createNewNote" />
      <div class="content-area">
          <TrashView 
          v-if="showTrashView"
          @restore-note="restoreNoteFromTrash"
          @delete-permanently="deleteNotePermanently"
          @empty-trash="emptyTrash"
          @close="showTrashView = false"
        />
        <NoteList v-else @edit-note="editNote" @delete-note="deleteNote" @toggle-pin="togglePinNote" />
      </div>
    </div>

    <!-- 便签编辑器模态框 -->
    <div v-if="showEditor" class="modal-overlay" @click.self="closeEditor">
      <div class="editor-modal">
        <NoteEditor v-if="selectedNote" :note="selectedNote" @save="saveNote" @close="closeEditor" />
      </div>
    </div>

    <!-- 标签管理器模态框 -->
    <div v-if="showTagManager" class="modal-overlay" @click.self="showTagManager = false">
      <div class="tag-manager-modal">
        <TagManager />
        <button class="close-modal" @click="showTagManager = false">
          &times;
        </button>
      </div>
    </div>




  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NoteList from '../components/NoteList.vue';
import TagManager from '../components/TagManager.vue';
import NoteEditor from '../components/NoteEditor.vue';
import TrashView from "../components/TrashView.vue";
import Sidebar from '../components/Sidebar.vue';
import AppHeader from '../components/Appheader.vue';
import { useI18n } from 'vue-i18n';
import { useNoteStore, useTagStore } from '../store/store';
import { Note } from '../../type';

const noteStore = useNoteStore();
const tagStore = useTagStore();

//当前选中的便签(用于编辑)
const selectedNote = ref<Note | null>(null);


const showEditor = ref(false);
const showTagManager = ref(false);
const showSidebar = ref(false);

// 添加回收站视图状态
const showTrashView = ref(false);



const { t } = useI18n();


function createNewNote() {
  selectedNote.value = {
    id: Date.now().toString(),
    title: t('newNoteTitle'),
    content: '',
    tags: [],
    color: getRandomColor(),
    pinned: false,
    deleted:false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  showEditor.value = true;
}

//编辑便签
function editNote(note: Note) {
  selectedNote.value = { ...note };
  showEditor.value = true;
}

//保存便签
function saveNote(note: Note) {
  if (note.id) {
    noteStore.updateNote(note.id, note);
  } else {
    noteStore.addNote(note);
  }
  closeEditor();
}



// 从回收站恢复
function restoreNoteFromTrash  (noteId: string)  {
  noteStore.restoreFromTrash(noteId);
};

// 永久删除
function deleteNotePermanently (noteId: string)  {
  noteStore.deletePermanently(noteId);
};

// 清空回收站
function emptyTrash () {
  noteStore.emptyTrash();
  showTrashView.value = false; // 关闭回收站视图
};

//删除便签
function deleteNote(noteId: string) {
  noteStore.removeNote(noteId);
}


//关闭编辑器
function closeEditor() {
  showEditor.value = false;
  selectedNote.value = null;
}

//切换便签置顶状态
function togglePinNote(noteId: string) {
  const note = noteStore.notes.find(n => n.id === noteId);
  if (note) {
    noteStore.updateNote(noteId, { pinned: !note.pinned })
  }
}


function exportData() {
  const data = JSON.stringify(noteStore.notes);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `note-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 导入数据
function importData() {
  console.log('errr');
};

function getRandomColor() {
  const colors = ['#fff9c4', // 黄色
    '#c8e6c9', // 绿色
    '#bbdefb', // 蓝色
    '#f8bbd0', // 粉色
    '#e1bee7', // 紫色
    '#ffccbc'  // 橙色
  ]
  return colors[Math.floor(Math.random() * colors.length)];
}

onMounted(() => {
  tagStore.initTags();
  noteStore.initNotes();
  noteStore.autoCleanTrash();

  window.electronAPI.createNote(() => createNewNote());
});
</script>


<style lang="css" scoped>

.app-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.sidebar-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  transform: translateX(-250px);
}
.sidebar-visible {
  transform: translateX(0);
}

.main-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: left 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1);
}
.main-narrow {
  left: 250px;
  width: calc(100% - 250px);
}

.content-area {
  flex: 1;
  overflow: auto;
  padding: 20px;
  overflow-x: hidden;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.editor-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.tag-manager-modal {
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: auto;
}

.about-modal {
  position: relative;
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.about-modal h2 {
  margin-top: 0;
  color: #333;
}

.about-modal p {
  margin: 15px 0;
  color: #555;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal:hover {
  background-color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-modal {
    width: 95%;
    height: 95vh;
  }

  .tag-manager-modal {
    width: 95%;
    height: 90vh;
  }
}
</style>