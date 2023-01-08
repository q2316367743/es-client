import IndexView from "@/view/index/IndexView";
import {defineStore} from "pinia";
import indexListBuild from '@/build/IndexListBuild';
import {ElLoading, ElNotification} from 'element-plus'
import clusterApi from '@/api/ClusterApi'
import useUrlStore from "@/store/UrlStore";
import {useEsVersion} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import ArrayUtil from "@/utils/ArrayUtil";

const useIndexStore = defineStore('index', {
    state: () => {
        return {
            // 全部的索引
            indices: new Array<IndexView>(),
            indicesMap: new Map<string, IndexView>(),
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
        async reset(success?: () => void ) {
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
                this.indicesMap = ArrayUtil.map(
                    this.indices,
                    'name',
                    (e1, e2) => {
                    ElNotification({
                        title: '警告',
                        type: "warning",
                        message: '索引存在名称相同，程序可能出现错误',
                    })
                    return e1
                });
                // 获取基本信息
                loading.setText('开始获取索引健康值');
                let health = await clusterApi._cluster_health();
                this.name = health.cluster_name as string;
                this.active_shards = health.active_shards as number;
                let unassigned_shards = health.unassigned_shards as number;
                this.total_shards = this.active_shards + unassigned_shards;
                this.status = health.status as string;
                loading.setText('获取elasticsearch信息');
                let info = await clusterApi.info();
                //info ? info['version'] ? info['version']['number'] ? info['version']['number'] : '' : '' : ''
                useEsVersion().setVersion(Optional.ofNullable(info)
                    .map(e => e['version'])
                    .map(e => e['number'])
                    .orElse(''));
                loading.close();
                if (success) {
                    success();
                }
            } catch (e: any) {
                useUrlStore().choose();
                loading.close();
                console.error(e);
            }
        },
        clear() {
            this.name = '';
            this.indices = new Array<IndexView>();
            this.indicesMap = new Map<string, IndexView>();
        }
    }
});

export default useIndexStore;