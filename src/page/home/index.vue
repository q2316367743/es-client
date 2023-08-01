<template>
    <div class="home">
        <!-- 上面的搜索条件 -->
        <div class="home-option">
            <div style="display: flex">
                <!-- 输入框 -->
                <a-input v-model="condition.name" :placeholder="$t('home.placeholder.index')"
                         style="width: 250px;height: 32px;" @input="search()" @clear="search()" allow-clear></a-input>
                <a-button style="margin-left: 5px" @click="condition.dialog = true">{{ $t('common.operation.more') }}
                </a-button>
                <a-button type="primary" style="margin-left: 5px" @click="search()">
                    {{ $t('common.operation.search') }}
                </a-button>
            </div>
            <a-button type="primary" style="margin-left: 10px" @click="indexAddDialog = true" :disabled="!url">
                {{ $t('common.operation.new') }}
            </a-button>
        </div>
        <!-- 索引容器 -->
        <div class="home-container" ref="homeContainer">
            <a-list class="home-index-items" :data="showIndices" :virtual-list-props="virtualListProps"
                    :scrollbar="true"
                    :bordered="false" :split="false">
                <template #item="{ item }">
                    <a-list-item :key="item.name">
                        <index-item :index="item" @open-dialog="indexOpenDialog" @open-manage="indexOpenManage"/>
                    </a-list-item>
                </template>
                <template #empty>
                    <a-empty v-if="showIndices.length === 0" description="空空如也" style="margin-top: 20%"/>
                </template>
            </a-list>
            <a-back-top target-container=".home-container .arco-scrollbar-container"/>
        </div>
        <!-- 统计数据 -->
        <div class="home-statistics" v-if="url">
            <div class="bridge" type="primary">
                <div class="label">{{ $t('home.statistics.total') }}</div>
                <div class="value">{{ statistics.total }}</div>
            </div>
            <div class="bridge" type="success">
                <div class="label">{{ $t('home.statistics.display') }}</div>
                <div class="value">{{ statistics.show }}</div>
            </div>
            <div class="bridge" type="warning">
                <div class="label">{{ $t('home.statistics.open') }}</div>
                <div class="value">{{ statistics.showOpen }}</div>
            </div>
            <div class="bridge" type="error">
                <div class="label">{{ $t('home.statistics.close') }}</div>
                <div class="value">{{ statistics.showClose }}</div>
            </div>
        </div>
        <!-- 新增索引 -->
        <home-index-add v-model="indexAddDialog"/>
        <!-- 数据展示 -->
        <json-dialog :title="indexItem.title" :json="indexItem.data" :open="true" v-model:value="indexItem.dialog"/>
        <!-- 更多查询条件 -->
        <a-modal v-model:visible="condition.dialog" unmount-on-close render-to-body title="更多查询条件" draggable>
            <a-form :model="condition" label-width="80px" label-position="left">
                <a-form-item label="状态">
                    <a-radio-group v-model="condition.state">
                        <a-radio :value="0">忽略</a-radio>
                        <a-radio :value="1">开启</a-radio>
                        <a-radio :value="2">关闭</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent, markRaw, toRaw} from 'vue';
import {mapState} from 'pinia';
import Fuse from "fuse.js";
import {cloneDeep} from 'lodash-es';

import useUrlStore from '@/store/UrlStore';
import useIndexStore from '@/store/IndexStore';
import {useGlobalStore} from "@/store/GlobalStore";

import IndexItem from "./components/index-item.vue";
import JsonDialog from "@/components/json-dialog/index.vue";

import mitt from '@/plugins/mitt';
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import {useIndexManageEvent} from "@/global/BeanFactory";
import IndexView from "@/view/index/IndexView";

export default defineComponent({
    name: 'Home',
    components: {
        IndexItem, JsonDialog,
        HomeIndexAdd: defineAsyncComponent(() => import('./components/index-add.vue'))
    },
    data: () => {
        return {
            // 根据条件过滤后的索引
            showIndices: [] as Array<IndexView>,
            // 搜索条件
            condition: {
                dialog: false,
                name: "",
                // 0不处理，1开启，2关闭
                state: 0
            },
            statistics: {
                total: 0,
                show: 0,
                showOpen: 0,
                showClose: 0
            },
            // 列表加载中
            indexLoading: false,
            // 索引的详情对话框
            indexItem: {
                dialog: false,
                title: '',
                data: {} as any,
            },
            indexAddDialog: false,
            fuse: undefined as Fuse<IndexView> | undefined,
        };
    },
    computed: {
        ...mapState(useGlobalStore, ['height']),
        ...mapState(useUrlStore, ['url']),
        ...mapState(useIndexStore, ['indices']),
        virtualListProps() {
            return {
                height: this.height - 40 - 35 - 42
            };
        }
    },
    created() {
        mitt.on(MessageEventEnum.URL_REFRESH, () => {
            this.indexItem = {
                dialog: false,
                title: '',
                data: {} as any,
            };
            this.search();
        });
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置查询条件
            this.condition = {
                dialog: false,
                name: "",
                state: 0
            }
            // 重置页面
            this.indexItem = {
                dialog: false,
                title: '',
                data: {} as any,
            };
            this.fuse = markRaw(new Fuse<IndexView>(cloneDeep(toRaw(this.indices)), {
                shouldSort: true,
                threshold: 0.3,
                includeScore: true,
                includeMatches: true,
                keys: [
                    {name: 'name', weight: 0.9, getFn: e => e.name},
                    {name: 'alias', weight: 0.3, getFn: e => e.alias}
                ],
            }));
            this.search();
        });
    },
    methods: {
        /**
         * 基于当前索引数组进行过滤
         */
        search() {
            this.indexLoading = true;
            let showIndices = this.indices;
            if (this.condition.name.trim() !== '') {
                if (this.fuse) {
                    showIndices = this.fuse.search(this.condition.name)
                            .map(e => e.item);
                }
            } else {
                showIndices = showIndices.sort((a, b) => {
                    return a.name.localeCompare(b.name, "zh-CN")
                });
            }


            this.indexLoading = false;
            this.$nextTick(() => {
                this.showIndices = showIndices;
            });
            // 统计
            let total = this.indices.length;
            let show = 0;
            let showOpen = 0;
            let showClose = 0;
            for (let index of showIndices) {
                // 展示
                show += 1;
                if (index.state === 'open') {
                    showOpen += 1;
                } else if (index.state === 'close') {
                    showClose += 1;
                }
            }
            this.statistics = {
                total,
                show,
                showOpen,
                showClose
            };
        },
        indexOpenDialog(title: string, content: any) {
            this.indexItem = {
                dialog: true,
                title,
                data: content,
            }
        },
        indexOpenManage(name: string) {
            useIndexManageEvent.emit(name);
        }
    },
});
</script>

<style lang="less">
@import url(./index.less);
</style>
