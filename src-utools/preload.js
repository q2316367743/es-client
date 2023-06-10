const axios = require('./lib/axios');
const iconv = require('iconv-lite');

"use strict";
window.preload = Object.create(null);

console.log("安装iconv");
window.preload['iconv'] = function (content, charset) {
    let str = iconv.decode(Buffer.from(content), charset);
    return iconv.encode(str, 'utf8').toString();
};

window.preload['axios'] = axios;
