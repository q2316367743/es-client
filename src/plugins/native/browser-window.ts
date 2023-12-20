import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useGlobalStore} from "@/store/GlobalStore";

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
        // 发送数据
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

