// electron-main/index.ts
const {app, BrowserWindow, dialog, Notification, ipcMain} = require("electron");
const path = require("path");
const axios = require("axios");

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
    win.loadFile(path.join(__dirname, "./dist/index.html"));
    // win.openDevTools();
};

app.whenReady().then(() => {
    // 创建窗口
    createWindow();
    // 检测更新
    checkUpdate();
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

async function checkUpdate() {
    let url = "";
    //设置要检测更新的路径
    if (process.platform === 'darwin') {
        url = 'https://es-client.esion.xyz/electron/darwin'
    } else {
        url = 'https://es-client.esion.xyz/electron/win32';
    }
    const response = await axios.request({
        baseURL: url,
        url: "/latest.json",
        responseType: 'json'
    })

    if (true) {
        // 如果更新
            dialog.showMessageBox({
                type: 'info',
                title: '应用更新',
                message: '发现新版本，是否更新？',
                buttons: ['是', '否']
            }).then((buttonIndex) => {
                if (buttonIndex.response === 0) {  //选择是，则退出程序，安装新版本
                    // 更新
                }
            })
    }
}



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
