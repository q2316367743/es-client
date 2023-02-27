<template>
    <div class="home">
        <!-- 上面的搜索条件 -->
        <div class="home-option">
            <div style="display: flex">
                <!-- 输入框 -->
                <a-input v-model="condition.name" :placeholder="$t('home.placeholder.index')"
                    style="width: 250px;height: 32px;" @input="search" @clear="search" allow-clear></a-input>
                <a-select v-model="condition.order" :placeholder="$t('home.placeholder.order')"
                    style="margin-left: 5px;width: 150px;" clearable @change="search">
                    <a-option :label="$t('home.order.nameAsc')" value="NAME_ASC"></a-option>
                    <a-option :label="$t('home.order.nameDesc')" value="NAME_DESC"></a-option>
                    <a-option :label="$t('home.order.sizeAsc')" value="SIZE_ASC"></a-option>
                    <a-option :label="$t('home.order.sizeDesc')" value="SIZE_DESC"></a-option>
                    <a-option :label="$t('home.order.docAsc')" value="DOC_ASC"></a-option>
                    <a-option :label="$t('home.order.docDesc')" value="DOC_DESC"></a-option>
                </a-select>
                <a-button style="margin-left: 5px" @click="condition.dialog = true">{{ $t('common.operation.more') }}
                </a-button>
                <a-button type="primary" style="margin-left: 5px" @click="search">{{
                    $t('common.operation.search')
                }}
                </a-button>
            </div>
            <a-button type="primary" style="margin-left: 10px" @click="indexAddDialog = true" :disabled="!url">{{
                $t('common.operation.new')
            }}
            </a-button>
        </div>
        <!-- 索引容器 -->
        <div class="home-container" ref="homeContainer">
            <a-empty v-if="showIndices.length === 0" description="空空如也" style="margin-top: 20%;" />
            <a-spin :loading="indexLoading" style="width: 100%;">
                <vxe-list :data="showIndices" :auto-resize="true" :height="height">
                    <template #default="{ items }">
                        <index-item v-for="item in items" v-show="item.show" :index="item" @open-dialog="indexOpenDialog"
                            @open-manage="indexOpenManage" />
                    </template>
                </vxe-list>
            </a-spin>
            <a-back-top target-container=".home-container .vxe-list--virtual-wrapper" />
        </div>
        <div class="home-statistics" v-if="url">
            <div class="bridge" type="primary">
                <div class="label">{{ $t('home.statistics.total') }}</div>
                <div class="value">{{ statistics.total }}</div>
            </div>
            <div class="bridge" type="warning">
                <div class="label">{{ $t('home.statistics.open') }}</div>
                <div class="value">{{ statistics.totalOpen }}</div>
            </div>
            <div class="bridge" type="error">
                <div class="label">{{ $t('home.statistics.close') }}</div>
                <div class="value">{{ statistics.totalClose }}</div>
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
        <home-index-add v-model="indexAddDialog" />
        <!-- 数据展示 -->
        <json-dialog :title="indexItem.title" :json="indexItem.data" :open="true" v-model:value="indexItem.dialog" />
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
import { defineAsyncComponent, defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useElementSize } from "@vueuse/core";

import useUrlStore from '@/store/UrlStore';
import useIndexStore from '@/store/IndexStore';

import IndexItem from "./components/IndexItem.vue";
import JsonDialog from "@/components/JsonDialog.vue";

import mitt from '@/plugins/mitt';
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import { stringContain } from "@/utils/SearchUtil";

import IndexItemView from '@/view/IndexItemView';
import { useIndexManageEvent } from "@/global/BeanFactory";

let lastSearchTime = 0;
let lastExecuteId = -1;

export default defineComponent({
    name: 'Home',
    components: {
        IndexItem, JsonDialog,
        HomeIndexAdd: defineAsyncComponent(() => import('@/module/IndexAdd/index.vue'))
    },
    data: () => {
        return {
            // 根据条件过滤后的索引
            showIndices: [] as Array<IndexItemView>,
            // 搜索条件
            condition: {
                dialog: false,
                name: "",
                order: "NAME_ASC",
                // 0不处理，1开启，2关闭
                state: 0
            },
            statistics: {
                total: 0,
                totalOpen: 0,
                totalClose: 0,
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
            showTop: true,
            indexAddDialog: false,
            // 高度
            height: undefined as any,
        };
    },
    computed: {
        ...mapState(useUrlStore, ['url']),
        ...mapState(useIndexStore, ['indices']),
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
                order: "NAME_ASC",
                state: 0
            }
            // 重置页面
            this.indexItem = {
                dialog: false,
                title: '',
                data: {} as any,
            };
            this.search();
        });
    },
    mounted() {
        let homeContainer = this.$refs['homeContainer'] as HTMLDivElement;
        const { height } = useElementSize(homeContainer);
        this.height = height;
    },
    methods: {
        /**
         * 基于当前索引数组进行过滤
         */
        search() {
            let now = new Date().getTime();
            if (now - lastSearchTime < 500) {
                // 限流500ms
                clearTimeout(lastExecuteId);
                lastExecuteId = setTimeout(() => this.executeSearch(), 500) as unknown as number;
            } else {
                lastExecuteId = setTimeout(() => this.executeSearch(), 500) as unknown as number;
            }
            lastSearchTime = now;
        },
        executeSearch() {
            this.indexLoading = true;
            let showIndices = new Array<IndexItemView>();
            for (let index of this.indices) {
                let show = false;
                if (stringContain(index.name, this.condition.name)) {
                    show = true;
                }
                // 别名
                if (index.alias && index.alias.length > 0) {
                    for (let alias of index.alias) {
                        if (stringContain(alias, this.condition.name)) {
                            show = true;
                            break;
                        }
                    }
                }
                showIndices.push({
                    ...index,
                    show
                });
            }
            if (this.condition.state > 0) {
                for (let showIndex of showIndices) {
                    showIndex.show = ((this.condition.state === 1 && showIndex.state === 'open') ||
                        (this.condition.state === 2 && showIndex.state === 'close')) && showIndex.show
                }
            }
            // 排序
            switch (this.condition.order) {
                case "NAME_ASC":
                    showIndices = showIndices.sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    });
                    break;
                case "NAME_DESC":
                    showIndices = showIndices.sort((a, b) => {
                        return b.name.localeCompare(a.name, "zh-CN");
                    });
                    break;
                case "SIZE_ASC":
                    showIndices = showIndices.sort((a, b) => {
                        return a.original_size - b.original_size;
                    });
                    break;
                case "SIZE_DESC":
                    showIndices = showIndices.sort((a, b) => {
                        return b.original_size - a.original_size;
                    });
                    break;
                case "DOC_ASC":
                    showIndices = showIndices.sort((a, b) => {
                        return a.doc_count - b.doc_count;
                    });
                    break;
                case "DOC_DESC":
                    showIndices = showIndices.sort((a, b) => {
                        return b.doc_count - a.doc_count;
                    });
                    break;
            }
            this.indexLoading = false;
            this.$nextTick(() => {
                this.showIndices = showIndices;
            });
            // 统计
            let total = this.indices.length;
            let totalOpen = 0;
            let totalClose = 0;
            let show = 0;
            let showOpen = 0;
            let showClose = 0;
            for (let index of showIndices) {
                if (index.state === 'open') {
                    totalOpen += 1;
                } else if (index.state === 'close') {
                    totalClose += 1;
                }
                // 展示
                if (index.show) {
                    show += 1;
                    if (index.state === 'open') {
                        showOpen += 1;
                    } else if (index.state === 'close') {
                        showClose += 1;
                    }
                }
            }
            this.statistics = {
                total,
                totalOpen,
                totalClose,
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
.home {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;

    .home-option {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        display: flex;
        justify-content: space-between;
    }

    .home-container {
        position: absolute;
        top: 35px;
        left: 0;
        right: 0;
        bottom: 26px;
    }

    .home-statistics {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 25px;
        line-height: 30px;
        border-top: 1px solid var(--color-border-2);
        display: flex;

        .bridge {
            margin-top: 4px;
        }
    }
}
</style>