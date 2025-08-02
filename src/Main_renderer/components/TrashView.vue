<template>
  <div class="trash-view">
    <div class="trash-header">
      <h2>回收站</h2>
      <div class="trash-actions">
        <button 
          @click="emptyTrash" 
          :disabled="trash.length === 0"
          class="empty-btn"
        >
          <span class="icon">🗑️</span> 清空回收站
        </button>
        <button @click="$emit('close')" class="close-btn">
          <span class="icon">←</span> 返回
        </button>
      </div>
    </div>
    
    <div v-if="trash.length === 0" class="empty-trash">
      <div class="empty-icon">📭</div>
      <p>回收站为空</p>
    </div>
    
    <div v-else class="trash-list">
      <div class="trash-summary">
        共 {{ trash.length }} 个项目，将在 {{ retentionDays }} 天后自动删除
      </div>
      
      <div 
        v-for="note in trash" 
        :key="note.id" 
        class="trash-item"
      >
        <div class="note-info">
          <h3 class="note-title">{{ note.title || '无标题' }}</h3>
          <div class="meta">
            <span class="deleted-date">
              删除时间: {{ formatDate(note.deletedAt ? new Date(note.deletedAt) : new Date() ) }}
            </span>
            <span class="remaining-days">
              剩余: {{ remainingDays(new Date(note.deletedAt ? new Date(note.deletedAt) : new Date())) }} 天
            </span>
          </div>
        </div>
        
        <div class="note-actions">
          <button @click="restoreNote(note.id)" class="restore-btn">
            <span class="icon">↩️</span> 恢复
          </button>
          <button @click="deletePermanently(note.id)" class="delete-btn">
            <span class="icon">❌</span> 永久删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useNoteStore } from '../store/store';


const noteStore = useNoteStore();
const retentionDays = 30;
const trash = computed(()=>noteStore.trashNotes);

function restoreNote(id:string){
    noteStore.restoreFromTrash(id);
}

function deletePermanently(id:string){
    noteStore.deletePermanently(id);
}


function emptyTrash(){
    if(confirm('确定要永久删除回收站中的所有内容吗？此操作不可撤销。')){
        noteStore.emptyTrash();
    }
}

function formatDate(date?:Date){
    if(!date){
        return '未知时间'
    }
    return date.toISOString();
}

function remainingDays(date?:Date){
    if(!date){
        return remainingDays;
    }
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayPassed = Math.floor(diff / 1000*60*60*24);
    return Math.max(0,retentionDays - dayPassed);
}


</script>
<style lang="css" scoped>
.trash-view {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.trash-actions {
  display: flex;
  gap: 10px;
}

button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.empty-btn {
  background-color: #ffebee;
  color: #c62828;
}

.empty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-btn:not(:disabled):hover {
  background-color: #ffcdd2;
}

.close-btn {
  background-color: #e3f2fd;
  color: #1565c0;
}

.close-btn:hover {
  background-color: #bbdefb;
}

.empty-trash {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.trash-list {
  flex: 1;
  overflow-y: auto;
}

.trash-summary {
  background-color: #fff8e1;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  color: #5d4037;
  font-size: 14px;
}

.trash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.trash-item:hover {
  background-color: #fafafa;
}

.note-info {
  flex: 1;
}

.note-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.meta {
  display: flex;
  gap: 15px;
  color: #757575;
  font-size: 13px;
}

.deleted-date {
  font-style: italic;
}

.remaining-days {
  color: #e65100;
  font-weight: 500;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.restore-btn {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.restore-btn:hover {
  background-color: #c8e6c9;
}

.delete-btn {
  background-color: #ffebee;
  color: #c62828;
}

.delete-btn:hover {
  background-color: #ffcdd2;
}

</style>