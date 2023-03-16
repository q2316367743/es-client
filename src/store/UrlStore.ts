import {defineStore} from "pinia";
import {useTitle} from "@vueuse/core";

import Url from "@/entity/Url";

import {urlService} from "@/global/BeanFactory";
import ArrayUtil from "@/utils/ArrayUtil";

const title = useTitle();

const useUrlStore = defineStore('url', {
    state: () => {
        return {
            // 全部的链接
            urls: new Array<Url>(),
            urlMap: new Map<number, Url>(),
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
            urlService.list().then(urls => {
                this.urls = urls.sort((a, b) => b.sequence!- a.sequence!);
                this.urlMap = ArrayUtil.map(urls, 'id');
                if (callback) {
                    callback()
                }
            });
        },
        /**
         * 选择链接
         */
        choose(id: number): boolean {
            // 查询URL
            let url = this.urls.find(e => e.id! === id);
            if (!url) {
                return false;
            }
            this.url = url;
            title.value = url.name || 'es-client';
            return true;
        },
        clear() {
            this.url = undefined;
            title.value = 'es-client';
        }
    }
});

export default useUrlStore;