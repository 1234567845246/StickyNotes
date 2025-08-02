import { defineStore } from 'pinia'
import { ref, toRaw, computed} from 'vue'
import { defaultconfig, Config, TagState, Tag, Note, NoteState } from '../../type'


export const useConfigStore = defineStore('config', () => {
    const config = ref<Config>({ ...defaultconfig });
    const loaded = ref(false);

    async function loadConfig() {
        let cfg = window.electronAPI.configurate?.();
        if (!cfg) {
            cfg = await window.electronAPI.readConfig();
        }
        config.value = cfg;
        loaded.value = true;
    }

    async function setConfig(newConfig: Config) {
        config.value = newConfig
        await window.electronAPI.writeConfig(toRaw(config.value));
    }
    async function saveConfig() {
        await window.electronAPI.writeConfig(toRaw(config.value));
    }
    async function resetConfig() {
        config.value = { ...defaultconfig };
        await window.electronAPI.writeConfig(config.value);
    }

    return {
        config,
        setConfig,
        resetConfig,
        loadConfig,
        saveConfig,
        loaded
    }
})


export const useTagStore = defineStore('tag', () => {
    const state = ref<TagState>({
        tags: [],
        selectedTag: null
    })


    const tags = computed(() => state.value.tags);
    const selectedTag = computed(() => state.value.selectedTag);

    //添加标签
    function addTag(tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) {
        const newTag = {
            ...tag,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        state.value.tags.push(newTag);
    }
    // 删除标签
    function removeTag(tagId: string) {
        state.value.tags = state.value.tags.filter(tag => tag.id !== tagId);
    }
    // 更新标签
    function updateTag(tagId: string, update: Partial<Omit<Tag, 'id'>>) {
        const index = state.value.tags.findIndex(tag => tag.id === tagId);
        if (index !== -1) {
            state.value.tags[index] = {
                ...state.value.tags[index],
                ...update,
                updatedAt: new Date().toISOString()
            };
        }
    }
    // 选择标签
    function selectTag(tagId: string | null) {
        state.value.selectedTag = tagId;
    }
    // 获取标签颜色
    function getTagColor(tagId: string): string | undefined {
        const tag = state.value.tags.find(tag => tag.id === tagId);
        return tag ? tag.color : undefined;
    }
    // 获取标签名称
    function getTagName(tagId: string): string | undefined {
        const tag = state.value.tags.find(tag => tag.id === tagId);
        return tag ? tag.name : undefined;
    }


    // 初始化标签
    // 这里可以添加一些默认标签
    function initTags() {

        addTag({ name: '工作', color: '#ffb74d' });
        addTag({ name: '个人', color: '#4fc3f7' });
        addTag({ name: '重要', color: '#f44336' });
        addTag({ name: '学习', color: '#66bb6a' });
        addTag({ name: '待办', color: '#ab47bc' });
        addTag({ name: '其他', color: '#90a4ae' });
    }

    return {
        state,
        tags,
        selectedTag,
        addTag,
        removeTag,
        updateTag,
        selectTag,
        getTagColor,
        getTagName,
        initTags
    }
})



export const useNoteStore = defineStore('note', () => {
    const state = ref<NoteState>({
        notes: [],
        searchQuery: '' // 搜索查询
    });

    const activeNotes = computed(() => {
        return  state.value.notes.filter(note => !note.deleted);
    })
    const trashNotes = computed(() => {
       return  state.value.notes.filter(note => note.deleted);
    })

    //获取标签存储
    const tagStore = useTagStore();
    //获取回收站配置
    const trashConfig =computed(()=>toRaw(useConfigStore().config.trashconfig));
    //获取所有标签
    const notes = computed(() => state.value.notes);
    // 获取搜索查询
    const searchQuery = computed(() => state.value.searchQuery);

    // 设置搜索查询
    function setSearchQuery(query: string) {
        state.value.searchQuery = query;
    }
    //设置标签
    function setNotes(notes: Note[]) {
        state.value.notes = notes;
    }
    // 添加便签
    function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'pinned'>) {
        const newNote: Note = {
            ...note,
            id: crypto.randomUUID(),
            deleted: false,    // 新便签默认不在回收站
            pinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        state.value.notes.push(newNote);
    }
    // 更新便签
    function updateNote(noteId: string, update: Partial<Omit<Note, 'id'>>) {
        const index = state.value.notes.findIndex(note => note.id === noteId);
        if (index !== -1) {
            const updatedNote = {
                ...state.value.notes[index],
                ...update,
                updatedAt: new Date().toISOString()
            };
            state.value.notes[index] = updatedNote;
        }
    }

    // 删除便签
    function removeNote(noteId: string) {
      moveToTrash(noteId);
    }
    // 添加标签到便签
    function addTagToNote(noteId: string, tagId: string) {
        const note = state.value.notes.find(note => note.id === noteId);
        if (note && !note.tags.includes(tagId)) {
            note.tags.push(tagId);
            note.updatedAt = new Date().toISOString();
        }
    }

    // 从便签中移除标签
    function removeTagFromNote(noteId: string, tagId: string) {
        const note = state.value.notes.find(note => note.id === noteId);
        if (note) {
            note.tags = note.tags.filter(id => id !== tagId);
            note.updatedAt = new Date().toISOString();
        }
    }

    // 获取过滤后的便签
    function filteredNotes() {
        const query = state.value.searchQuery.toLowerCase();
        const selectedTag = tagStore.selectedTag;
        return activeNotes.value.filter(note => {
            if (selectedTag && !note.tags.includes(selectedTag)) {
                return false; // 如果有选中的标签，且便签不包含该标签，则过滤掉
            }
            if (query) {
                const titleMatch = note.title.toLowerCase().includes(query);
                const contentMatch = note.content.toLowerCase().includes(query);

                const tagMatch = note.tags.some(tagId => {
                    const tag = tagStore.tags.find(t => t.id === tagId);
                    return tag && tag.name.toLowerCase().includes(query);
                });
                return titleMatch || contentMatch || tagMatch;

            }
            return true; // 如果没有搜索查询，则返回所有便签
        });

    }
    function moveToTrash(noteId: string) {
        const index = state.value.notes.findIndex(n => n.id === noteId);
        if (index !== -1) {
            state.value.notes[index] = {
                ...state.value.notes[index],
                deleted: true,
                deletedAt: new Date().toISOString(),
                originalPosition: index      //保留原始位置
            }
        }
    }

    function restoreFromTrash(noteId: string) {
        const noteIndex = state.value.notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
            const note = state.value.notes[noteIndex];


            const restoredNote: Note = {
                ...note,
                deleted: false,
                deletedAt: undefined,
                originalPosition: undefined
            }

            state.value.notes.splice(noteIndex, 1);
            //恢复到原始位置（如果可能）
            if (typeof note.originalPosition === 'number' && note.originalPosition < state.value.notes.length) {
                state.value.notes.splice(note.originalPosition, 0, restoredNote);
            } else {
                //添加到列表末尾
                state.value.notes.push(restoredNote)
            }
        }
    }

    //永久删除
    function deletePermanently(noteId: string) {
        state.value.notes = state.value.notes.filter(note => note.id !== noteId);
    }

    //清空回收站
    function emptyTrash() {
        state.value.notes = state.value.notes.filter(note => !note.deleted);
    }

    //自动清理过期标签
    function autoCleanTrash(){
        if(!trashConfig.value.autoClean){
            return;
        }
        const now = new Date();
        const threshoId = trashConfig.value.retentionDays * 24 * 60 * 60 * 1000;

        state.value.notes = state.value.notes.filter(note=>{
            if(note.deleted && note.deletedAt !== undefined){
                return now.getTime() - new Date(note.deletedAt).getTime() < threshoId;
            }
            return true;
        })
    }
    function initNotes() {
        // 初始化一些默认便签
        addNote({
            title: '欢迎使用 HexEditor',
            content: '这是您的第一个便签！',
            color: '#4fc3f7',
            tags: [],

        });
        addNote({
            title: '待办事项',
            content: '1. 学习 Vue 3\n2. 完成项目文档',
            color: '#ffb74d',
            tags: [],

        });
        addNote({
            title: '个人笔记',
            content: '记录一些个人想法和灵感。',
            color: '#66bb6a',
            tags: [],

        });
    }
    return {
        notes,
        searchQuery,
        activeNotes,
        trashNotes,
        setNotes,
        setSearchQuery,
        addNote,
        updateNote,
        removeNote,
        addTagToNote,
        removeTagFromNote,
        filteredNotes,
        initNotes,

        moveToTrash,
        restoreFromTrash,
        deletePermanently,
        emptyTrash,
        autoCleanTrash
    }
})