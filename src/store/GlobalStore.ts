import {useWindowSize} from "@vueuse/core";
import {defineStore} from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        size: useWindowSize(),
        loading: false,
        loadingText: '',
        collapsed: true
    }),
    getters: {
        height: state => state.size.height,
        width: state => state.size.width,
    },
    actions: {
        initDarkColors() {
            this.isDark = utools.isDarkColors();
            if (this.isDark) {
                // 设置为暗黑主题
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                // 恢复亮色主题
                document.body.removeAttribute('arco-theme');
            }
        },
        switchDarkColors() {
            this.isDark = !this.isDark;
            if (this.isDark) {
                // 设置为暗黑主题
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                // 恢复亮色主题
                document.body.removeAttribute('arco-theme');
            }
        },
        setCollapsed(collapsed: boolean) {
            this.collapsed = collapsed;
        }
    }
})
