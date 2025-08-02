import sqlite3 from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import { Note } from '../type';
import { existsSync } from 'fs';


const dbpath = join(app.getPath('userData'), 'db.sqlite3');


class Database {
    private static instance: Database | undefined = undefined;
    private db: sqlite3.Database;
    private constructor() {
        let dbExists = existsSync(dbpath);
        //https://github.com/WiseLibs/better-sqlite3/releases
        this.db = new sqlite3(dbpath, {
            verbose: console.log,
        });
        if (!dbExists) {
            this.db.exec(`CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                color TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            )`);


        }
    }
    public static getDatabaseInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    public close() {
        if (this.db) {
            this.db.close();
            Database.instance = undefined;
        }
    }
    public getNotes(): Note[] {
        const stmt = this.db.prepare('SELECT * FROM notes');
        return stmt.all() as Note[];
    }
    public saveNote(note: Note): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const stmt = this.db.prepare('INSERT OR REPLACE INTO notes (id, title, content, color, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
                stmt.run(note.id, note.title, note.content, note.color, note.createdAt, note.updatedAt);
                resolve(true);
            }
            catch (error) {
                console.error('Error saving note:', error);
                resolve(false)
            }
        });
    }
    public deleteNote(noteId: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const stmt = this.db.prepare('DELETE FROM notes WHERE id = ?');
                stmt.run(noteId);
                resolve(true);
            }
            catch (error) {
                console.error('Error deleting note:', error);
                resolve(false);
            }
        }
        );

    }
}

export let database = Database.getDatabaseInstance();