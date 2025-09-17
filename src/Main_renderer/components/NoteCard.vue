<template>
  <div class="note-card" :style="{ backgroundColor: cardColor }" @dblclick="handleDoubleClick"
    @contextmenu="handleContextmenu">
    <div>
      <div class="card-header">
        <h3 class="note-title" v-if="!editTitle">
          {{ note.title }}
          <span v-if="note.isEncrypted" class="encrypted-icon" title="已加密">🔒</span>
        </h3>
        <input v-else type="text" v-model="renameTitle" @blur="handleRenameTitle" @keyup.enter="handleRenameTitle"
          :ref="'note' + props.note.id" />
        <button class="pin-btn" :class="{ pinned: note.pinned }" @click.stop="togglePin"
          :title="note.pinned ? t('pinned') : t('unpin')">
          {{ note.pinned ? '📌' : '📍' }}
        </button>
      </div>


      <div class="tags-container">
        <div v-for="tag in noteTags" :key="tag.id" class="tag-badge" :style="{ backgroundColor: tag.color }">
          {{ tag.name }}
        </div>
      </div>
      <div class="card-footer">
        <span class="date">{{ formattedDate }}</span>
        <div class="actions">
          <button class="edit-btn btn" @click="handleEditorClick">
            {{ $t('edit') }}
          </button>
          <button class="delete-btn btn" @click="handleDeleteClick">
            {{ $t('delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <EncryptionDialog v-model="showEncryptionDialog" :is-encrypted="!!note.isEncrypted"
    @close="showEncryptionDialog = false" @confirm="handleEncryptionConfirm" />
</template>

<script setup lang="ts">

import { computed, ref, useTemplateRef, nextTick } from 'vue';
import { Note } from '../../type';
import { useNoteStore, useTagStore } from '../store/store';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ContextMenu from '@imengyu/vue3-context-menu'
import { EncryptionAlgorithm } from '../../type';
import EncryptionDialog from './EncryptionDialog.vue';
import { getNoteColor } from '../../tools';
import { themeManager } from '../theme/theme';


const { t } = useI18n();
const router = useRouter();

const props = defineProps<{ note: Note }>();
const showEncryptionDialog = ref(false);
const cardColor = ref(getNoteColor(props.note.color, document.body.getAttribute('data-theme') === 'dark'));

themeManager.onThemeChange((theme) => {
  // 主题变化时强制更新颜色
  cardColor.value = getNoteColor(props.note.color, theme === 'dark');
});


const handleDoubleClick = async () => {
  if (props.note.isEncrypted) {
    showEncryptionDialog.value = true;
  } else {
    handleEditorClick();
  }
};

const handleEncryptionConfirm = async (password: string, algorithm?: EncryptionAlgorithm) => {
  const noteStore = useNoteStore();

  if (props.note.isEncrypted) {
    try {
      // 解密
      const decryptedContent = await window.electronAPI.decryptText(
        props.note.encryptedContent!,
        password,
        props.note.salt!,
        props.note.iv!,
        props.note.algorithm as EncryptionAlgorithm
      );



      // 更新便签并保存
      await noteStore.updateNote(
        props.note.id,
        {

          content: decryptedContent === undefined ? '' : decryptedContent,
          isEncrypted: false,
          encryptedContent: undefined,
          salt: undefined,
          iv: undefined,
          algorithm: undefined
        });

      // 解密成功后打开编辑器
      handleEditorClick();
    } catch (error) {
      alert('密码错误或数据已损坏');
    }
  } else {
    // 加密
    if (!algorithm) return;

    const { encryptedData, salt, iv } = await window.electronAPI.encryptText(
      props.note.content,
      password,
      algorithm
    );

    // 更新便签并保存
    await noteStore.updateNote(
      props.note.id, {
      ...props.note,
      content: '🔒 此便签已加密',
      isEncrypted: true,
      encryptedContent: encryptedData,
      salt,
      iv,
      algorithm
    });
  }

  showEncryptionDialog.value = false;
};
const renameTitle = ref(props.note.title);
const tagStore = useTagStore();
const noteStore = useNoteStore();
const editTitle = ref(false);
const titleInputRef = useTemplateRef<HTMLInputElement>('note' + props.note.id);

function togglePin() {
  noteStore.togglePinNote(props.note.id);
}

function handleEditorClick() {
  router.push({ name: 'edit', params: { id: props.note.id } });
}

function handleDeleteClick() {

  noteStore.removeNote(props.note.id);
}

function handleRenameTitle() {
  editTitle.value = false;
  if (renameTitle.value.trim() === '') {
    renameTitle.value = props.note.title; // 如果标题为空，恢复原标题
  } else if (renameTitle.value !== props.note.title) {
    noteStore.updateNote(props.note.id, { title: renameTitle.value });
  }
}

function handleContextmenu(event: MouseEvent) {
  event.preventDefault();
  ContextMenu.showContextMenu({
    x: event.clientX, y: event.clientY,
    theme: document.body.getAttribute('data-theme') === 'light' ? 'default' : 'default dark',
    items: [
      { label: props.note.pinned ? t('unpin') : t('pinned'), onClick: togglePin },
      {
        label: t('edit'),
        onClick: () => {
          if (props.note.isEncrypted) {
            showEncryptionDialog.value = true;
          } else {
            handleEditorClick();
          }
        }
      },
      { label: t('delete'), onClick: handleDeleteClick },
      {
        label: t('perdelete'), onClick: async () => {
          let res = confirm(t('emptytrash4'));
          if (res) {
            await noteStore.deletePermanently(props.note.id);
          }
        },
        divided: true
      },
      {
        label: t('copy'), onClick: () => {
          window.navigator.clipboard.writeText(props.note.content)
        }
      },
      {
        label: t('rename'), onClick: () => {
          editTitle.value = true;
          nextTick(() => {
            if (titleInputRef.value) {
              titleInputRef.value.focus();
              titleInputRef.value.select();
            }
          });
        },
        divided: true
      },

      {
        label: props.note.isEncrypted ? t('encryption.title2') : t('encryption.title1'),
        onClick: () => {
          showEncryptionDialog.value = true;
        }
      }
    ]
  })
}

const formattedDate = computed(() => {
  return new Date(props.note.updatedAt).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: new Date(props.note.updatedAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
});

const noteTags = computed(() => {
  return props.note.tags.map(tagId => ({
    id: tagId,
    name: tagStore.getTagName(tagId),
    color: tagStore.getTagColor(tagId)
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
  height: 100px;
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.note-card.pinned {
  border-left: 4px solid #ffb74d;
  background-color: rgba(255, 183, 77, 0.05);
}

.encrypted-icon {
  display: inline-block;
  margin-left: 5px;
  font-size: 0.9em;
  opacity: 0.8;
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

.pin-btn.pinned {
  color: #ffb74d;
}

.pin-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
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
  color: var(--baseColor-gray7);
}

.actions {
  display: flex;
  gap: 5px;
}


.btn {
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: var(--card-button-background);
  transition: background-color 0.3s;
}

.edit-btn {
  color: var(--card-button-foreground);
}

.delete-btn {
  color: var(--card-button-foreground);
}
</style>