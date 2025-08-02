<template>
    <CustomDialog v-model="props.modelValue">
        <template #title>
            <span>{{ t('config.title') }}</span>
        </template>
        <div class="tags-grid">
            <div v-for="tag in avaliableTags" :key="tag.id" class="tag-option" :style="{ backgroundColor: tag.color }"
                @click="addTag(tag.id)">
                {{ tag.name }}
            </div>
        </div>
        <button @click="createNewTag" class="new-tag-btn"></button>
    </CustomDialog>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import CustomDialog from './CustomDialog.vue';
import { useTagStore } from '../store/store';


const tagStore = useTagStore();

const props = defineProps<{
    currentTags: string[],
    modelValue:boolean
}>();

const emit = defineEmits(['add', 'close']);

//过滤掉以添加的标签
const avaliableTags = computed(() => {
    return tagStore.tags.filter(tag => !props.currentTags.includes(tag.id));
})

//添加标签
function addTag(tagId: string) {
    emit('add', tagId);
}

//创建新标签
function createNewTag() {
    const newTagName = prompt('输入新标签名称');
    if (newTagName) {
        tagStore.addTag({
            name: newTagName,
            color: '#4fc3f7'
        })
    }
}

</script>


<style lang="css" scoped>
.tags-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 20px;
    overflow-y: auto;
    max-height: 300px;
}

.tag-option {
    padding: 10px;
    border-radius: 6px;
    color: white;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.tag-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.new-tag-btn {
    background-color: #f5f5f5;
    border: none;
    padding: 12px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    border-top: 1px solid #eee;
}

.new-tag-btn:hover {
    background-color: #e0e0e0;
    color: #333;
}
</style>