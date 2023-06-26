<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')" class="base-spin">
        <div class="base-search">
            <!-- 标签页 -->
            <div class="base-search-tab" v-if="showTab">
                <tab-menu v-model="searchId" v-model:search-item-headers="searchItemHeaders" @edit-tabs="editTabs"/>
            </div>
            <!-- 主要显示区域 -->
            <div class="base-search-main" :class="showTab ? '' : 'full-screen'">
                <!-- 顶部菜单栏 -->
                <base-search-header v-model:current-index="current.index" v-model:view="view"
                                    @open-history-dialog="historyDialog = true" @open-index-manage="openIndexManage"
                                    @search="search"/>
                <!-- 核心查询区 -->
                <div class="base-display" ref="baseDisplay">
                    <!-- 查询条件 -->
                    <div class="base-condition" ref="baseCondition">
                        <a-form :model="current" layout="vertical" label-width="80px"
                                style="overflow-x: auto;overflow-y: hidden;">
                            <!-- 条件 -->
                            <a-form-item :label="$t('baseSearch.form.condition')">
                                <field-condition-container v-model="current.conditions" :fields="fields"/>
                            </a-form-item>
                            <!-- 排序 -->
                            <a-form-item :label="$t('baseSearch.form.order')">
                                <field-order-container v-model="current.orders" :fields="fields"/>
                            </a-form-item>
                            <div class="base-condition-pagination">
                                <a-pagination :total="current.total" v-model:current="current.page"
                                              :page-size="current.size" show-total/>
                                <a-input-number v-model="current.size" style="width: 70px"/>
                            </div>
                        </a-form>
                    </div>
                    <!-- 查询结果 -->
                    <div class="base-content hljs" ref="baseContent">
                        <base-search-data-view ref="baseSearchDataView" :view="view" :data="current.result"
                                               :index="current.index"/>
                    </div>
                    <a-back-top target-container=".base-display"/>
                </div>
                <a-back-top target-container=".arco-scrollbar-container" v-show="showTop"/>
                <div class="base-search-condition-sentence">
                    <a-button type="text" @click="showBody">
                        {{ $t('baseSearch.form.displayQueryStatement') }}
                    </a-button>
                    <a-button type="text" @click="jumpToSeniorSearch">
                        {{ $t('common.action.jumpToSeniorSearch') }}
                    </a-button>
                    <a-button type="text" @click="execCopy">
                        {{ $t('common.action.copy') }}
                    </a-button>
                </div>
            </div>
            <a-modal :title="$t('baseSearch.dialog.statement')" v-model:visible="condition.dialog" width="70%"
                     render-to-body class="es-dialog" :mask-closable="false">
                <json-view :data="condition.data"/>
            </a-modal>
            <bsh-manage v-model="historyDialog"/>
        </div>
    </a-spin>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";

// 自定义组件
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import JsonView from "@/components/JsonView/index.vue";

import emitter from '@/plugins/mitt';

// 全局存储
import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";
import useBaseTempRecordStore from "@/store/BaseTempRecordStore";

import BaseQuery from '@/entity/BaseQuery';
import BaseOrder from "@/entity/BaseOrder";

// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

// 核心算法
import QueryConditionBuild from './algorithm/QueryConditionBuild';

import {BaseSearchItem} from "./domain/BaseSearchItem";

// 内部组件
import FieldOrderContainer from "@/page/base-search/components/filed-order/container.vue";
import FieldConditionContainer from "@/page/base-search/components/field-condition/container.vue";
import BshManage from "./components/History/index.vue";
import BaseSearchDataView from "./components/data-view/index.vue";
import BaseSearchHeader from './components/header/index.vue';


import Field from "@/view/Field";

// 使用的工具类
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {
    applicationLaunch,
    useBaseSearchEvent,
    useIndexManageEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import DocumentApi from "@/api/DocumentApi";


export default defineComponent({
    name: 'base-search',
    components: {
        BaseSearchDataView,
        BshManage,
        JsonView,
        FieldConditionContainer,
        FieldOrderContainer,
        TabMenu,
        BaseSearchHeader
    },
    data: () => ({
        searchMap: new Map<number, BaseSearchItem>(),
        searchId: 0,

        header: {
            id: 0,
            name: '基础查询'
        } as TabMenuItem,
        current: {
            index: '',
            conditions: new Array<BaseQuery>(),
            orders: new Array<BaseOrder>(),
            page: 1,
            size: 20,
            total: 0,
            result: {}
        },

        fields: [{
            name: '_id',
            dataIndex: '_id',
            type: 'string'
        }] as Array<Field>,

        loading: false,
        visibility: true,

        // 条件对话框
        condition: {
            dialog: false,
            data: {}
        },
        historyDialog: false,

        // 视图
        view: ViewTypeEnum.JSON,
        showTop: true,
        ViewTypeEnum
    }),
    computed: {
        // 索引
        ...mapState(useIndexStore, {
            indexAliasMap: (state): Map<string, string> => {
                let aliasIndexMap = new Map<string, string>();
                state.indices.forEach(index => {
                    aliasIndexMap.set(index.name, index.name);
                    [index.name, ...index.alias].forEach(alias => aliasIndexMap.set(alias, index.name));
                });
                return aliasIndexMap;
            }
        }),
        ...mapState(useSettingStore, ['showTab', 'pageSize', 'defaultViewer']),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        },
    },
    watch: {
        "current.size": {
            handler() {
                if (this.current.index.length > 0) {
                    this.search();
                }
            }
        },
        "current.page": {
            handler() {
                if (this.current.index.length > 0) {
                    this.search();
                }
            }
        },
        searchId() {
            let baseSearchItem = this.searchMap.get(this.searchId);
            if (baseSearchItem) {
                this.header = baseSearchItem.header;
                this.current = baseSearchItem.body;
            } else {
                if (this.searchMap.size > 0) {
                    this.searchId = this.searchMap.keys().next().value;
                } else {
                    this.clearAfter();
                }
            }
        },
        'current.index': {
            handler(newValue: string) {
                if (newValue.length > 0) {
                    this.fields = useIndexStore().field(newValue).sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    });
                    this.current.page = 1;
                    this.current.size = this.pageSize;
                    return;
                }
                if (newValue === '') {
                    this.clear();
                }
                this.fields = [{
                    name: '_id',
                    dataIndex: '_id',
                    type: 'string'
                }]
            }
        }
    },
    created() {
        this.clearAfter();
        emitter.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置条件
            this.clear(true);
        });
        emitter.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.showTop = (index === PageNameEnum.BASE_SEARCH)
        });
        useBaseSearchEvent.on(event => {
            let searchId = new Date().getTime();
            let searchItem = {
                header: {
                    id: searchId,
                    name: Optional.ofNullable(event.name).orElse(searchId + ''),
                    relationId: event.id
                },
                body: {
                    index: event.index,
                    conditions: event.conditions,
                    orders: event.orders,
                    page: 1,
                    size: this.pageSize,
                    total: 0,
                    result: {}
                }
            } as BaseSearchItem
            if (this.showTab) {
                // 显示标签栏
                this.searchMap.set(searchId, searchItem);
                this.searchId = searchId;
                this.header = searchItem.header;
            } else {
                // 隐藏标签栏
                this.header.relationId = searchItem.header.relationId;
                this.header.name = searchItem.header.name
            }
            this.current = searchItem.body;
            this.$nextTick(() => {
                if (event.execute) {
                    this.search();
                }
            })
        });
        applicationLaunch.register(() => {
            this.view = this.defaultViewer
            return Promise.resolve()
        });
    },
    methods: {
        showBody() {
            try {
                this.condition = {
                    dialog: true,
                    data: QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders)
                }
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
            }
        },
        search() {
            if (this.current.index.length === 0) {
                MessageBoxUtil.alert(this.$t('baseSearch.placeholder.selectIndex'), null);
                return;
            }
            this.loading = true;
            try {
                DocumentApi(this.current.index)._search(
                        QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders)
                ).then((response) => {
                    // 结果
                    this.current.result = response as Record<string, any>;
                    // 解析总数
                    if (response.hits) {
                        if (parseInt(response.hits.total)) {
                            this.current.total = parseInt(response.hits.total)
                        } else if (parseInt(response.hits.total.value)) {
                            this.current.total = parseInt(response.hits.total.value);
                        } else {
                            this.current.total = 0;
                        }
                    } else {
                        this.current.total = 0;
                    }
                    // 增加到历史
                    useBaseTempRecordStore().addTempRecord({
                        id: new Date().getTime(),
                        index: this.current.index,
                        conditions: this.current.conditions,
                        orders: this.current.orders
                    })
                }).catch((e) => {
                    this.current.result = e.response.data;
                }).finally(() => {
                    this.loading = false;
                });
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
                this.loading = false;
            }
        },
        clear(clear_index: boolean = false) {
            this.current.page = 1;
            this.current.size = this.pageSize;
            this.current.total = 0;
            this.current.conditions = new Array<BaseQuery>();
            this.current.orders = new Array<BaseOrder>();
            this.current.result = {};
            this.condition = {
                dialog: false,
                data: {}
            }
            this.header.name = '基础查询';
            this.header.relationId = undefined;
            if (clear_index) {
                this.current.index = '';
            }
        },
        jumpToSeniorSearch() {
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            try {
                useSeniorSearchEvent.emit({
                    link: `/${this.current.index}/_search`,
                    method: 'POST',
                    params: JSON.stringify(
                            QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders),
                            null,
                            4)
                });
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
            }
        },
        editTabs(targetName: number, action: 'remove' | 'add') {
            if (action === 'add') {
                this.clearAfter();
            } else if (action === 'remove') {
                this.searchMap.delete(targetName);
                if (this.searchMap.size === 0) {
                    this.clearAfter();
                } else {
                    if (this.searchId === targetName) {
                        this.searchId = this.searchMap.keys().next().value
                    }
                }
            }
        },
        clearAfter() {
            let searchId = new Date().getTime();
            let searchItem = {
                header: {
                    id: searchId,
                    name: '基础查询'
                },
                body: {
                    index: '',
                    conditions: new Array<BaseQuery>(),
                    orders: new Array<BaseOrder>(),
                    page: 1,
                    size: this.pageSize,
                    total: 0,
                    result: {}
                }
            };
            this.searchMap.set(searchId, searchItem);
            this.searchId = searchId;
        },
        openIndexManage() {
            if (this.current.index === '') {
                MessageUtil.error('请先选择索引');
                return;
            }
            let index = this.indexAliasMap.get(this.current.index);
            if (index) {
                useIndexManageEvent.emit(index);
            } else {
                MessageUtil.warning(`索引【${this.current.index}】未找到`)
            }
        },
        execCopy() {
            (this.$refs['baseSearchDataView'] as any).execCopy()
        }
    }
});
</script>

<style lang="less">
@import url(./index.less);
</style>
