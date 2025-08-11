<script setup lang="ts">
defineEmits(['toggle-sidebar']);
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        ☰
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



/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 10px;
  }
}
</style>