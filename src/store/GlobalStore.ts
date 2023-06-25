import { useTitle, useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        size: useWindowSize(),
        loading: false,
        loadingText: ''
    }),
    getters: {
        height: state => state.size.height,
        width: state => state.size.width,
    },
    actions: {
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
        startLoading(text?: string) { // 加载中.. 可以加载完成后自动关闭页面.. 不要忘
            this.loading = true;
            this.loadingText = text || '加载中...';
        },
        closeLoading() {
            this.loading = false;
        }
    }
})
