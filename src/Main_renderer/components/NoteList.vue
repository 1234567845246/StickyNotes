<template>
    <div class="note-list">
        <div class="list-header">
            <h2 v-if="selectedTagName !== null">
                {{ selectedTagName }}
            </h2>
            <h2 v-else>
                {{ $t('allnote') }}
            </h2>
            <div class="search-box">
                <input v-model="noteStore.searchQuery" :placeholder="t('search')" class="input search-input" />
                 <span class="search-icon">🔍</span>
            </div>
        </div>
                <!-- 添加置顶分组 -->
        <div v-if="pinnedNotes.length > 0" class="notes-section">
            <h3 class="section-title">{{ $t('pinned') }}</h3>
            <div class="notes-grid">
                <NoteCard v-for="note in pinnedNotes" :key="note.id" :note="note" />
            </div>
        </div>
        
        <!-- 添加其他便签分组 -->
        <div v-if="unpinnedNotes.length > 0" class="notes-section">
            <h3 v-if="pinnedNotes.length > 0" class="section-title">{{ $t('others') }}</h3>
            <div class="notes-grid">
                <NoteCard v-for="note in unpinnedNotes" :key="note.id" :note="note" />
            </div>
        </div>
        <div v-if="filteredNotes.length === 0" class="empty-notes">
            <template v-if="noteStore.searchQuery">
                {{ $t('searchQueryres1') }}
            </template>
            <template v-else>
                {{ $t('searchQueryres2') }}
            </template>
        </div>
    </div>
</template>
<script setup lang="ts"> 
import {  computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNoteStore ,useTagStore} from '../store/store';
import NoteCard from './NoteCard.vue';

const {t} = useI18n();

const noteStore = useNoteStore();
const tagStore = useTagStore();

const filteredNotes = computed(() => {
    return noteStore.filteredNotes();
});

const pinnedNotes = computed(()=>{
    return filteredNotes.value.filter(note=>note.pinned);
})

const unpinnedNotes = computed(()=>{
  return filteredNotes.value.filter(note=>!note.pinned);
})

const selectedTagName = computed(() => {
    if(tagStore.selectedTag) {
        return tagStore.getTagName(tagStore.selectedTag);
    }
    return null;
});

</script>
<style  lang="css" scoped>
.note-list {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--baseColor-gray6);
}

.search-box {
  position: relative;
  width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 25px;
  font-size: 0.95rem;
  transition: all 0.3s;
}


.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.section-title {
  color: var(--baseColor-gray5);
  font-size: 1.2rem;
  margin: 20px 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--baseColor-gray2);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  flex: 1;
}

.empty-notes {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--baseColor-gray4);
  font-size: 1.2rem;
  padding: 40px;
}

</style>