import { contextBridge, ipcRenderer ,webUtils} from "electron";
import { Config, Note, Theme } from "../type";

function parseArgv(key: string) {
    for (const arg of process.argv) {
        if (arg.indexOf(`--${key}=`) === 0) {
            return JSON.parse(arg.split('=')[1]);
        }
    }
    return undefined;
}




export declare interface ElectronAPI {


    getNotes: () => Promise<any>;
    saveNote: (note: Note) => Promise<any>;
    deleteNote: (id: string) => Promise<any>;
    createNote: (callback: (...args: any[]) => void) => void;
    showAbout: () => void;
    restart:(newConfig: Partial<Config>)=>void;

    configurate: () => Config;
    readConfig: () => Promise<any>;
    writeConfig: (config: Config) => Promise<any>;
    setThemeSource: (theme: Theme) => void;
    setLanguage: (language: string) => void;
    onOpenConfigPage: (cb: (...args: any[]) => void) => void;

    getPathForFile: (file: File) => string;
}

contextBridge.exposeInMainWorld('electronAPI', {

    getNotes: () => ipcRenderer.invoke('get-notes'),
    saveNote: (note: Note) => ipcRenderer.invoke('save-note', note),
    deleteNote: (id: string) => ipcRenderer.invoke('delete-note', id),
    createNote: (callback: (...args: any[]) => void) => ipcRenderer.on('create-note', callback),
    showAbout:()=>ipcRenderer.send('show-about'),
    restart:(newConfig: Partial<Config>)=>ipcRenderer.send('restart',newConfig),
    configurate: () => parseArgv('window-config'),
    readConfig: () => ipcRenderer.invoke('read-config'),
    writeConfig: (config: Config) => ipcRenderer.invoke('write-config', config),
    setThemeSource: (theme: Theme) => ipcRenderer.send('set-theme-source', theme),
    setLanguage: (language: string) => ipcRenderer.send('set-language', language),
    onOpenConfigPage: (cb: (...args: any[]) => void) => ipcRenderer.on('open-config-page', cb),

    getPathForFile:(file:File)=>  webUtils.getPathForFile(file).replace(/\\/g, "/"),
} as ElectronAPI);

