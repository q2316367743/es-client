const {ipcRenderer, clipboard} = require('electron')

window.preload = {
    /***  接收主窗口发送过来的消息  ***/
    receiveMsg: (callback) => {
        ipcRenderer.on('json', (event, res) => callback(res));
    },
    copyText(text) {
        clipboard.writeText(text);
    },
    showNotification(body) {
        utools.showNotification(body)
    }
}
