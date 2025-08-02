import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions } from "electron";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { i18n } from "./I18n";


/**
 * MenuManager class for managing the application menu and recent files.
 * It handles file operations, recent files.
 */

const recentFilesPath = join(app.getPath('userData'), 'recentFiles.json');
export class MenuManager {
    private recentFiles: string[] = [];
    private mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow,) {
        this.mainWindow = mainWindow;

        this.loadRecentFiles();
        this.setMenu();
    }
    private setMenu() {
        const template: MenuItemConstructorOptions[] = [{
            label: i18n.t('menu.file'),
            submenu: [
                {
                    label: i18n.t('menu.file.open'),
                    accelerator: 'Ctrl+O',
                    click: () => {
                        this.openFile();
                    }
                }, {
                    label: i18n.t('menu.file.openRecent'),
                    submenu: this.recentFiles.map(file => ({
                        label: file,
                        click: () => this.openRecentFile(file)
                    }))
                },
                { type: 'separator' },
                {
                    label: i18n.t('menu.file.quit'),
                    accelerator: 'Ctrl+Q',
                    click: () => {
                        app.quit()
                    }
                }
            ]
        }, {
            label: i18n.t('menu.note'),
            submenu: [
                {
                    label: i18n.t('menu.newnote'),
                    accelerator: 'CmdOrCtrl+N',
                    click: () => this.mainWindow.webContents.send('create-note')
                }
            ]
        }, {
            label: i18n.t('menu.edit'),
            submenu: [
                {
                    label: i18n.t('menu.edit.undo'),
                    accelerator: 'Ctrl+Z',
                    role: 'undo'
                },
                {
                    label: i18n.t('menu.edit.redo'),
                    accelerator: 'Ctrl+Y',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: i18n.t('menu.edit.cut'),
                    accelerator: 'Ctrl+X',
                    role: 'cut'
                },
                {
                    label: i18n.t('menu.edit.copy'),
                    accelerator: 'Ctrl+C',
                    role: 'copy'
                },
                {
                    label: i18n.t('menu.edit.paste'),
                    accelerator: 'Ctrl+V',
                    role: 'paste'
                }
            ]
        }, {
            label: i18n.t('menu.help'),
            submenu: [{
                label: i18n.t('menu.help.config'),
                click: () => {
                    this.mainWindow.webContents.send('open-config-page');
                }
            }, {
                label: i18n.t('menu.help.about'),
                click: () => {
                    this.showAbout();
                }
            }]
        }];
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    public showAbout() {
        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: i18n.t('title'),
            message: i18n.t('aboutmessage'),
            detail: i18n.t('aboutdetail')
        })
    }

    private async openFile() {
        const { canceled, filePaths } = await dialog.showOpenDialog(this.mainWindow, {
            properties: ['openFile'],
            filters: [{ name: 'All Files', extensions: ['*'] }]
        });

        if (!canceled && filePaths.length > 0) {
            this.addRencentFile(filePaths[0]);
            this.mainWindow.webContents.send('open-file', filePaths[0]);
        }
    }

    private openRecentFile(file: string) {
        this.addRencentFile(file);
        this.mainWindow.webContents.send('open-file', file);
    }


    private addRencentFile(file: string) {
        this.recentFiles = [file, ...this.recentFiles.filter(f => f !== file)].slice(0, 10);
        this.saveRecentFiles();
        this.setMenu();
    }

    private loadRecentFiles() {

        try {
            const data = readFileSync(recentFilesPath, 'utf-8');
            this.recentFiles = JSON.parse(data);
        } catch {
            this.recentFiles = [];
        }
    }

    private saveRecentFiles() {
        writeFileSync(recentFilesPath, JSON.stringify(this.recentFiles))
    }
}