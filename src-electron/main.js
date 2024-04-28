// electron-main/index.ts
const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");

const createWindow = () => {
    const win = new BrowserWindow({
        title: "es-client",
        height: 800,
        width: 1200,
        minHeight: 600,
        minWidth: 1000,
        icon: path.join(__dirname, "./dist/favicon.ico"),
        webPreferences: {
            contextIsolation: false, // 是否开启隔离上下文
            nodeIntegration: true, // 渲染进程使用Node API
            preload: path.join(__dirname, "./preload.js") // 需要引用js文件
        },
    });

    win.setMenu(null);

    // Load your file
    win.loadFile(path.join(__dirname, "./dist/index.html?td_channelid=electron"));
    // win.openDevTools();
};

app.whenReady().then(() => {
    // 创建窗口
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 关闭窗口
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});




ipcMain.on('utools-createBrowserWindow', (e, data) => {
    return new Promise(resolve => {
        const config = data;
        if (config.webPreferences.preload) {
            config.webPreferences.preload = path.join(__dirname, config.webPreferences.preload);
        }
        const win = new BrowserWindow(config);

        win.setMenu(null);

        // Load your file
        win.loadFile(path.join(__dirname, data.url)).then(() => console.log("加载成功"));

        win.show()
        //  Open the DevTools.
        // win.webContents.openDevTools()

        win.on('ready-to-show', () => {
            resolve({
                webContents: {
                    id: win.webContents.id,
                }
            });
        });

        win.webContents.send(data.type, data.data);
    })
})
