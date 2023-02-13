<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')">
        <div class="base-search">
            <!-- 标签页 -->
            <div class="base-search-tab" v-if="instance.showTab">
                <tab-menu v-model="searchId" v-model:search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                          @option-tab="optionTab"/>
            </div>
            <!-- 主要显示区域 -->
            <div class="base-search-main" :class="instance.showTab ? '' : 'full-screen'">
                <!-- 顶部菜单栏 -->
                <div class="base-option">
                    <div class="left">
                        <a-select v-model="current.index" style="width: 260px;" allow-search
                                  allow-clear :placeholder="$t('baseSearch.placeholder.selectIndex')">
                            <a-option v-for="index in indices" :key="index.label" :label="index.label"
                                      :value="index.value"/>
                        </a-select>
                        <!-- 搜索 -->
                        <a-button type="primary" status="success" style="margin-left: 12px" @click="search">{{
                                $t('common.operation.search')
                            }}
                        </a-button>
                        <!-- 清空 -->
                        <a-button type="primary" status="danger" @click="clear(true)">{{
                                $t('common.operation.clear')
                            }}
                        </a-button>
                        <a-button @click="historyDialog = true">{{ $t('common.operation.history') }}</a-button>
                    </div>
                    <div class="right">
                        <a-select v-model="view" style="width: 120px;">
                            <a-option :label="$t('common.keyword.jsonView')" :value="2"></a-option>
                            <a-option :label="$t('common.keyword.tableView')" :value="3"></a-option>
                        </a-select>
                    </div>
                </div>
                <a-scrollbar style="height: calc(100vh - 58px);margin-top: 40px;overflow: auto;">
                    <!-- 核心查询区 -->
                    <div class="base-display" ref="baseDisplay">
                        <!-- 查询条件 -->
                        <div class="base-condition" ref="baseCondition">
                            <a-form :model="current" layout="vertical" label-width="80px"
                                    style="overflow-x: auto;overflow-y: hidden;">
                                <!-- 条件 -->
                                <a-form-item :label="$t('baseSearch.form.condition')" style="min-width: 1100px">
                                    <field-condition-container v-model="current.conditions" :fields="fields"/>
                                </a-form-item>
                                <!-- 排序 -->
                                <a-form-item :label="$t('baseSearch.form.order')">
                                    <field-order-container v-model="current.orders" :fields="fields"/>
                                </a-form-item>
                                <a-affix :offset-top="90" target="baseDisplay">
                                    <a-pagination :total="current.total" v-model:current="page" v-model:page-size="size"
                                                  show-total show-jumper
                                                  show-page-size/>
                                </a-affix>
                            </a-form>
                        </div>
                        <!-- 查询结果 -->
                        <div class="base-content" ref="baseContent">
                            <data-view :view="view" :result="current.result" :abs="false"/>
                        </div>
                    </div>
                    <a-back-top target-container=".arco-scrollbar-container" v-show="showTop"/>
                </a-scrollbar>
                <div class="base-search-condition-sentence">
                    <a-button type="text" @click="showBody">
                        {{ $t('baseSearch.form.displayQueryStatement') }}
                    </a-button>
                    <a-button type="text" @click="jumpToSeniorSearch">
                        {{ $t('common.action.jumpToSeniorSearch') }}
                    </a-button>
                </div>
            </div>
            <a-modal :title="$t('baseSearch.dialog.statement')" v-model:visible="condition.dialog" width="70%"
                     append-to-body
                     class="es-dialog" :close-on-click-modal="false">
                <json-view :data="condition.data"/>
            </a-modal>
            <bsh-manage v-model="historyDialog"/>
        </div>
    </a-spin>
</template>

<script lang="ts">
import {defineComponent, toRaw} from "vue";
import {mapState} from "pinia";

import TableViewer from "@/components/TableViewer/index.vue"
import DataView from "@/components/DataView/index.vue";
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";

import mitt from '@/plugins/mitt';
import emitter from '@/plugins/mitt';

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";

import BaseQuery from '@/entity/BaseQuery';
import BaseOrder from "@/entity/BaseOrder";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import QueryConditionBuild from './build/QueryConditionBuild';
import './index.less';

import Field from "@/view/Field";

import {BaseSearchItem} from "@/page/BaseSearch/BaseSearchItem";
import FieldOrderContainer from "@/page/BaseSearch/FiledOrder/FieldOrderContainer.vue";
import FieldConditionContainer from "@/page/BaseSearch/FieldCondition/FieldConditionContainer.vue";

import {
    baseSearchHistoryService,
    useBaseSearchEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import JsonView from "@/components/JsonView/index.vue";
import BshManage from "@/page/BaseSearch/History/index.vue";
import useBaseTempRecordStore from "@/store/BaseTempRecordStore";
import useUrlStore from "@/store/UrlStore";
import DocumentApi from "@/api/DocumentApi";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {SelectOptionData} from "@arco-design/web-vue";

// 公共方法
export default defineComponent({
    name: 'base-search',
    components: {
        BshManage,
        JsonView,
        FieldConditionContainer,
        FieldOrderContainer,
        TabMenu,
        DataView,
        TableViewer
    },
    data: () => {
        let searchMap = new Map<number, BaseSearchItem>();
        let searchId = new Date().getTime();
        searchMap.set(searchId, {
            header: {
                id: searchId,
                name: '基础查询'
            },
            body: {
                index: '',
                conditions: new Array<BaseQuery>(),
                orders: new Array<BaseOrder>(),
                page: 1,
                size: useSettingStore().getPageSize,
                total: 0,
                result: {}
            }
        });
        return {
            searchMap,
            searchId,

            current: {
                // 选择的索引名称
                index: '',
                // 条件
                conditions: new Array<BaseQuery>(),
                orders: new Array<BaseOrder>(),
                // 查询结果
                total: 0,
                result: {} as any,
            },
            // 分页
            page: 1,
            size: useSettingStore().getPageSize,

            fields: new Array<Field>(),

            loading: false,
            visibility: true,

            // 条件对话框
            condition: {
                dialog: false,
                data: {}
            },
            historyDialog: false,

            // 视图
            view: useSettingStore().getDefaultViewer,
            showTop: true,
        };
    },
    computed: {
        // 索引
        ...mapState(useIndexStore, {
            indices: (state): SelectOptionData[] => {
                let names = new Array<SelectOptionData>();
                let indices = state.indices;
                indices.forEach(e => {
                    names.push({
                        label: e.name,
                        value: `n:${e.name}`
                    });
                    e.alias.forEach(a => names.push({
                        label: a,
                        value: `a:${e.name}`
                    }))
                });
                return names.sort((a, b) => {
                    return a.label!.localeCompare(b.label!, "zh-CN");
                });
            }
        }),
        ...mapState(useSettingStore, ['instance']),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        },
    },
    watch: {
        size() {
            this.search();
        },
        page() {
            this.search();
        },
        searchId() {
            let baseSearchItem = this.searchMap.get(this.searchId);
            if (baseSearchItem) {
                this.current = {
                    ...baseSearchItem.body
                }
                this.page = baseSearchItem.body.page;
                this.size = baseSearchItem.body.size;
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
                this.fields = useIndexStore().field(newValue);
                if (newValue === '') {
                    this.clear();
                }
            }
        }
    },
    created() {
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置条件
            this.clear(true);
        });
        mitt.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
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
                    index: `n:${event.index}`,
                    conditions: event.conditions,
                    orders: event.orders,
                    page: 1,
                    size: useSettingStore().getPageSize,
                    total: 0,
                    result: {}
                }
            } as BaseSearchItem
            if (useSettingStore().getShowTab) {
                // 显示标签
                this.searchMap.set(searchId, searchItem);
                this.searchId = searchId;
            }

            // 因为延迟问题，预先设置值
            this.current = searchItem.body;
            this.page = searchItem.body.page;
            this.size = searchItem.body.size;
            this.$nextTick(() => {
                if (event.execute) {
                    this.search();
                }
            })
        })
    },
    methods: {
        showBody() {
            this.condition = {
                dialog: true,
                data: QueryConditionBuild(this.current.conditions, this.page, this.size, this.current.orders)
            }
        },
        search() {
            if (this.current.index.length === 0) {
                MessageBoxUtil.alert(this.$t('baseSearch.placeholder.selectIndex'));
                return;
            }
            this.loading = true;
            const index = this.current.index.slice(2);
            DocumentApi._search(
                index,
                QueryConditionBuild(this.current.conditions, this.page, this.size, this.current.orders)
            ).then((response) => {
                // 结果
                this.current.result = response;
                // 解析总数
                if (this.current.result.hits) {
                    if (parseInt(this.current.result.hits.total)) {
                        this.current.total = parseInt(this.current.result.hits.total)
                    } else if (parseInt(this.current.result.hits.total.value)) {
                        this.current.total = parseInt(this.current.result.hits.total.value);
                    } else {
                        this.current.total = 0;
                    }
                } else {
                    this.current.total = 0;
                }
                // 增加到历史
                useBaseTempRecordStore().addTempRecord({
                    id: new Date().getTime(),
                    index: index,
                    conditions: this.current.conditions,
                    orders: this.current.orders
                })
            }).catch((e) => {
                this.current.result = e.response.data;
            }).finally(() => {
                this.loading = false;
            });
        },
        clear(clear_index: boolean = false) {
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.current.total = 0;
            this.current.conditions = new Array<BaseQuery>();
            this.current.orders = new Array<BaseOrder>();
            this.current.result = {};
            this.condition = {
                dialog: false,
                data: {}
            }
            if (clear_index) {
                this.current.index = '';
            }
        },
        jumpToSeniorSearch() {
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            useSeniorSearchEvent.emit({
                link: `/${this.current.index}/_search`,
                method: 'POST',
                params: JSON.stringify(
                    QueryConditionBuild(this.current.conditions, this.page, this.size, this.current.orders),
                    null,
                    4),
                execute: true
            })
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
        optionTab(command: string) {
            let strings = command.split('|');
            let option = strings[0];
            let id = parseInt(strings[1]);
            switch (option) {
                case 'close-one':
                    this.searchMap.delete(id);
                    if (this.searchId === id) {
                        if (this.searchMap.size > 0) {
                            this.searchId = this.searchMap.keys().next().value
                        }
                    }
                    break;
                case 'close-other':
                    // 移除其他
                    Array.from(this.searchMap.keys()).forEach(e => {
                        if (e !== id) {
                            this.searchMap.delete(e);
                        }
                    })
                    this.searchId = id;
                    break;
                case 'close-all':
                    this.searchMap.clear();
                    break;
                case 'rename':
                    MessageBoxUtil.prompt("请输入新的标签名字", "修改标签名", {
                        confirmButtonText: '修改',
                        cancelButtonText: '取消',
                        inputValue: strings[2],
                        inputPattern: /.+/,
                        inputErrorMessage: '必须输入标签名'
                    }).then((value) => {
                        let searchItem = this.searchMap.get(id);
                        if (searchItem) {
                            searchItem.header.name = value;
                        }
                    }).catch(() => {
                    });
                    break;
                case 'save-history':
                    let searchItem = this.searchMap.get(id);
                    if (!searchItem) {
                        MessageUtil.error('标签未找到');
                        return;
                    }
                    // 保存到历史
                    baseSearchHistoryService.save({
                        urlId: Optional.ofNullable(useUrlStore().id).orElse(0),
                        name: searchItem.header.name,
                        index: searchItem.body.index,
                        conditions: toRaw(searchItem.body.conditions),
                        orders: toRaw(searchItem.body.orders)
                    }).then(() => MessageUtil.success('新增成功'))
                        .catch(e => MessageUtil.error('新增失败', e));
                    break;
                case 'update-history':
                    let searchItem2 = this.searchMap.get(id);
                    if (!searchItem2) {
                        MessageUtil.error('标签未找到');
                        return;
                    }
                    let relationId = parseInt(strings[2]);
                    baseSearchHistoryService.update({
                        id: relationId,
                        name: searchItem2.header.name,
                        index: searchItem2.body.index,
                        conditions: toRaw(searchItem2.body.conditions),
                        orders: toRaw(searchItem2.body.orders)
                    })
                        .then(() => MessageUtil.success(
                            '更新失败',
                            () => emitter.emit(MessageEventEnum.BASE_HISTORY_UPDATE)))
                        .catch(e => MessageUtil.error('更新失败', e));

            }
            // 全部关闭了
            if (this.searchMap.size === 0) {
                this.clearAfter();
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
                    size: useSettingStore().getPageSize,
                    total: 0,
                    result: {}
                }
            };
            this.searchMap.set(searchId, searchItem);
            this.searchId = searchId;
        },
    },
});
</script>

<style lang="less">

</style>