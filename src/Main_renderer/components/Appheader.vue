<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const {t} = useI18n();
defineEmits(['toggle-sidebar', 'create-note']);
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        ☰
      </button>
    </div>
    
    <div class="search-container">
      <input 
        type="text" 
        :placeholder="t('search')" 
        class="search-input"
      >
      <span class="search-icon">🔍</span>
    </div>
    
    <div class="header-right">
      <button class="new-note-btn" @click="$emit('create-note')">
        + {{ $t('newNoteTitle') }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--main-head-background);
  color: white;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var( --shadow);
  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
}

.search-container {
  flex: 1;
  max-width: 300px;
  margin: 0 20px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: none;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.25);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.new-note-btn {
  background-color: #ffb74d;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-note-btn:hover {
  background-color: #ffa726;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 10px;
  }
  
  h1 {
    display: none;
  }
  
  .search-container {
    margin: 0 10px;
  }
  
  .new-note-btn span {
    display: none;
  }
  
  .new-note-btn::before {
    content: "+";
    font-size: 1.2rem;
  }
}
</style>