import {useGlobalStore} from "@/store/GlobalStore";
import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {WebviewWindow} from "@tauri-apps/api/window";
import {emit} from "@tauri-apps/api/event";
import MessageUtil from "@/utils/MessageUtil";
import {copyText} from "@/utils/BrowserUtil";

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

  if (Constant.mode === PluginModeEnum.TAURI) {
    createDataBrowserWindowByTauri(type, data, json, options);
  } else {
    createDataBrowserWindowByWeb(type, data, json, options);
  }
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

export function createDataBrowserWindowByWeb(
  type: BrowserWindowType,
  data: string,
  json: string,
  options: Partial<BrowserWindowOption>) {
  const newWindow = window.open(`${type}.html`);
  if (newWindow) {
    const msg = {
      html: data,
      title: options.title,
      isDark: useGlobalStore().isDark,
      json: json
    };

    newWindow.addEventListener('load', () => {
      const link = newWindow.document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = `./highlight.js/styles/github${useGlobalStore().isDark ? '-dark' : ''}.css`
      newWindow.document.head.appendChild(link);
      newWindow.document.getElementById("code")!.innerHTML = msg.html;
      if (msg.title) {
        newWindow.document.title = msg.title;
      }

      if (msg.isDark) {
        // 设置为暗黑主题
        newWindow.document.body.setAttribute('arco-theme', 'dark');
      } else {
        // 恢复亮色主题
        newWindow.document.body.removeAttribute('arco-theme');
      }
      newWindow.document.querySelector('.copyText button')!.addEventListener('click', function () {
        // 复制
        copyText(json);
        newWindow.alert("已成功复制到剪切板");
      });
    })


  }
}
