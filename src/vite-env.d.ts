/// <reference types="vite/client" />
interface Window {
  preload: {
    axios: <T>(config: any) => any,
    iconv(content: any, charset: string): string,
    sendTo(id: number, channel: string, data: any): void;
  },
  mode: string,
  referrer: string,
  // 可能存在的TAURI变量
  __TAURI__: any
}

interface ImportMetaEnv {
  // 发行版
  VITE_MODE: string;
  VITE_PLATFORM: string;
  VITE_REFERRER: string;
  VITE_HOMENAME: string;
}
