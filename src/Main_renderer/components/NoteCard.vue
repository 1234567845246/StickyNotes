<template>
    <div class="note-card" :style="{backgroundColor:note.color}">
      <div v-if="isEditting" class="edior-container">

      </div>
      <div v-else>
        <div class="card-header">
          <h3 class="note-title">
            {{ note.title }}
          </h3>
          <button class="button pin-btn" v-if="note.pinned">
            📌
          </button>
        </div>
        <div class="note-content">
          {{ note.content }}
        </div>
        <div class="tags-container">
          <div v-for="tag in noteTags" :key="tag.id" class="tag-badge" :style="{backgroundColor:tag.color}">
              {{ tag.name }}
          </div>
        </div>
        <div class="card-footer">
            <span class="date">{{ formattedDate }}</span>
            <div class="actions">
                <button class="edit-btn ">
                  {{ $t('edit') }}
                </button>
                <button class="delete-btn">
                  {{ $t('delete') }}
                </button>
            </div>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { Note } from '../../type';
import { useTagStore } from '../store/store';


const props = defineProps<{ note: Note }>();
const tagStore = useTagStore();
const isEditting = ref<boolean>(false);

const emit = defineEmits(['update', 'delete']);



const formattedDate = computed(()=>{
  return new Date(props.note.updatedAt).toLocaleDateString('zh-CN',{
    month:'short',
    day:'numeric',
    year:new Date(props.note.updatedAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined  
  });
});

const noteTags = computed(()=>{
  return props.note.tags.map(tagId=>({
    id:tagId,
    name:tagStore.getTagName(tagId),
    color:tagStore.getTagColor(tagId)
  }))
})

</script>


<style lang="css" scoped>
.note-card {
  border-radius: 10px;
  padding: 15px;
  border-radius: var(--border-radius);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 250px;
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.note-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: balance;
  white-space: nowrap;
}

.pin-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: default;
}

.note-content {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.5;
  /* color: #333; */
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 5;
  box-orient: vertical;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.tag-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: white;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.date {
  font-size: 0.8rem;
  color: var(--baseColor-gray4);
}

.actions {
  display: flex;
  gap: 5px;
}



.edit-btn {
  /* background-color: rgba(255, 255, 255, 0.7); */
  color: var(--baseColor-gray3);
}

.delete-btn {
  /* background-color: rgba(244, 67, 54, 0.2); */
  color: var(--baseColor-gray3);
}


</style>