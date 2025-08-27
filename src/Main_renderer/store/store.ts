import { defineStore } from 'pinia'
import { ref, toRaw, computed, ComputedRef } from 'vue'
import { defaultconfig, Config, TagState, Tag, Note, NoteState, TrashConfig } from '../../type'


export const useConfigStore = defineStore('config', () => {
    const config = ref<Config>({ ...defaultconfig });
    const loaded = ref(false);

    async function loadConfig() {
        let cfg = window.electronAPI.configurate();

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
        await window.electronAPI.writeConfig(toRaw(config.value));
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
    async function addTag(tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) {
        const newTag = {
            ...tag,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // 保存到数据库
        const success = await window.electronAPI.saveTag(newTag);
        if (success) {
            state.value.tags.push(newTag);
        }
    }
    // 删除标签
    async function removeTag(tagId: string) {
        // 从数据库删除
        const success = await window.electronAPI.deleteTag(tagId);
        if (success) {
            state.value.tags = state.value.tags.filter(tag => tag.id !== tagId);
        }
    }
    // 更新标签
    async function updateTag(tagId: string, update: Partial<Omit<Tag, 'id'>>) {
        const index = state.value.tags.findIndex(tag => tag.id === tagId);
        if (index !== -1) {
            const updatedTag = {
                ...state.value.tags[index],
                ...update,
                updatedAt: new Date().toISOString()
            };

            // 更新到数据库
            const success = await window.electronAPI.saveTag(updatedTag);
            if (success) {
                state.value.tags[index] = updatedTag;
            } else {
                console.error('Failed to update tag in database');
            }
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
    // 添加加载标签的方法
    async function loadTags() {
        const tags = await window.electronAPI.getTags();
        state.value.tags = tags;
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
        loadTags
    }
})



export const useNoteStore = defineStore('note', () => {
    const state = ref<NoteState>({
        notes: [],
        searchQuery: '' // 搜索查询
    });

    const activeNotes = computed(() => {
        return state.value.notes.filter(note => !note.deleted);
    })
    const trashNotes = computed(() => {
        return state.value.notes.filter(note => note.deleted);
    })

    //获取标签存储
    const tagStore = useTagStore();
    //获取回收站配置
    const trashConfig: ComputedRef<TrashConfig> = computed(() => { return { autoClean: useConfigStore().config.autoClean, retentionDays: useConfigStore().config.retentionDays } });
    //获取所有标签
    const notes = computed(() => {
        return [...state.value.notes].sort((a, b) => {
            if (a.pinned && !b.pinned) {
                return -1;
            }
            if (!a.pinned && b.pinned) {
                return 1;
            }
            // 然后按更新时间排序
            return new Date(b.updatedAt).getDate() - new Date(a.updatedAt).getDate();
        })
    });
    const pinnedNotes = computed(() => {
        return state.value.notes.filter(note => note.pinned);
    })
    // 获取搜索查询
    const searchQuery = computed(() => state.value.searchQuery);

    // 设置搜索查询
    function setSearchQuery(query: string) {
        state.value.searchQuery = query;
    }
    //切换初始状态
    async function togglePinNote(noteId: string) {
        const note = state.value.notes.find(n => n.id === noteId);
        if (note) {
            updateNote(noteId, { pinned: !note.pinned });
        }
    }



    function getNoteById(id: string): Note | undefined {
        return state.value.notes.find(note => note.id === id);
    }


    //设置标签
    function setNotes(notes: Note[]) {
        state.value.notes = notes;
    }


    // 添加便签
    async function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'pinned'>): Promise<Note | null> {
        const newNote: Note = {
            ...note,
            id: crypto.randomUUID(),
            deleted: false,
            pinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 保存到数据库
        console.log(newNote);
        const success = await window.electronAPI.saveNote(newNote);
        if (success) {
            state.value.notes.push(newNote);
            return newNote; // 返回新创建的便签
        } else {
            console.error('Failed to save note to database');
            return null;
        }
    }
    // 更新便签
    async function updateNote(noteId: string, update: Partial<Omit<Note, 'id'>>): Promise<boolean> {
        const index = state.value.notes.findIndex(note => note.id === noteId);
        if (index !== -1) {
            const updatedNote = {
                ...state.value.notes[index],
                ...update,
                updatedAt: new Date().toISOString()
            };

            updatedNote.tags = toRaw(updatedNote.tags);

            // 更新到数据库
            const success = await window.electronAPI.updateNote(updatedNote);
            if (success) {
                state.value.notes[index] = updatedNote;
                return true;
            }
        }
        return false;
    }

    // 删除便签
    function removeNote(noteId: string) {
        moveToTrash(noteId);
    }
    // 添加标签到便签
    async function addTagToNote(noteId: string, tagId: string) {
        const note = state.value.notes.find(note => note.id === noteId);
        if (note && !note.tags.includes(tagId)) {
            // 更新数据库
            const success = await window.electronAPI.addTagToNote(noteId, tagId);

            if (success) {
                note.tags.push(tagId);
                note.updatedAt = new Date().toISOString();
            }
        }
    }

    // 从便签中移除标签
    async function removeTagFromNote(noteId: string, tagId: string) {
        const note = state.value.notes.find(note => note.id === noteId);
        if (note) {
            // 更新数据库
            const success = await window.electronAPI.removeTagFromNote(noteId, tagId);

            if (success) {
                note.tags = note.tags.filter(id => id !== tagId);
                note.updatedAt = new Date().toISOString();
            } else {
                console.error('Failed to remove tag from note in database');
            }
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
    async function moveToTrash(noteId: string) {
        const index = state.value.notes.findIndex(n => n.id === noteId);
        if (index !== -1) {

            updateNote(noteId, { deleted: true, deletedAt: new Date().toISOString(), originalPosition: index });
        }
    }

    async function restoreFromTrash(noteId: string) {
        const noteIndex = state.value.notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
            const note = state.value.notes[noteIndex];
            const restoredNote: Note = {
                ...note,
                deleted: false,
                deletedAt: undefined,
                originalPosition: undefined,
                updatedAt: new Date().toISOString()
            };

            // 更新数据库
            const success = await updateNote(noteId, restoredNote);
            if (success) {
                state.value.notes.splice(noteIndex, 1);

                // 恢复到原始位置（如果可能）
                if (typeof note.originalPosition === 'number' && note.originalPosition < state.value.notes.length) {
                    state.value.notes.splice(note.originalPosition, 0, restoredNote);
                } else {
                    // 添加到列表末尾
                    state.value.notes.push(restoredNote);
                }
            } else {
                console.error('Failed to restore note from trash in database');
            }
        }
    }

    //永久删除
    async function deletePermanently(noteId: string) {
        // 从数据库删除
        const success = await window.electronAPI.deleteNote(noteId);
        if (success) {
            state.value.notes = state.value.notes.filter(note => note.id !== noteId);
        } else {
            console.error('Failed to delete note permanently from database');
        }
    }

    //清空回收站
    function emptyTrash() {
        state.value.notes = state.value.notes.filter(note => !note.deleted);
    }

    //自动清理过期标签
    function autoCleanTrash() {
        if (!trashConfig.value.autoClean) {
            return;
        }
        const now = new Date();
        const threshoId = trashConfig.value.retentionDays * 24 * 60 * 60 * 1000;

        state.value.notes = state.value.notes.filter(note => {
            if (note.deleted && note.deletedAt !== undefined) {
                return now.getTime() - new Date(note.deletedAt).getTime() < threshoId;
            }
            return true;
        })
    }
    // 添加加载便签的方法
    async function loadNotes() {
        const notes = await window.electronAPI.getNotes();
        state.value.notes = notes;
    }
    return {
        notes,
        pinnedNotes,
        searchQuery,
        activeNotes,
        trashNotes,
        trashConfig,
        getNoteById,
        setNotes,
        setSearchQuery,
        addNote,
        updateNote,
        removeNote,
        addTagToNote,
        removeTagFromNote,
        filteredNotes,
        loadNotes,
        togglePinNote,

        moveToTrash,
        restoreFromTrash,
        deletePermanently,
        emptyTrash,
        autoCleanTrash
    }
})