<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')" class="base-spin">
        <div class="base-search">
            <!-- 标签页 -->
            <div class="base-search-tab" v-if="instance.showTab">
                <tab-menu v-model="searchId" v-model:search-item-headers="searchItemHeaders" @edit-tabs="editTabs" />
            </div>
            <!-- 主要显示区域 -->
            <div class="base-search-main" :class="instance.showTab ? '' : 'full-screen'">
                <!-- 顶部菜单栏 -->
                <div class="base-option">
                    <div class="left">
                        <div class="base-extra-button" :class="extra ? 'open' : ''" @click="extra = !extra">
                            <icon-right />
                        </div>
                        <!-- 索引选择 -->
                        <a-select v-model="current.index" style="width: 260px;" allow-search allow-clear
                            :placeholder="$t('baseSearch.placeholder.selectIndex')">
                            <a-option v-for="index in indices" :key="index.label" :label="index.label"
                                :value="index.value" />
                        </a-select>
                        <!-- 搜索 -->
                        <a-button type="primary" status="success" @click="search" :disabled="current.index === ''">{{
                            $t('common.operation.search')
                        }}
                        </a-button>
                        <!-- 历史 -->
                        <a-button @click="historyDialog = true">{{ $t('common.operation.history') }}</a-button>

                    </div>
                    <div class="right">
                        <a-select v-model="view" style="margin-left: 8px;width: 140px;">
                            <a-option label="基础视图" :value="ViewTypeEnum.BASE" />
                            <a-option :label="$t('common.keyword.jsonView')" :value="ViewTypeEnum.JSON" />
                            <a-option :label="$t('common.keyword.tableView')" :value="ViewTypeEnum.TABLE" />
                            <a-option label="JSON树视图" :value="ViewTypeEnum.JSON_TREE" />
                        </a-select>
                    </div>
                </div>
                <div class="base-extra" v-if="extra">
                    <div class="left">
                        <!-- 索引管理 -->
                        <a-button type="primary" :disabled="current.index === ''" @click="openIndexManage">管理
                        </a-button>
                        <!-- 标签编辑 -->
                        <a-button-group>
                            <a-button type="outline" :status="header.relationId ? 'danger' : 'success'"
                                @click="optionTab('rename')">
                                {{ header.name }}
                            </a-button>
                            <a-dropdown @select="optionTab">
                                <a-button type="outline">
                                    <template #icon>
                                        <icon-down />
                                    </template>
                                </a-button>
                                <template #content>
                                    <a-doption value="update" v-if="header.relationId">更新</a-doption>
                                    <a-doption value="save" v-else>保存</a-doption>
                                    <a-doption value="save" v-if="header.relationId">保存到新的历史</a-doption>
                                    <a-doption value="rename">重命名</a-doption>
                                    <a-doption value="close-one" v-if="instance.showTab">关闭</a-doption>
                                    <a-doption value="close-other" v-if="instance.showTab">关闭其他</a-doption>
                                    <a-doption value="close-all" v-if="instance.showTab">关闭全部</a-doption>
                                    <a-doption value="cancel" v-if="header.relationId">取消关联</a-doption>
                                </template>
                            </a-dropdown>
                        </a-button-group>
                    </div>
                    <div class="right">
                        <a-button type="primary" :disabled="current.index === ''" @click="openDownload">导出
                        </a-button>
                    </div>
                </div>
                <!-- 核心查询区 -->
                <div class="base-display" ref="baseDisplay" :style="`top: ${extra ? '80' : '40'}px`">
                    <!-- 查询条件 -->
                    <div class="base-condition" ref="baseCondition">
                        <a-form :model="current" layout="vertical" label-width="80px"
                            style="overflow-x: auto;overflow-y: hidden;">
                            <!-- 条件 -->
                            <a-form-item :label="$t('baseSearch.form.condition')">
                                <field-condition-container v-model="current.conditions" :fields="fields" />
                            </a-form-item>
                            <!-- 排序 -->
                            <a-form-item :label="$t('baseSearch.form.order')">
                                <field-order-container v-model="current.orders" :fields="fields" />
                            </a-form-item>
                            <div class="base-condition-pagination">
                                <a-pagination :total="current.total" v-model:current="current.page"
                                    :page-size="current.size" show-total />
                                <a-input-number v-model="current.size" style="width: 70px" />
                            </div>
                        </a-form>
                    </div>
                    <!-- 查询结果 -->
                    <div class="base-content hljs" ref="baseContent">
                        <base-search-data-view ref="baseSearchDataView" :view="view" :data="current.result"
                            :index="current.index" />
                    </div>
                    <a-back-top target-container=".base-display" />
                </div>
                <a-back-top target-container=".arco-scrollbar-container" v-show="showTop" />
                <div class="base-search-condition-sentence" :style="`top: ${extra ? '82' : '42'}px`">
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
                <json-view :data="condition.data" />
            </a-modal>
            <bsh-manage v-model="historyDialog" />
            <a-modal title="导出" v-model:visible="download.dialog" width="600px" render-to-body unmount-on-close
                :mask-closable="false" draggable ok-text="导出" @ok="clickDownload">
                <a-form :model="download" layout="vertical">
                    <a-form-item label="文件名">
                        <a-input v-model="download.name" />
                    </a-form-item>
                    <a-form-item label="导出数量">
                        <a-select v-model="download.count">
                            <a-option label="当前页面" :value="1" />
                            <a-option label="指定范围" :value="2" />
                            <a-option label="全部" :value="3" />
                        </a-select>
                    </a-form-item>
                    <a-form-item label="范围" v-if="download.count === 2">
                        <a-input-number v-model="download.customStart" placeholder="从0开始" />
                        <span>-</span>
                        <a-input-number v-model="download.customEnd" placeholder="-1代表不限制" />
                    </a-form-item>
                    <a-form-item label="导出内容类型">
                        <a-select v-model="download.content">
                            <a-option label="原始结果集" :value="1" />
                            <a-option label="只导出_source" :value="2" />
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            每次分页查询数量
                            <a-tooltip content="数量太大可能造成浏览器卡顿" placement="top" effect="light">
                                <icon-question-circle style="margin-left: 5px;" />
                            </a-tooltip>
                        </template>
                        <a-input-number v-model="download.size" :disabled="download.count === 1" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </a-spin>
</template>

<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { mapState } from "pinia";
import { SelectOptionData } from "@arco-design/web-vue";

// 自定义组件
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import JsonView from "@/components/JsonView/index.vue";

import emitter from '@/plugins/mitt';

// 全局存储
import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";
import useBaseTempRecordStore from "@/store/BaseTempRecordStore";
import useUrlStore from "@/store/UrlStore";

import BaseQuery from '@/entity/BaseQuery';
import BaseOrder from "@/entity/BaseOrder";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

// 内部组件
import './index.less';

import QueryConditionBuild from './algorithm/QueryConditionBuild';
import exportBuild from "./algorithm/ExportBuild";

import { BaseSearchItem } from "./domain/BaseSearchItem";
import ExportConfig from "./domain/ExportConfig";

import FieldOrderContainer from "./components/FiledOrder/FieldOrderContainer.vue";
import FieldConditionContainer from "./components/FieldCondition/FieldConditionContainer.vue";
import BshManage from "./components/History/index.vue";
import BaseSearchDataView from "./components/DataView/index.vue";


import Field from "@/view/Field";

import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {
    applicationLaunch,
    baseSearchHistoryService,
    useBaseSearchEvent,
    useIndexManageEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import DocumentApi from "@/api/DocumentApi";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

function buildDefaultDownload(name: string, dialog: boolean = false): ExportConfig {
    return {
        // 导出对话框
        dialog,
        // 导出文件名
        name,
        // 导出类型：1【当前分页】，2【指定数量】，3【全部】
        count: 1,
        customStart: 0,
        customEnd: -1,
        // 导出内容类型：1【原始结果集】，2【只导出_source】
        content: 1,
        // 每次分页查询的数量
        size: 1000
    };
}

export default defineComponent({
    name: 'base-search',
    components: {
        BaseSearchDataView,
        BshManage,
        JsonView,
        FieldConditionContainer,
        FieldOrderContainer,
        TabMenu,
    },
    data: () => {
        let searchMap = new Map<number, BaseSearchItem>();
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
                result: {} as any
            }
        } as BaseSearchItem;
        searchMap.set(searchId, searchItem);
        return {
            searchMap,
            searchId,

            header: searchItem.header,
            current: searchItem.body,

            fields: [{
                name: '_id',
                dataIndex: '_id',
                type: 'string'
            }] as Array<Field>,

            loading: false,
            visibility: true,
            extra: false,

            // 条件对话框
            condition: {
                dialog: false,
                data: {}
            },
            historyDialog: false,

            download: buildDefaultDownload(''),

            // 视图
            view: ViewTypeEnum.JSON,
            showTop: true,
            ViewTypeEnum
        };
    },
    computed: {
        // 索引
        ...mapState(useIndexStore, {
            indices: (state): SelectOptionData[] => {
                let options = new Array<SelectOptionData>();
                let names = new Set<string>();
                let indices = state.indices;
                indices.forEach(e => {
                    // 索引
                    options.push({
                        label: e.name,
                        value: e.name,
                        index: e.name
                    });
                    // 别名
                    e.alias.forEach(a => {
                        if (!names.has(a)) {
                            options.push({
                                label: a,
                                value: a
                            })
                            names.add(a);
                        }
                    })
                });
                return options.sort((a, b) => {
                    return a.label!.localeCompare(b.label!, "zh-CN");
                });
            },
            indexAliasMap: (state): Map<string, string> => {
                let aliasIndexMap = new Map<string, string>();
                state.indices.forEach(index => {
                    aliasIndexMap.set(index.name, index.name);
                    [index.name, ...index.alias].forEach(alias => aliasIndexMap.set(alias, index.name));
                });
                return aliasIndexMap;
            }
        }),
        ...mapState(useSettingStore, ['instance']),
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
                    this.current.size = useSettingStore().getPageSize;
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
                    size: useSettingStore().getPageSize,
                    total: 0,
                    result: {}
                }
            } as BaseSearchItem
            if (useSettingStore().getShowTab) {
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
            this.view = useSettingStore().getDefaultViewer
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
            this.current.size = useSettingStore().getPageSize;
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
        optionTab(command: any) {
            switch (command) {
                case 'save':
                    // 保存到历史
                    baseSearchHistoryService.save({
                        urlId: Optional.ofNullable(useUrlStore().id).orElse(0),
                        name: this.header.name,
                        index: this.current.index,
                        conditions: toRaw(this.current.conditions),
                        orders: toRaw(this.current.orders)
                    })
                        .then(id => {
                            MessageUtil.success('新增成功');
                            this.header.relationId = id;
                        })
                        .catch(e => MessageUtil.error('新增失败', e));
                    break;
                case 'update':
                    baseSearchHistoryService.update({
                        id: this.header.relationId,
                        name: this.header.name,
                        index: this.current.index,
                        conditions: toRaw(this.current.conditions),
                        orders: toRaw(this.current.orders)
                    })
                        .then(() => MessageUtil.success(
                            '更新成功',
                            () => emitter.emit(MessageEventEnum.BASE_HISTORY_UPDATE)))
                        .catch(e => MessageUtil.error('更新失败', e));
                    break;
                case 'rename':
                    MessageBoxUtil.prompt("请输入新的标签名字", "修改标签名", {
                        confirmButtonText: '修改',
                        cancelButtonText: '取消',
                        inputValue: this.header.name,
                        inputPattern: /.+/,
                        inputErrorMessage: '必须输入标签名'
                    }).then((value) => {
                        this.header.name = value;
                    }).catch(() => {
                        console.error('取消修改');
                    });
                    break;
                case 'close-one':
                    this.searchMap.delete(this.searchId);
                    if (this.searchMap.size > 0) {
                        this.searchId = this.searchMap.keys().next().value
                    }
                    break;
                case 'close-other':
                    // 移除其他
                    Array.from(this.searchMap.keys()).forEach(e => {
                        if (e !== this.searchId) {
                            this.searchMap.delete(e);
                        }
                    })
                    break;
                case 'close-all':
                    this.searchMap.clear();
                    break;
                case 'cancel':
                    this.header.relationId = undefined;
                    break;

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
        openDownload() {
            this.download = buildDefaultDownload(this.current.index + '.json', true);
        },
        clickDownload() {
            exportBuild(this.download, this.current)
                .then(() => MessageUtil.success("导出成功"))
                .catch((e: any) => MessageUtil.error("导出失败", e))
                .finally(() => this.download.dialog = false);
        },
        execCopy() {
            (this.$refs['baseSearchDataView'] as any).execCopy()
        }
    }
});
</script>

<style lang="less"></style>