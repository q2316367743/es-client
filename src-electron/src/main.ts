import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";

// 引入处理器
import WindowHandler from './handler/WindowHandler';

function createWindow() {
    // null值取消顶部菜单栏
    Menu.setApplicationMenu(null);
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        title: 'es-client',
        icon:  path.join(__dirname, '..', '..', 'public', 'logo.png'),
        frame: false,
        minHeight: 800,
        minWidth: 1000,
        height: 800,
        width: 1000,
        webPreferences: {
            nodeIntegration: true,
            // 官网似乎说是默认false，但是这里必须设置contextIsolation
            contextIsolation: false,
            // preload: path.join(__dirname, "preload.js"),
            webSecurity: true,
            allowRunningInsecureContent: false,
        }
    });

    // 实例化处理器
    const windowHandler = new WindowHandler(mainWindow);
    windowHandler.init();

    // and load the index.html of the app.
    let env = process.argv[2].split("=")[1];
    if (env === 'dev') {
        mainWindow.loadURL("http://localhost:5173").then(() => console.log("应用启动成功"));
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }else if (env === 'pro') {
        mainWindow.loadFile(path.resolve(__dirname, 'front')).then(() => console.log("应用启动成功"));
    }else {
        throw new Error('环境未知')
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.