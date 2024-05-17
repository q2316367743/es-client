import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {web, webPreload, DbStorage} from "@/plugins/distribute/web";
import {tauri, tauriPreload} from "@/plugins/distribute/tauri";
import {serverPreload} from "@/plugins/distribute/server";
import {StorageLike} from "@vueuse/core";

let utools: any;
let source: any;


if (Constant.mode === PluginModeEnum.TAURI) {
    // 目前，只有tauri需要处理
    utools = Object.assign(web, tauri);
    source = tauriPreload;
} else if (Constant.mode === PluginModeEnum.ELECTRON) {
    // 大部分还是使用web提供的功能
    utools = Object.assign(web, window.utools, {
        getUser() {
            return {avatar: "", nickname: "客户端用户", type: ""};
        }
    });
    source = window.preload;
} else if (Constant.mode === PluginModeEnum.SERVER) {
    // 服务器版本需要处理
    utools = Object.assign(web, {
        getUser() {
            return {avatar: "", nickname: "服务器用户", type: ""};
        }
    });
    source = serverPreload;
} else if (Constant.mode === PluginModeEnum.UTOOLS) {
    // utools会注入
    utools = window.utools;
    source = window.preload;
} else {
    // 默认情况
    utools = web;
    source = webPreload;
}


export const instance = utools;
// @ts-ignore
export const preload = source;
// @ts-ignore

export const dbStorage: StorageLike = window.utools.dbStorage || DbStorage
