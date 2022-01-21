import Index from "@/view/Index";
import { defineStore } from "pinia";
import indexListBuild from '@/build/IndexListBuild';
import { ElLoading } from 'element-plus'
import { useUrlStore } from '@/store/UrlStore';

export const useIndexStore = defineStore('index', {
    state: () => {
        return {
            // 全部的索引
            indices: new Array<Index>(),
        }
    },
    getters: {
        /**
         * 返回全部的链接
         */
        list: (state) => {
            return state.indices;
        }
    },
    actions: {
        /**
         * 重新获取链接
         */
        reset(url?: string) {
            if (!url) {
                url = useUrlStore().current;
            }
            if (url === '' || !url) {
                this.indices = [];
                return;
            }
            // 初始化时加载
            const loading = ElLoading.service({
                lock: true,
                text: '获取索引信息中',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            indexListBuild(url).then((indices) => {
                this.indices = indices;
                // 初始化
                loading.close();
            }).catch(() => {
                loading.close();
            })
        }
    }
})