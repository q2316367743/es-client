import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import NotificationUtil from "@/utils/NotificationUtil";
import {WebviewWindow} from "@tauri-apps/api/window";
import {emit} from "@tauri-apps/api/event";
import MessageUtil from "@/utils/MessageUtil";

export interface BrowserWindowOption {
    title: string;
    width: number;
    height: number;
    useContentSize: boolean;
    skipTaskbar: boolean;
    alwaysOnTop: boolean;
    frame: boolean;
    transparent: boolean;
    backgroundColor: string;
    hasShadow: boolean;
    webPreferences?: Partial<BrowserWindowOptionWebPreferences>
}

export interface BrowserWindowOptionWebPreferences {
    preload: string
}

export enum BrowserWindowType {
    JSON = 'json'
}

/**
 * 创建数据浏览器窗口
 * @param type 类型
 * @param data 数据
 * @param json 原始json内容
 * @param options 参数
 */
export function createDataBrowserWindow(
    type: BrowserWindowType,
    data: string,
    json: string,
    options: Partial<BrowserWindowOption>) {

    if (Constant.mode === PluginModeEnum.UTOOLS) {
        createDataBrowserWindowByUtools(type, data, json, options);
    } else if (Constant.mode === PluginModeEnum.ELECTRON) {
        createDataBrowserWindowByElectron(type, data, json, options)
    } else if (Constant.mode === PluginModeEnum.TAURI) {
        createDataBrowserWindowByTauri(type, data, json, options);
    } else {
        NotificationUtil.warning("系统异常，未知平台");
    }
}


export function createDataBrowserWindowByUtools(
    type: BrowserWindowType,
    data: string,
    json: string,
    options: Partial<BrowserWindowOption>) {
    const file: string = utools.isDev() ? "../public/json.html" : "dist/json.html";
    const preload: string = utools.isDev() ? '../public/electron/preload-json.js' : 'dist/electron/preload-json.js';

    const browserWindow = utools.createBrowserWindow(file, {
        ...options,
        // @ts-ignore
        webPreferences: {
            preload: preload
        }
    }, () => {
        browserWindow.show();
        if (utools.isDev()) {
            browserWindow.webContents.openDevTools();
        }
        window.preload.sendTo(browserWindow.webContents.id, type, {
            html: data,
            theme: useGlobalSettingStore().jsonTheme,
            title: options.title,
            isDark: useGlobalStore().isDark,
            json: json
        });
    });
}


export function createDataBrowserWindowByElectron(
    type: BrowserWindowType,
    data: string,
    json: string,
    options: Partial<BrowserWindowOption>) {
    const file: string = utools.isDev() ? "../public/json.html" : "dist/json.html";
    const preload: string = utools.isDev() ? '../public/electron/preload-json.js' : 'dist/electron/preload-json.js';
    // @ts-ignore
    utools.createBrowserWindow(file, {
        ...options,
        // @ts-ignore
        webPreferences: {
            preload: preload
        },
        data: {
            html: data,
            theme: useGlobalSettingStore().jsonTheme,
            title: options.title,
            isDark: useGlobalStore().isDark,
            json: json
        },
        type
    });
}


export function createDataBrowserWindowByTauri(
    type: BrowserWindowType,
    data: string,
    json: string,
    options: Partial<BrowserWindowOption>) {
    const webviewWindow = new WebviewWindow(type + new Date().getTime(), {
        url: '/json.html',
        width: options.width,
        height: options.height,
        title: options.title,
        theme: useGlobalStore().isDark ? 'dark' : 'light',
        alwaysOnTop: true,
    });
    webviewWindow.once('tauri://created', function () {
        // 发送5次
        setInterval(() => {
            emit("data", {
                html: data,
                theme: useGlobalSettingStore().jsonTheme,
                title: options.title,
                isDark: useGlobalStore().isDark,
                json: json
            }).then(() => console.debug("消息发送成功"));
        }, 1000, 5);
    }).then(() => console.debug("窗口已成功创建"));
    webviewWindow.once('tauri://error', function (e) {
        MessageUtil.error("创建webview窗口失败", e);
    });
}

