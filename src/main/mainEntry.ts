//src\main\mainEntry.ts
import { app, BrowserWindow, ipcMain, nativeImage, nativeTheme } from "electron";
import {  join } from "path";
import { MenuManager } from "./MenuManager";
import { NotesManager } from "./notes";
import { configManager } from "./Config";
import {  Language, Theme,Note } from "../type";
import { i18n } from "./I18n";

app.setPath('userData',join(app.getPath('appData'),'StickyNotes'));
let mainWindow: BrowserWindow;
let menuManguage: MenuManager;
let notes: NotesManager  = new NotesManager();



app.whenReady().then(() => {
    let config = configManager.getConfig();
    mainWindow = new BrowserWindow({
        minHeight:800,
        minWidth:1250,
        width: 1450,
        height: 800,
        title:i18n .t('title'),
        icon:nativeImage.createFromPath(join(__dirname,'../public/notes.png')),
        webPreferences: {
            preload: join(__dirname, 'preload_main.js'),
            nodeIntegration: true,
            webSecurity: true,
            sandbox:true,
            allowRunningInsecureContent: false,
            contextIsolation: true,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
            additionalArguments: [`--window-config=${JSON.stringify(config)}`],
        },
    });
    mainWindow.webContents.session.enableNetworkEmulation({
        offline:false,
        latency:0,
        downloadThroughput:0,
        uploadThroughput:0
    });
    
    menuManguage = new MenuManager(mainWindow);
    nativeTheme.themeSource = config.theme;
    mainWindow.loadURL(process.argv[2]);
    mainWindow.webContents.openDevTools();

    ipcMain.handle('read-config', () => configManager.getConfig());
    ipcMain.handle('write-config', (_, config) => configManager.setConfig(config));
    ipcMain.on('set-theme-source', (_, theme: Theme) => {
        nativeTheme.themeSource = theme
    })
    ipcMain.on('set-language', (_, language: Language) => {
        configManager.setConfig({ language });
    })

    ipcMain.handle('get-notes',()=>{
       return notes.getNotes();
    })

    ipcMain.handle('save-note',async (_,note:Note)=>{
        return await notes.saveNote(note); 
    });
    ipcMain.handle('delete-note',async (_, noteId: string) => {
        return await notes.deleteNote(noteId);
    });

    ipcMain.on('show-about',()=>{
        menuManguage.showAbout();
    })


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})
