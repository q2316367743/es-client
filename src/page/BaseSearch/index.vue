<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')" class="base-spin">
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
                        <a-button type="primary" status="success" @click="search" :disabled="current.index === ''">{{
                                $t('common.operation.search')
                            }}
                        </a-button>
                        <a-button type="primary" :disabled="current.index === ''" @click="openIndexManage">管理
                        </a-button>
                        <a-button @click="historyDialog = true">{{ $t('common.operation.history') }}</a-button>
                    </div>
                    <div class="right">
                        <a-button type="primary" :disabled="current.index === ''" @click="openDownload">导出
                        </a-button>
                        <a-select v-model="view" style="margin-left: 8px;width: 120px;">
                            <a-option :label="$t('common.keyword.jsonView')" :value="2"></a-option>
                            <a-option :label="$t('common.keyword.tableView')" :value="3"></a-option>
                        </a-select>
                    </div>
                </div>
                <a-scrollbar style="height: calc(100vh - 108px);margin-top: 40px;overflow: auto;">
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
                                                  :page-size="current.size"
                                                  show-total/>
                                    <a-input-number v-model="current.size" style="width: 70px"/>
                                </div>
                            </a-form>
                        </div>
                        <!-- 查询结果 -->
                        <div class="base-content" ref="baseContent">
                            <base-search-data-view :view="view" :result="current.result"/>
                        </div>
                    </div>
                    <a-back-top target-container=".arco-scrollbar-container" v-show="showTop"/>
                </a-scrollbar>
                <div class="base-search-condition-sentence" :style="{right: view === 2 ? '20px' : '50px'}">
                    <a-button type="text" @click="showBody">
                        {{ $t('baseSearch.form.displayQueryStatement') }}
                    </a-button>
                    <a-button type="text" @click="jumpToSeniorSearch">
                        {{ $t('common.action.jumpToSeniorSearch') }}
                    </a-button>
                </div>
            </div>
            <a-modal :title="$t('baseSearch.dialog.statement')" v-model:visible="condition.dialog" width="70%"
                     render-to-body class="es-dialog" :mask-closable="false">
                <json-view :data="condition.data"/>
            </a-modal>
            <bsh-manage v-model="historyDialog"/>
            <a-modal title="导出" v-model:visible="download.dialog" width="600px" render-to-body unmount-on-close
                     :mask-closable="false" draggable ok-text="导出" @ok="clickDownload">
                <a-form :model="download" layout="vertical">
                    <a-form-item label="文件名">
                        <a-input v-model="download.name"/>
                    </a-form-item>
                    <a-form-item label="导出数量">
                        <a-select v-model="download.count">
                            <a-option label="当前页面" :value="1"/>
                            <a-option label="指定范围" :value="2"/>
                            <a-option label="全部" :value="3"/>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="范围" v-if="download.count === 2">
                        <a-input-number v-model="download.customStart" placeholder="从0开始"/>
                        <span>-</span>
                        <a-input-number v-model="download.customEnd" placeholder="-1代表不限制"/>
                    </a-form-item>
                    <a-form-item label="导出内容类型">
                        <a-select v-model="download.content">
                            <a-option label="原始结果集" :value="1"/>
                            <a-option label="只导出_source" :value="2"/>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            每次分页查询数量
                            <a-tooltip content="数量太大可能造成浏览器卡顿" placement="top" effect="light">
                                <icon-question-circle style="margin-left: 5px;"/>
                            </a-tooltip>
                        </template>
                        <a-input-number v-model="download.size" :disabled="download.count === 1"/>
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </a-spin>
</template>

<script lang="ts">
import {defineComponent, toRaw} from "vue";
import {mapState} from "pinia";
import {SelectOptionData} from "@arco-design/web-vue";

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
import '@/page/BaseSearch/index.less';
import QueryConditionBuild from '@/page/BaseSearch/component/QueryConditionBuild';
import FieldOrderContainer from "@/page/BaseSearch/FiledOrder/FieldOrderContainer.vue";
import FieldConditionContainer from "@/page/BaseSearch/FieldCondition/FieldConditionContainer.vue";
import BshManage from "@/page/BaseSearch/History/index.vue";
import ExportConfig from "@/page/BaseSearch/domain/ExportConfig";
import BaseSearchDataView from "@/page/BaseSearch/DataView/index.vue";
import {BaseSearchItem} from "@/page/BaseSearch/domain/BaseSearchItem";


import Field from "@/view/Field";

import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {
    baseSearchHistoryService,
    useBaseSearchEvent,
    useIndexManageEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import DocumentApi from "@/api/DocumentApi";
import exportBuild from "@/page/BaseSearch/component/ExportBuild";

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

// 公共方法
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

            current: searchItem.body,

            fields: new Array<Field>(),

            loading: false,
            visibility: true,

            // 条件对话框
            condition: {
                dialog: false,
                data: {}
            },
            historyDialog: false,

            download: buildDefaultDownload(''),

            // 视图
            view: useSettingStore().getDefaultViewer,
            showTop: true,
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
                    if (!names.has(e.name)) {
                        options.push({
                            label: e.name,
                            value: e.name,
                            index: e.name
                        });
                    }
                    e.alias.forEach(a => {
                        if (!names.has(a)) {
                            options.push({
                                label: a,
                                value: a,
                                index: e.name
                            })
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
                    if (index.alias) {
                        index.alias.forEach(alias => aliasIndexMap.set(alias, index.name));
                    }
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
                this.current = {
                    ...baseSearchItem.body
                }
                this.current.page = baseSearchItem.body.page;
                this.current.size = baseSearchItem.body.size;
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
                if (newValue.length > 2) {
                    let index = this.indexAliasMap.get(newValue);
                    if (index) {
                        this.fields = useIndexStore().field(index).sort((a, b) => {
                            return a.name.localeCompare(b.name, "zh-CN");
                        });
                    }
                }
                if (newValue === '') {
                    this.clear();
                }
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
                // 显示标签
                this.searchMap.set(searchId, searchItem);
                this.searchId = searchId;
            }

            // 因为延迟问题，预先设置值
            this.current = searchItem.body;
            this.$nextTick(() => {
                if (event.execute) {
                    this.search();
                }
            })
        })
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
                .catch(e => MessageUtil.error("导出失败", e))
                .finally(() => this.download.dialog = false);
        }
    }
});
</script>

<style lang="less">

</style>