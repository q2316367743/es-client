// electron-main/index.ts
const {app, BrowserWindow, dialog, Notification, ipcMain} = require("electron");
const path = require("path");
const {autoUpdater} = require("electron-updater");

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
    win.openDevTools();
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

function checkUpdate() {
    //设置要检测更新的路径
    if (process.platform === 'darwin') {
        autoUpdater.setFeedURL({
            url: 'https://es-client.esion.xyz/electron/darwin',
            provider: "generic"
        })

    } else {
        autoUpdater.setFeedURL({
            url: 'https://es-client.esion.xyz/electron/win32',
            provider: "generic"
        })
    }

    //检测更新
    autoUpdater.checkForUpdates().then(() => console.log("check update success"))
    const isAllowed = Notification.isSupported();

    //监听'error'事件
    autoUpdater.on('error', err => {
        if (isAllowed) {
            const options = {
                title: '更新提示',
                body: '自动更新检查失败，' + err,
                silent: true, // 系统默认的通知声音
                icon: '', // 通知图标
            }
            const notification = new Notification(options);
            notification.show();
        }
    })

    //监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
        if (isAllowed) {
            const options = {
                title: '更新提示',
                body: '发现新版本，正在下载更新',
                silent: true, // 系统默认的通知声音
                icon: '', // 通知图标
            }
            const notification = new Notification(options);
            notification.show();
        }
    })

    //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false

    //监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '应用更新',
            message: '发现新版本，是否更新？',
            buttons: ['是', '否']
        }).then((buttonIndex) => {
            if (buttonIndex.response === 0) {  //选择是，则退出程序，安装新版本
                autoUpdater.quitAndInstall()
                app.quit();
            }
        })
    })
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
