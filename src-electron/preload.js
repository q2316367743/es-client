const axios = require('axios');
const https = require('https');
const {ipcRenderer} = require('electron');
const path = require("path");


window.utools = {
    createBrowserWindow(url, options) {

        const config = Object.assign({
            title: 'es-client'
        }, options);
        ipcRenderer.send('utools-createBrowserWindow', {
            url,
            title: config['title'],
            height: 800,
            width: 1200,
            minHeight: 600,
            minWidth: 1000,
            icon: path.join(__dirname, "./dist/favicon.ico"),
            ...options,
            webPreferences: {
                contextIsolation: false, // 是否开启隔离上下文
                nodeIntegration: true, // 渲染进程使用Node API
                preload: config['webPreferences'] ? config['webPreferences'].preload : undefined
            },
            data: config.data,
            type: config.type
        });


    }
}

window.preload = Object.create(null);


const ignoreSSL = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    adapter: "http"
});

window.preload['axios'] = ignoreSSL;

window.preload['sendTo'] = (id, channel, data) => {
    console.log(ipcRenderer, ipcRenderer.send, id, channel, data)
    ipcRenderer.send(id, channel, data)
};
