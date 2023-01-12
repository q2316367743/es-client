import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {useTitle} from "@vueuse/core";

import Url from "@/entity/Url";
import useIndexStore from "./IndexStore";

import { urlService } from "@/global/BeanFactory";

const title = useTitle();

const useUrlStore = defineStore('url', {
    state: () => {
        return {
            // 全部的链接
            urls: new Array<Url>(),
            // 当前选中的链接
            url: undefined as Url | undefined
        }
    },
    getters: {
        /**
         * 返回全部的链接
         */
        list: (state): Array<Url> => {
            return state.urls;
        },
        current: (state): string => {
            return state.url && state.url.value ? state.url.value! : '';
        },
        id: (state): number | undefined => {
            return state.url ? state.url.id! : undefined;
        }
    },
    actions: {
        /**
         * 重新获取链接
         */
        reset(callback?: () => void) {
            urlService.list(urls => {
                this.urls = urls;
                if (callback) {
                    callback()
                }
            });
        },
        /**
         * 选择链接
         */
        choose(id?: number) {
            if (id) {
                // 查询URL
                let url = this.urls.find(e => e.id! === id);
                if (!url) {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '系统异常，未找到url'
                    });
                    return;
                }
                this.url = url;
                title.value = url.name || 'es-client';
            }
        },
        clear() {
            this.url = undefined;
            title.value = 'es-client';
        }
    }
});

export default useUrlStore;