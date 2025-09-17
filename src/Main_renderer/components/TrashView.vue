<template>
  <div class="trash-view">
    <div class="trash-header">
      <h2>{{ t('trash') }}</h2>
      <div class="trash-actions">
        <button @click="emptyTrash" :disabled="trash.length === 0" class="empty-btn">
          <span class="icon">🗑️</span> {{ t('emptytrash') }}
        </button>
        <button @click="close" class="close-btn">
          <span class="icon">←</span>{{ $t('back') }}
        </button>
      </div>
    </div>

    <div v-if="trash.length === 0" class="empty-trash">
      <div class="empty-icon">📭</div>
      <p>{{ $t('emptytrash1') }}</p>
    </div>

    <div v-else class="trash-list">
      <div class="trash-summary">
        {{ t('trashsummary', { length: trash.length, retentionDays: retentionDays }) }}
      </div>

      <div v-for="note in trash" :key="note.id" class="trash-item">
        <div class="note-info">
          <h3 class="note-title">{{ note.title || t('notitle') }}</h3>
          <div class="meta">
            <span class="deleted-date">
              {{ t('deletetime') }} {{ formatDate(note.deletedAt ? new Date(note.deletedAt) : new Date()) }}
            </span>
            <span class="remaining-days">
              {{ t('remainday', {
                day: remainingDays(new Date(note.deletedAt ? new Date(note.deletedAt) : new Date()))
              }) }}
            </span>
          </div>
        </div>

        <div class="note-actions">
          <button @click="restoreNote(note.id)" class="restore-btn">
            <span class="icon">↩️</span> {{ t('recover') }}
          </button>
          <button @click="deletePermanently(note.id)" class="delete-btn">
            <span class="icon">❌</span> {{ t('perdelete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useNoteStore } from '../store/store';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const noteStore = useNoteStore();
const retentionDays = computed(() => noteStore.trashConfig.retentionDays);
const trash = computed(() => noteStore.trashNotes);

function restoreNote(id: string) {
  noteStore.restoreFromTrash(id);
}

function close() {
  router.push({ name: 'home' });
}

function deletePermanently(id: string) {
  if (confirm(t('emptytrash3'))) {
    noteStore.deletePermanently(id);
  }
}


function emptyTrash() {
  if (confirm(t('emptytrash2'))) {
    noteStore.emptyTrash();
  }
}

function formatDate(date?: Date) {
  if (!date) {
    return '未知时间'
  }
  return date.toISOString();
}

function remainingDays(date: Date) {

  if (!date) {
    return retentionDays;
  }
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  return Math.max(0,30 -  Math.round(diffMs / (1000 * 60 * 60 * 24)));
}


</script>
<style lang="css" scoped>
.trash-view {
  background-color: var(--trash-background);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  height: calc(-40px + 100%);
  display: flex;
  flex-direction: column;
}

.trash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--trash-header-border);
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
  background-color: var(--trash-empty-btn-background);
  color: var(--trash-empty-btn-foreground);
}

.empty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-btn:not(:disabled):hover {
  background-color: var(--trash-empty-btn-hover);
}

.close-btn {
  background-color: var(--trash-close-btn-background);
  color: var(--trash-close-btn-foreground);
}

.close-btn:hover {
  background-color: var(--trash-close-btn-hover);
}

.empty-trash {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--trash-empty-icon);
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
  background-color: var(--trash-summary-background);
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  color: var(--trash-summary-foreground);
  font-size: 14px;
}

.trash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--trash-item-border);
  transition: background-color 0.2s;
}

.trash-item:hover {
  background-color: var(--trash-item-hover);
}

.note-info {
  flex: 1;
}

.note-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--content-foreground);
}

.meta {
  display: flex;
  gap: 15px;
  color: var(--trash-meta-color);
  font-size: 13px;
}

.deleted-date {
  font-style: italic;
}

.remaining-days {
  color: var(--trash-remaining-days);
  font-weight: 500;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.restore-btn {
  background-color: var(--trash-restore-btn-background);
  color: var(--trash-restore-btn-foreground);
}

.restore-btn:hover {
  background-color: var(--trash-restore-btn-hover);
}

.delete-btn {
  background-color: var(--trash-delete-btn-background);
  color: var(--trash-delete-btn-foreground);
}

.delete-btn:hover {
  background-color: var(--trash-delete-btn-hover);
}
</style>