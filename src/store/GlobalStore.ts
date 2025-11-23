import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {isDarkColors} from "@/utils/BrowserUtil";
import { VxeUI } from 'vxe-table'

export enum DarkTypeEnum {
  LIGHT = 1,
  DARK = 2,
  AUTO = 3
}

function getIsDark(darkType?: DarkTypeEnum): boolean {
  darkType = darkType || getItemByDefault(LocalNameEnum.KEY_THEME, DarkTypeEnum.AUTO);
  if (darkType === DarkTypeEnum.LIGHT) {
    return false;
  } else if (darkType === DarkTypeEnum.DARK) {
    return true;
  } else if (darkType === DarkTypeEnum.AUTO) {
    return isDarkColors();
  } else {
    return false;
  }
}

// html[data-vxe-ui-theme="dark"] {

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkType: getItemByDefault(LocalNameEnum.KEY_THEME, DarkTypeEnum.AUTO),
    size: useWindowSize(),
    loading: false,
    loadingText: '',
  }),
  getters: {
    height: state => state.size.height,
    width: state => state.size.width,
    isDark: state => getIsDark(state.darkType)
  },
  actions: {
    initDarkColors() {
      const isDark = getIsDark();
      if (isDark) {
        // 设置为暗黑主题
        document.body.setAttribute('arco-theme', 'dark');
        VxeUI.setTheme('dark')
      } else {
        // 恢复亮色主题
        document.body.removeAttribute('arco-theme');
        VxeUI.setTheme('light')
      }
    },
    switchDarkColors(type: DarkTypeEnum) {
      // 设置值
      this.darkType = type;
      setItem(LocalNameEnum.KEY_THEME, type);
      const isDark = getIsDark();
      if (isDark) {
        // 设置为暗黑主题
        document.body.setAttribute('arco-theme', 'dark');
        VxeUI.setTheme('dark')
      } else {
        // 恢复亮色主题
        document.body.removeAttribute('arco-theme');
        VxeUI.setTheme('light')
      }
    },
  }
})
