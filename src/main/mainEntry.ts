//src\main\mainEntry.ts
import { app, BrowserWindow, dialog, ipcMain, nativeImage, nativeTheme, protocol } from "electron";
import { join, isAbsolute, extname } from "path";
import { MenuManager } from "./MenuManager";
import { NotesManager } from "./notes";
import { configManager } from "./Config";
import { Language, Theme, Note, Config } from "../type";
import { i18n } from "./I18n";
import { existsSync, readFileSync } from "fs";
import { platform } from "os";
import { insertChar } from "../tools";

app.setPath('userData', join(app.getPath('appData'), 'StickyNotes'));
let mainWindow: BrowserWindow;
let menuManguage: MenuManager;
let notes: NotesManager = new NotesManager();

protocol.registerSchemesAsPrivileged([{
    scheme: 'image', privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true
    }
}])

app.whenReady().then(() => {
    let config = configManager.getConfig();
    mainWindow = new BrowserWindow({
        minHeight: 800,
        minWidth: 1250,
        width: 1450,
        height: 800,
        title: i18n.t('title'),
        icon: nativeImage.createFromPath(join(__dirname, '../public/notes.png')),
        webPreferences: {
            preload: join(__dirname, 'preload_main.js'),
            nodeIntegration: true,
            webSecurity: true,
            sandbox: true,
            allowRunningInsecureContent: false,
            contextIsolation: true,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
            additionalArguments: [`--window-config=${JSON.stringify(config)}`],
        },
    });
    mainWindow.webContents.session.enableNetworkEmulation({
        offline: false,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0
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

    ipcMain.handle('get-notes', () => {
        return notes.getNotes();
    })

    ipcMain.handle('save-note', async (_, note: Note) => {
        return await notes.saveNote(note);
    });
    ipcMain.handle('delete-note', async (_, noteId: string) => {
        return await notes.deleteNote(noteId);
    });

    ipcMain.on('show-about', () => {
        menuManguage.showAbout();
    })

    protocol.handle('image', async (req) => {
        console.log(req.url);
        let filePath:string = req.url.slice('image://'.length);

        if(platform() === 'win32'){
            if(filePath.at(1) !== ':'){
               filePath = insertChar(filePath,1,":");
            }
        }

        console.log(filePath);

        if (!existsSync(filePath)) {
            return new Response('File not found', {
                status: 404,
                headers: { 'content-type': 'text/plain' }
            });
        }

        if (!isAbsolute(filePath)) {
            return new Response('Only absolute paths are allowed', {
                status: 403,
                headers: { 'content-type': 'text/plain' }
            })
        }

        const ext = extname(filePath).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
        if (!allowedExtensions.includes(ext)) {
            return new Response('Only image files are allowed', {
                status: 403,
                headers: { 'content-type': 'text/plain' }
            });
        }


        return new Response(readFileSync(filePath), {
            status: 200,
            headers: {
                'content-type': getMimeType(filePath) || 'application/octet-stream',
            }
        });

    })


    ipcMain.on('restart', async (_, config: Partial<Config>) => {
        let { response } = await dialog.showMessageBox(mainWindow, {
            type: 'warning',
            message: i18n.t('restartmessage'),
            buttons: [i18n.t('restart'), i18n.t('cancel')],
            defaultId: 0,
            title: i18n.t('title'),
            noLink: true
        })


        if (response === 0) {
            configManager.setConfig(config);
            app.relaunch();
            app.quit();
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

function getMimeType(filePath: string) {
    const ext = extname(filePath).toLowerCase();
    const mimeMap: Map<string, string> = new Map([
        ['.jpg', 'image/jpeg'],
        ['.jpeg', 'image/jpeg'],
        ['.png', 'image/png'],
        ['.gif', 'image/gif'],
        ['.webp', 'image/webp'],
        ['.bmp', 'image/bmp'],
        ['.svg', 'image/svg+xml']
        // 添加其他需要支持的图片类型
    ]);
    return mimeMap.get(ext) || 'application/octet-stream';
}