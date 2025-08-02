<template>
 <div class="note-editor">
    <div class="editor-header">
      <input
        v-model="editedNote.title"
        @input="updateContent('title', $event.target)"
        class="note-title"
        placeholder="标题"
      />
      <button @click="emit('close')" class="close-btn">×</button>
    </div>
    
    <div class="tags-section">
      <div class="tags-container">
        <div 
          v-for="tagId in editedNote.tags" 
          :key="tagId" 
          class="tag-item"
          :style="{ backgroundColor: tagStore.getTagColor(tagId) }"
          @click="removeTag(tagId)"
        >
          {{ tagStore.getTagName(tagId) }}
          <span class="remove-tag">×</span>
        </div>
      </div>
      
      <button @click="showTagSelector = true" class="add-tag-btn">
        + {{ $t('addtag') }}
      </button>
    </div>
    
    <div class="content-editor">
      <textarea
        v-model="editedNote.content"
        @input="updateContent('content', $event.target)"
        class="note-content"
        :placeholder="t('placeholder')"
      ></textarea>
    </div>
    
    <TagSelector 
      v-model="showTagSelector"
      :current-tags="editedNote.tags"
      @add="addTag"
      @close="showTagSelector = false"
    />
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useTagStore } from '../store/store';
import { Note } from '../../type';
import { useI18n } from 'vue-i18n';
import TagSelector from './TagSelector.vue';

const {t} = useI18n();
const tagStore = useTagStore();
const props = defineProps<{ note: Note }>();

const emit = defineEmits(['update:note', 'close']);
const editedNote = ref<Note>({ ...props.note });

//添加标签
function addTag(tagId: string) {
    if (editedNote.value.tags.includes(tagId)) {
        editedNote.value.tags = [...editedNote.value.tags, tagId];
    }
    emit('update:note', editedNote.value);
}


function removeTag(tagId: string) {
    editedNote.value.tags = editedNote.value.tags.filter(id => id !== tagId);
    emit('update:note', editedNote.value);
}

function updateContent(field: keyof Note,value:any){
    (editedNote.value as any)[field] = value;
    emit('update:note',editedNote.value);
}

const showTagSelector = ref(false);

</script>
<style lang="css" scoped></style>