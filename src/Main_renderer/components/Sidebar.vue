<template>
  <div class="sidebar" :class="{ 'sidebar-open': show }">
    <div class="sidebar-header">
      <h2>{{ t('title') }}</h2>
      <button class="close-sidebar" @click="emit('close')">
        &times;
      </button>
    </div>

    <div class="sidebar-content">
      <div class="sidebar-section">
        <h3>{{ $t('note') }}</h3>
        <ul class="sidebar-menu">
          <li @click="createNote()">
            <span class="icon">📝</span> {{ $t('newNoteTitle') }}
          </li>
          <li @click="showTrash()">
            <span class="icon">
              🗑️
            </span>
            {{ $t('trash') }}
            <span v-if="trashCount > 0" class="badge">
              {{ trashCount }}
            </span>
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3>{{ $t('tagclass') }}</h3>
        <ul class="sidebar-menu">
          <li @click="showAllNote(null)">
            <span class="icon">📋</span> {{ $t('allnote') }}
          </li>
          <li v-for="tag in tagStore.tags" :key="tag.id" @click="showAllNote(tag.id)">
            <span class="tag-color" :style="{ backgroundColor: tag.color }"></span>
            {{ tag.name }}
          </li>
          <li @click="ShowTagManager()">
            <span class="icon">⚙️</span> {{ $t('tagmanage') }}
          </li>
        </ul>
      </div>
      <div class="sidebar-footer">
        <button @click="showabout" class="about-btn">
          {{ $t('about') }}
        </button>
      </div>
    </div>
  </div>
   <TagManager  v-model="showTagManager"/>
</template>

<script setup lang="ts">
import { useTagStore, useNoteStore } from '../store/store';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import TagManager from './TagManager.vue';
const { t } = useI18n();
const showTagManager = ref(false);
const router = useRouter();
defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close']);

const noteStore = useNoteStore();
const tagStore = useTagStore();

const trashCount = computed(() => noteStore.trashNotes.length);

// 创建新笔记
function createNote() {
  router.push({ name: 'create' });
}

// 显示回收站
function showTrash() {
  router.push({ name: 'trash' });
}

// 显示所有笔记
function showAllNote(tagId:string|null){
  tagStore.selectTag(tagId);
  router.push({name:'home'});
}

function ShowTagManager(){
    showTagManager.value = true;
}

function showabout() {
  window.electronAPI.showAbout();
}

</script>

<style lang="css" scoped>
.sidebar {
  width: 250px;
  background-color: var(--aside-background);
  height: 100%;
  position: fixed;
  left: -250px;
  top: 0;
  transition: left 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px var(--shadow);
  overflow: hidden;

  transition: left 0.3s ease, scrollbar-color 0.3s ease;

}

.sidebar-open {
  left: 0;
}

.sidebar-header {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--borderColor);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.close-sidebar {
  background: none;
  border: none;
  color: var(--button-color);
  font-size: 1.5rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-sidebar:hover {
  background-color: var(--button-hover-background);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
  /* 滚动条样式 - 默认隐藏 */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.sidebar:hover .sidebar-content{
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

.sidebar-content::-webkit-scrollbar{
  width: 6px;
  background-color: transparent;
}

.sidebar:hover .sidebar-content::-webkit-scrollbar{
  background-color: var(--scrollbar-track);
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 3px;
}

.sidebar:hover .sidebar-content::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border: 1px solid var(--scrollbar-track);
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

.sidebar-section {
  margin-bottom: 25px;
}

.sidebar-section h3 {
  padding: 0 20px;
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--menu-title-background);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: var(--menu-background);
  color: var(--menu-foregound);
}

.sidebar-menu li {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.sidebar-menu li:hover {
  background-color: var(--menu-hover-background);
}

.icon {
  margin-right: 12px;
  font-size: 1.1rem;
}

.badge {
  background-color: #f44336;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  margin-left: auto;
}

.tag-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--borderColor);
}

.about-btn {
  width: 100%;
  padding: 10px;
  background-color: var(--button-about);
  color: var(--button-aobut-foreground);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.about-btn:hover {
  background-color: var(--button-about-hover);
}
</style>