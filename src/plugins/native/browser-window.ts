import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {utools} from "@/plugins/utools";

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

export interface BrowserWindow {
    id: number;
    webContents: {
        id: number;
        openDevTools(): void;
        [key: string]: any
    };

    [key: string]: any
}

export enum BrowserWindowType {
    JSON = 'json'
}

/**
 * 创建数据浏览器窗口
 * @param type 类型
 * @param data 数据
 * @param options 参数
 */
export function createDataBrowserWindow(
    type: BrowserWindowType,
    data: string,
    options: Partial<BrowserWindowOption>) {
    if (Constant.mode == PluginModeEnum.UTOOLS) {
        createDataBrowserWindowByUtools(type, data, options);
    }
}

function createDataBrowserWindowByUtools(
    type: BrowserWindowType,
    data: string,
    options: Partial<BrowserWindowOption>) {
    const file: string = utools.isDev() ? "../public/json.html" : "dist/json.html";
    const preload: string = utools.isDev() ? '../public/electron/preload-json.js' : 'dist/electron/preload-json.js';

    const browserWindow = utools.createBrowserWindow(file, {
        ...options,
        webPreferences: {
            preload: preload
        }
    }, () => {
        browserWindow.show();
        window.preload.sendTo(browserWindow.id, type, data);
        // 发送数据
        if (utools.isDev()) {
            browserWindow.webContents.openDevTools();
        }
        // 隐藏主窗口
    });

}
