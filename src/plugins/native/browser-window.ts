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
  createDataBrowserWindowByWeb(type, data, json, options);
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
      newWindow.document.querySelector('.copy button')!.addEventListener('click', function () {
        // 复制
        // @ts-ignore
        newWindow.copyText(json);
        newWindow.alert("已成功复制到剪切板");
      });
    })


  }
}
