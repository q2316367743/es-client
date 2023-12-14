// electron-main/index.ts
import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import { autoUpdater } from 'electron-updater'

const createWindow = () => {
    const win = new BrowserWindow({
        title: "es-client",
        height: 800,
        width: 1200,
        minHeight: 600,
        minWidth: 1000,
        icon: path.join(__dirname, "../src-utools/dist/favicon.ico"),
        webPreferences: {
            contextIsolation: false, // 是否开启隔离上下文
            nodeIntegration: true, // 渲染进程使用Node API
            preload: path.join(__dirname, "../src-utools/preload.js"), // 需要引用js文件
        },
    });

    win.setMenu(null);

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools({
            mode: 'undocked',
        })
    } else {
        // Load your file
        win.loadFile(path.join(__dirname, "../src-utools/dist/index.html"));
    }
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

function checkUpdate(){
    //设置要检测更新的路径
    if(process.platform == 'darwin'){
        autoUpdater.setFeedURL({
            url: 'https://es-client.esion.xyz/electron/darwin'
        })

    }else{
        autoUpdater.setFeedURL({
            url: 'https://es-client.esion.xyz/electron/win32'
        })
    }

    //检测更新
    autoUpdater.checkForUpdates()

    //监听'error'事件
    autoUpdater.on('error', (err: Error) => {
        console.log(err)
    })

    //监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
        console.log('found new version')
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
            if(buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
                autoUpdater.quitAndInstall()
                app.quit()
            }
        })
    })
}
