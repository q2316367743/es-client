import { defineStore } from "pinia";
import Url from "@/entity/Url";
import urlDao from "@/dao/UrlDao";
import { useIndexStore } from "./IndexStore";

export const useUrlStore = defineStore('url', {
    state: () => {
        return {
            // 全部的链接
            urls: new Array<Url>(),
            // 当前选中的链接
            url: ''
        }
    },
    getters: {
        /**
         * 返回全部的链接
         */
        list: (state) => {
            return state.urls;
        },
        current: (state) => {
            return state.url;
        }
    },
    actions: {
        /**
         * 重新获取链接
         */
        reset() {
            urlDao.list(urls => {
                this.urls = urls;
            })
        },
        /**
         * 选择链接
         */
        choose(url: string) {
            this.url = url;
            if (url === '') {
                useIndexStore().clear();
            }
        }
    }
})