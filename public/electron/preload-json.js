const {ipcRenderer} = require('electron');

ipcRenderer.once('json', (e, preload) => {
    console.log(e, preload);
})
