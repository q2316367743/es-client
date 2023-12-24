import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {web} from "@/plugins/distribute/web";
import {tauri, tauriPreload} from "@/plugins/distribute/tauri";
import {server, serverPreload} from "@/plugins/distribute/server";

let utools: any;
let source: any;


if (Constant.mode === PluginModeEnum.TAURI) {
    // 目前，只有tauri需要处理
    utools = Object.assign(web, tauri);
    source = tauriPreload;
} else if (Constant.mode === PluginModeEnum.ELECTRON) {
    // 大部分还是使用web提供的功能
    utools = Object.assign(web, window.utools);
    source = window.preload;
} else if (Constant.mode === PluginModeEnum.SERVER) {
    // 服务器版本需要处理
    utools = Object.assign(web, server);
    source = serverPreload;
} else if (Constant.mode === PluginModeEnum.UTOOLS) {
    // utools会注入
    utools = window.utools;
    source = window.preload;
} else {
    // 默认情况
    utools = web;
}


export const instance = utools;
export const preload = source;
