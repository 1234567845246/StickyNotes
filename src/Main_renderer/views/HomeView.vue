<template>

  <div class="app-container">
    <div class="sidebar-wrapper" :class="{ 'sidebar-visible': showSidebar }">
      <Sidebar :show="showSidebar" @close="showSidebar = false"  />
    </div>
    <div class="main-content" :class="{ 'main-narrow': showSidebar }">
      <AppHeader @toggle-sidebar="showSidebar = !showSidebar" @create-note="createNewNote" />
      <div class="content-area">
          <RouterView/>
      </div>
    </div>

   

    
  




  </div>
</template>

<script setup lang="ts">
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { RouterView } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import AppHeader from '../components/Appheader.vue';
import { useNoteStore, useTagStore } from '../store/store';

const router = useRouter();
const noteStore = useNoteStore();
const tagStore = useTagStore();

const showSidebar = ref(false);

// 创建新笔记路由跳转
function createNewNote() {
  router.push({ name: 'create' });
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
  transition: transform 0.3s cubic-bezier(.4, 0, .2, 1);
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
  transition: left 0.3s cubic-bezier(.4, 0, .2, 1), width 0.3s cubic-bezier(.4, 0, .2, 1);
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