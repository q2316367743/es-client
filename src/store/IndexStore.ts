import Index from "@/view/Index";
import { defineStore } from "pinia";
import indexListBuild from '@/build/IndexListBuild';
import { ElLoading } from 'element-plus'
import { useUrlStore } from '@/store/UrlStore';
import clusterApi from '@/api/ClusterApi'

export const useIndexStore = defineStore('index', {
    state: () => {
        return {
            // 全部的索引
            indices: new Array<Index>(),
            // 服务器名称
            name: '',
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
        async reset(url?: string) {
            if (!url) {
                url = useUrlStore().current;
            }
            if (url === '' || !url) {
                this.indices = [];
                this.name = '';
                return;
            }
            // 初始化时加载
            const loading = ElLoading.service({
                lock: true,
                text: '获取索引信息中',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            try {
                // 获取索引信息
                this.indices = await indexListBuild(url);
                // 获取基本信息
                let info = await clusterApi.info();
                this.name = info.name as string;
                loading.close();
            } catch (e: any) {
                loading.close();

            }
        }
    }
})