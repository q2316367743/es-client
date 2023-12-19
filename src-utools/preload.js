const axios = require('./lib/axios');
const iconv = require('iconv-lite');
const https = require('https');
const {ipcRenderer} = require('electron');

"use strict";
window.preload = Object.create(null);

console.log("安装iconv");
window.preload['iconv'] = function (content, charset) {
    let str = iconv.decode(Buffer.from(content), charset);
    return iconv.encode(str, 'utf8').toString();
};


const ignoreSSL = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

window.preload['axios'] = ignoreSSL;

window.preload['sendTo'] = (id, channel, data) => ipcRenderer.sendTo(id, channel, data);
