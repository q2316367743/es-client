import Index from "@/view/Index";
import { defineStore } from "pinia";
import indexListBuild from '@/build/IndexListBuild';
import { ElLoading } from 'element-plus'
import clusterApi from '@/api/ClusterApi'
import useUrlStore from "@/store/UrlStore";

const useIndexStore = defineStore('index', {
    state: () => {
        return {
            // 全部的索引
            indices: new Array<Index>(),
            // 服务器名称
            name: '',
            active_shards: 0,
            total_shards: 0,
            status: ''
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
        async reset() {
            if (useUrlStore().current === '') {
                return;
            }
            // 初始化时加载
            const loading = ElLoading.service({
                lock: true,
                text: '准备索引信息中',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            try {
                loading.setText('开始构建索引信息');
                // 获取索引信息
                this.indices = await indexListBuild();
                // 获取基本信息
                loading.setText('开始获取索引健康值');
                let health = await clusterApi._cluster_health();
                this.name = health.cluster_name as string;
                this.active_shards = health.active_shards as number;
                let unassigned_shards = health.unassigned_shards as number;
                this.total_shards = this.active_shards + unassigned_shards;
                this.status = health.status as string;
                loading.close();
            } catch (e: any) {
                useUrlStore().choose();
                loading.close();
                console.error(e);
            }
        },
        clear() {
            this.name = '';
            this.indices = new Array<Index>();
        }
    }
});

export default useIndexStore;