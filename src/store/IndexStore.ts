import IndexView from "@/view/index/IndexView";
import {defineStore} from "pinia";
import indexListBuild from '@/build/IndexListBuild';
import {ElLoading, ElNotification} from 'element-plus'
import clusterApi from '@/api/ClusterApi'
import useUrlStore from "@/store/UrlStore";
import {useEsVersion} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import Field from "@/view/Field";

function renderMap(indices: Array<IndexView>): Map<string, IndexView> {
    let indicesMap = new Map<string, IndexView>();
    for (let index of indices) {
        let names = [index.name, ...index.alias];
        for (let name of names) {
            indicesMap.set(name, index);
        }
    }
    return indicesMap;
}

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
            status: '',
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
        async reset(): Promise<void> {
            if (useUrlStore().current === '') {
                return Promise.reject('链接不存在');
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
                // 渲染map
                this.indicesMap = renderMap(this.indices);

                // 获取基本信息
                clusterApi._cluster_health().then(health => {
                    this.name = health.cluster_name;
                    this.active_shards = health.active_shards;
                    let unassigned_shards = health.unassigned_shards;
                    this.total_shards = this.active_shards + unassigned_shards;
                    this.status = health.status;
                }).catch(e => {
                    ElNotification({
                        title: '获取索引健康值失败',
                        type: "error",
                        message: e,
                    });
                });

                clusterApi.info()
                    .then(info => {
                        // 异步执行就可以
                        useEsVersion().setVersion(Optional.ofNullable(info)
                            .map(e => e.version)
                            .map(e => e.number)
                            .orElse(''));
                    })
                    .catch(e => {
                        ElNotification({
                            title: '获取elasticsearch版本失败',
                            type: "error",
                            message: e,
                        });
                    });
                return Promise.resolve();
            } catch (e: any) {
                useUrlStore().clear();
                console.error(e);
                return Promise.reject(e);
            } finally {
                loading.close();
            }
        },
        clear() {
            this.name = '';
            this.indices = new Array<IndexView>();
            this.indicesMap = new Map<string, IndexView>();
        },
        field(indexName: string): Array<Field> {
            let indexView = this.indicesMap.get(indexName);
            if (indexView) {
                return [...Array.from(indexView.fields), {
                    name: '_doc._id',
                    type: 'text'
                }]
            }
            return new Array<Field>;
        }
    }
});

export default useIndexStore;