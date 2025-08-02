import { Note } from "../type";
import {database} from "./db";
export class NotesManager {
    private notes: Note[] = [];

    constructor() {
        this.loadNotes();
    }

    private loadNotes() {
        // 从数据库或文件加载便签
        // 这里可以使用 dababase 实例来获取便签数据
        this.notes = database.getNotes(); // 假设有一个方法获取所有便签
    }

    public getNotes(): Note[] {
        return this.notes;
    }

    public saveNote(note: Note):Promise<boolean> {
        const existingNoteIndex = this.notes.findIndex(n => n.id === note.id);
        if (existingNoteIndex > -1) {
            this.notes[existingNoteIndex] = note;
        } else {
            this.notes.push(note);
        }
        return database.saveNote(note); // 假设有一个方法保存便签
    }

    public deleteNote(noteId: string): Promise<boolean> {
        this.notes = this.notes.filter(note => note.id !== noteId);
        return database.deleteNote(noteId); // 假设有一个方法删除便签
    }
}