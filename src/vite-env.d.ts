/// <reference types="vite/client" />
interface Window {
  mode: string,
  referrer: string,
}

interface ImportMetaEnv {
  // 发行版
  VITE_MODE: string;
  VITE_PLATFORM: string;
  VITE_REFERRER: string;
  VITE_HOMENAME: string;
}
