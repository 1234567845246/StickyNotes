<template>
    <CustomDialog v-model="model" :title="t('tagmanager')">
        <div class="add-tag-form">
            <input v-model="newTagName" :placeholder="t('newtagname')" class="input tag-input" />
            <input type="color" v-model="newTagColor" class="color-picker" />
            <button @click="addNewTag" class="button add-btn">{{ $t('add') }}</button>
        </div>
        <!-- 标签列表 -->
        <div class="tag-list">
            <div v-for="tag in tagStore.tags" :key="tag.id" class="tag-item">
                <div v-if="editingTagId !== tag.id" class="tag-display">
                    <TagBadge :tag="tag" :count="tagUsageCount[tag.id]" />
                    <div class="tag-actions">
                        <button class="button edit-btn" @click="startEditTag(tag)">{{ $t('edit') }}</button>
                        <button class="button delete-btn" @click="removeTag(tag.id)">{{ $t('delete') }}</button>
                    </div>
                </div>
                <div v-else class="tag-edit-form">
                    <input v-model="editTagName" class="input tag-input" />
                    <input type="color" v-model="editTgColor" class="color-picker" />
                    <button class="button save-btn" @click="saveEditTag">{{ $t('save') }}</button>
                    <button class="button cancel-btn" @click="cancelEdit">{{ $t('cancel') }}</button>
                </div>
            </div>
        </div>
        <div v-if="tagStore.tags.length === 0" class="empty-tags">
            {{ $t('searchQueryres2') }}
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNoteStore, useTagStore } from '../store/store';
import TagBadge from './TagBadge.vue';
import CustomDialog from './CustomDialog.vue';
import { Tag } from '../../type';
import { useI18n } from 'vue-i18n';


const model = defineModel({ type: Boolean, required: true })
const { t } = useI18n();

const tagStore = useTagStore();
const newTagName = ref('');
const newTagColor = ref('#4fc3f7');
const editingTagId = ref<string | null>(null);
const editTagName = ref('');
const editTgColor = ref('');

//添加新标签
function addNewTag() {
    if (newTagName.value.trim()) {
        tagStore.addTag({
            name: newTagName.value.trim(),
            color: newTagColor.value
        });
        newTagName.value = '';
    }
}

function removeTag(tagId: string) {
    if (confirm(t('deleteConfirm'))) {
        tagStore.removeTag(tagId);
    }
}

//开始编辑标签
function startEditTag(tag: Tag) {
    editingTagId.value = tag.id;
    editTagName.value = tag.name;
    editTgColor.value = tag.color
}

//保存编辑
function saveEditTag() {
    if (editingTagId.value && editTagName.value.trim()) {
        tagStore.updateTag(editingTagId.value, {
            name: editTagName.value.trim(),
            color: editTgColor.value
        })
    }
}

//取消编辑
function cancelEdit() {
    editingTagId.value = null;
    editTagName.value = '';
    editingTagId.value = '';
}

//标签使用统计
const tagUsageCount = computed(() => {
    const noteStore = useNoteStore();
    const counts: Record<string, number> = {};

    tagStore.tags.forEach(tag => {
        counts[tag.id] = noteStore.notes.filter(note => note.tags.includes(tag.id)).length;
    });
    return counts;
})

</script>

<style lang="css" scoped>
.add-tag-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tag-input {
    flex: 1;
}


.color-picker {
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
}



.add-btn {
    background-color: var(--trash-restore-btn-background);
    color: var(--trash-restore-btn-foreground);
}

.add-btn:hover {
    background-color: var(--trash-restore-btn-hover);
}

.tag-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.tag-item {
    padding: 12px;
    border-radius: 6px;
    background-color: var(--menu-background);
    transition: all 0.3s;
}

.tag-item:hover {
    background-color: var(--menu-hover-background);
}

.tag-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tag-actions {
    display: flex;
    gap: 8px;
}

.edit-btn {
    background-color: var(--button-primary);
    color: var(--button-color);
}

.edit-btn:hover {
    background-color: var(--button-primary-hover);
}

.delete-btn {
    background-color: var(--trash-delete-btn-background);
    color: var(--trash-delete-btn-foreground);
}

.delete-btn:hover {
    background-color: var(--trash-delete-btn-hover);
}

.tag-edit-form {
    display: flex;
    gap: 10px;
    align-items: center;
}

.save-btn {
    background-color: var(--save-btn-background);
    color: var(--save-btn-foreground);
}

.save-btn:hover {
    background-color: var(--save-btn-hove);
}

.cancel-btn {
    background-color: var(--baseColor-gray1);
    color: var(--button-color);
}

.cancel-btn:hover {
    background-color: var(--button-hover-background);
}

.empty-tags {
    text-align: center;
    background-color: var(--button-hover-background);
    /* color: var(--baseColor-gray4); */
    padding: 20px;
}
</style>