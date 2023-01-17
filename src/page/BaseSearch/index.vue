<template>
    <div class="base-search">
        <!-- 标签页 -->
        <transition name="el-zoom-in-top">
            <div class="base-search-tab" v-show="showTabs">
                <tab-menu v-model="searchId" v-model:search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                          @option-tab="optionTab"/>
            </div>
        </transition>
        <transition name="el-zoom-in-top">
            <!-- 主要显示区域 -->
            <div class="base-search-main" v-loading="loading" element-loading-text="查询中"
                 :class="showTabs ? '' : 'full-screen'">
                <!-- 顶部菜单栏 -->
                <div class="base-option el-card es-card">
                    <div class="left">
                        <el-select-v2 v-model="current.index" filterable :options="indices"
                                      :placeholder="$t('base_search.please_select')" clearable style="width: 360px;">
                            <template #default="{ item }">
                                <div style="font-size: var(--el-font-size-base);">{{ item.name }}</div>
                            </template>
                        </el-select-v2>
                        <!-- 搜索 -->
                        <el-button type="success" style="margin-left: 12px" @click="search">{{
                                $t('base_search.search')
                            }}
                        </el-button>
                        <!-- 清空 -->
                        <el-button type="danger" @click="clear(true)">{{
                                $t('base_search.clear')
                            }}
                        </el-button>
                        <el-button @click="historyDialog = true">历史</el-button>
                    </div>
                    <div class="right">
                        <el-select v-model="view">
                            <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                            <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
                        </el-select>
                        <el-button type="info" :icon="fullScreenIcon" style="margin-left: 12px;"
                                   @click="showTabs = !showTabs"/>
                    </div>
                </div>
                <!-- 核心查询区 -->
                <div class="base-display">
                    <el-scrollbar @scroll="onScroll" ref="baseDisplay">
                        <!-- 查询条件 -->
                        <div class="base-condition" ref="baseCondition"
                             :class="paginationFixed ? 'pagination-fixed-show' : ''">
                            <el-form label-position="top" label-width="80px" style="overflow: auto">
                                <!-- 条件 -->
                                <el-form-item :label="$t('base_search.condition')" style="min-width: 1100px">
                                    <field-condition-container v-model="current.conditions" :fields="fields"/>
                                </el-form-item>
                                <!-- 排序 -->
                                <el-form-item :label="$t('base_search.order')">
                                    <field-order-container v-model="current.orders" :fields="fields"/>
                                </el-form-item>
                                <div ref="pagination">
                                    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                                                   :total="current.total"
                                                   v-model:current-page="page"
                                                   v-model:page-size="size"></el-pagination>
                                </div>
                            </el-form>
                        </div>
                        <!-- 查询结果 -->
                        <div class="base-content" ref="baseContent">
                            <data-view :view="view" :result="current.result"/>
                        </div>
                    </el-scrollbar>
                    <el-backtop :right="40" :bottom="60" target=".base-display .el-scrollbar__wrap" v-show="showTop"/>
                    <div class="pagination-fixed-none" :class="paginationFixed ? 'pagination-fixed-show' : ''">
                        <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                                       :total="current.total"
                                       v-model:current-page="page"
                                       v-model:page-size="size"></el-pagination>
                    </div>
                    <div class="base-search-condition-sentence">
                        <el-button link type="primary" @click="showBody">
                            {{ $t('base_search.display_query_statement') }}
                        </el-button>
                        <el-button link type="primary" @click="jumpToSeniorSearch">跳转到高级查询</el-button>
                    </div>
                </div>
            </div>
        </transition>
        <el-dialog :title="$t('base_search.query_criteria')" v-model="condition.dialog" width="70%" append-to-body
                   class="es-dialog" :close-on-click-modal="false">
            <json-view :data="condition.data"/>
        </el-dialog>
        <bsh-manage v-model="historyDialog"/>
    </div>
</template>

<script lang="ts">
import {defineComponent, markRaw, toRaw} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {mapState} from "pinia";
import {Bottom, FullScreen} from "@element-plus/icons-vue";

import TableViewer from "@/components/TableViewer/index.vue"
import DataView from "@/components/DataView/index.vue";
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";

import IndexApi from "@/api/IndexApi";

import mitt from '@/plugins/mitt';
import emitter from '@/plugins/mitt';

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";

import BaseQuery from '@/domain/BaseQuery';
import BaseOrder from "@/domain/BaseOrder";

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

interface Name {
    name: string;
    fields: Array<Field>;
    label: string;
    value: string;
}

// 最后一次执行时间
let lastExecuteTime = 0
let executorId = -1;

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

            // 图标
            fullScreenIcon: markRaw(FullScreen),
            bottomIcon: markRaw(Bottom),

            // 视图
            view: useSettingStore().getDefaultViewer,
            showTop: true,
            showTabs: useSettingStore().getShowTab,
            paginationFixed: false
        };
    },
    computed: {
        // 索引
        ...mapState(useIndexStore, {
            indices: (state) => {
                let names = new Array<Name>();
                let indices = state.indices;
                indices.forEach(e => {
                    names.push({
                        name: e.name,
                        fields: e.fields,
                        label: e.name,
                        value: e.name
                    });
                    e.alias.forEach(a => names.push({
                        name: a,
                        fields: e.fields,
                        label: e.name,
                        value: a
                    }))
                });
                return names.sort((a, b) => {
                    return a.name.localeCompare(b.name, "zh-CN");
                });
            }
        }),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        },
    },
    watch: {
        size() {
            this.search();
            this.sync();
        },
        page() {
            this.search();
            this.sync();
        },
        current: {
            handler() {
                // 同步要有限度
                let now = new Date().getTime();
                if (now - lastExecuteTime < 500) {
                    // 清除执行器
                    clearTimeout(executorId);
                    // 设置500ms延迟执行
                    executorId = setTimeout(() => {
                        this.sync();
                    }, 500) as unknown as number;
                }else {
                    // 设置500ms延迟执行
                    executorId = setTimeout(() => {
                        this.sync();
                    }, 500) as unknown as number;
                }
                lastExecuteTime = now;
                // 重置字段
                this.fields = useIndexStore().field(this.current.index);
            },
            deep: true
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
                    index: event.index,
                    conditions: event.conditions,
                    orders: event.orders,
                    page: 1,
                    size: useSettingStore().getPageSize,
                    total: 0,
                    result: {}
                }
            } as BaseSearchItem
            this.searchMap.set(searchId, searchItem);
            this.searchId = searchId;

            // 因为延迟问题，预先设置值
            this.current = {
                // 选择的索引名称
                index: searchItem.body.index,
                // 条件
                conditions: searchItem.body.conditions,
                orders: searchItem.body.orders,
                // 查询结果
                total: searchItem.body.total,
                result: searchItem.body.result,
            };
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
        sync() {
            this.searchMap.set(this.searchId, {
                header: {
                    id: this.searchId,
                    name: Optional.ofNullable(this.searchMap.get(this.searchId)).map(e => e.header).map(e => e.name).orElse("基础查询"),
                    relationId: Optional.ofNullable(this.searchMap.get(this.searchId)).map(e => e.header).map(e => e.relationId).get()
                },
                body: {
                    index: this.current.index,
                    conditions: this.current.conditions,
                    orders: this.current.orders,
                    page: this.page,
                    size: this.size,
                    total: this.current.total,
                    result: this.current.result
                }
            });
        },
        search() {
            if (this.current.index.length === 0) {
                ElMessageBox.alert(this.$t('base_search.please_select_an_index'));
                return;
            }
            this.loading = true;
            IndexApi._search(
                this.current.index,
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
                    index: this.current.index,
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
                    ElMessageBox.prompt("请输入新的标签名字", "修改标签名", {
                        confirmButtonText: '修改',
                        cancelButtonText: '取消',
                        inputValue: strings[2],
                        inputPattern: /.+/,
                        inputErrorMessage: '必须输入标签名'
                    }).then(({value}) => {
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
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '标签未找到'
                        });
                        return;
                    }
                    // 保存到历史
                    baseSearchHistoryService.save({
                        urlId: Optional.ofNullable(useUrlStore().id).orElse(0),
                        name: searchItem.header.name,
                        index: searchItem.body.index,
                        conditions: toRaw(searchItem.body.conditions),
                        orders: toRaw(searchItem.body.orders)
                    }).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '新增成功'
                        });
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '新增失败，' + e
                        });

                    });
                    break;
                case 'update-history':
                    let searchItem2 = this.searchMap.get(id);
                    if (!searchItem2) {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '标签未找到'
                        });
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
                        .then(() => {
                            ElMessage({
                                showClose: true,
                                type: 'success',
                                message: '更新成功'
                            });
                            emitter.emit(MessageEventEnum.BASE_HISTORY_UPDATE);
                        })
                        .catch(e => {
                            ElMessage({
                                showClose: true,
                                type: 'error',
                                message: '更新失败，' + e
                            });
                        });

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
        onScroll() {
            let pagination = this.$refs['pagination'] as HTMLDivElement;
            this.paginationFixed = pagination.getBoundingClientRect().top < 88.4375;
        },
    },
});
</script>

<style lang="less">

</style>