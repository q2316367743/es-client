import {ipcMain, BrowserWindow, app} from 'electron';

export default class WindowHandler {

    private readonly mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    init() {
        this.registerClose();
        this.registerMin();
        this.registerMax();
        console.log('init window handler')
    }

    private registerMax() {
        ipcMain.handle('window:max', () => {
            if (this.mainWindow.isMaximized()) {
                this.mainWindow.unmaximize();
            }else {
                this.mainWindow.maximize()
            }
        })
    }

    private registerMin() {
        ipcMain.handle('window:min', () => {
            this.mainWindow.minimize();
        });
    }

    private registerClose() {
        ipcMain.handle('window:close', () => {
            this.mainWindow.close();
            if (process.platform !== "darwin") {
                app.quit();
            }
        })
    }

}