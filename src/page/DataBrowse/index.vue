<template>
    <div id="data-browse">
        <!-- 顶部按钮 -->
        <div class="option">
            <!-- 左侧条件 -->
            <div class="left">
                <page-help :total="total" v-model:size="size" v-model:page="page"
                           @page-update="executeQuery(false)"/>
                <div class="sep"></div>
                <db-simple-item :disable="!index" :tip="$t('common.operation.refresh')" @click="executeQuery(false)">
                    <icon-refresh/>
                </db-simple-item>
                <div class="sep"></div>
                <db-simple-item :disable="!index" :tip="$t('common.operation.add')" @click="recordAdd">
                    <icon-plus/>
                </db-simple-item>
                <db-simple-item :disable="selectedKeys.length === 0" :tip="$t('common.operation.delete')"
                                @click="recordReduce">
                    <icon-minus/>
                </db-simple-item>
                <db-simple-item :disable="selectedKeys.length !== 1" :tip="$t('common.operation.update')"
                                @click="recordEdit">
                    <icon-edit/>
                </db-simple-item>
            </div>
            <!-- 右侧条件 -->
            <div class="right">
                <!-- 选择索引 -->
                <db-index-select @index-change="indexChange"/>
                <!-- 打印 -->
                <db-simple-item :disable="!index" tip="打印" @click="openExportDialog">
                    <icon-printer/>
                </db-simple-item>
                <!-- 索引结构 -->
                <db-simple-item :disable="!index" tip="索引结构" @click="openMappingDrawer">
                    <icon-nav/>
                </db-simple-item>
                <!-- 跳转到基础查询 -->
                <db-simple-item :disable="!index" tip="跳转到 基础查询" @click="jumpToBaseSearch">
                    <icon-search/>
                </db-simple-item>
                <!-- 跳转到高级查询 -->
                <db-simple-item :disable="!index" tip="跳转到 高级查询" @click="jumpToSeniorSearch">
                    <icon-filter/>
                </db-simple-item>
                <!-- 筛选 -->
                <a-trigger trigger="click" :unmount-on-close="false" :popup-translate="[-85, 3]">
                    <div class="item">
                        <icon-select-all/>
                    </div>
                    <template #content>
                        <div class="table-view-trigger">
                            <a-list style="width: 250px">
                                <template #header>
                                    <a-button type="primary" size="small" @click="resetColumn">重置</a-button>
                                </template>
                                <a-scrollbar style="height: 341px;overflow: auto;">
                                    <a-checkbox-group v-model="checkItems" @change="handleChange">
                                        <a-list-item v-for="column in columns" style="width: 250px;margin: 5px 3px;">
                                            <a-checkbox :value="column.dataIndex">{{ column.title }}</a-checkbox>
                                        </a-list-item>
                                    </a-checkbox-group>
                                </a-scrollbar>
                            </a-list>
                        </div>
                    </template>
                </a-trigger>
                <!-- 操作 -->
                <a-dropdown trigger="click">
                    <div class="item">
                        <icon-more-vertical/>
                    </div>
                    <template #content>
                        <a-doption>
                            <a-link href="https://www.yuque.com/baozhiyige-tewwf/ygxv4r/fcqkthtec4u90hgz"
                                    target="_blank">帮助
                            </a-link>
                        </a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <!-- 输入条件 -->
        <db-condition v-model:must-value="must" v-model:should-value="should"
                      v-model:must-not-value="mustNot"
                      v-model:order-by-value="orderBy" @executeQuery="executeQuery(false)"/>
        <!-- 数据表格 -->
        <div class="content-table">
            <a-table :columns="showColumns" :data="records" :expandable="expandable" hoverable column-resizable
                     scrollbar v-model:selectedKeys="selectedKeys" :scroll="scroll" :loading="loading"
                     :pagination="false" row-key="_id" :bordered="bordered" :row-selection="rowSelection" :id="id">
                <template #empty>
                    <div class="data-browse-empty">{{ emptyText }}</div>
                </template>
            </a-table>
        </div>
        <!-- 导出弹窗 -->
        <export-dialog v-model="exportDialog" :index-name="indexName" :records="records"
                       :result="result"/>
        <!-- 新增对话框 -->
        <a-modal v-model:visible="addConfig.dialog" :title="`在【${indexName}】中新增数据`" width="800px"
                 height="520px"
                 draggable>
            <!-- @ts-ignore -->
            <codemirror v-model="addConfig.data" placeholder="请在这里输入查询条件" :style="{ height: '400px' }"
                        :autofocus="true"
                        :indent-with-tab="true" :tabSize="4" :extensions="extensions"/>
            <template #footer>
                <a-button type="text" @click="jumpToSeniorSearchByInsert">跳转到高级查询</a-button>
                <a-button @click="addConfig.dialog = false">取消</a-button>
                <a-button type="primary" @click="recordAddClick">新增</a-button>
            </template>
        </a-modal>
        <!-- 修改对话框 -->
        <a-modal v-model:visible="editConfig.dialog" :title="`在【${indexName}】中修改【${editConfig.id}】数据`"
                 :resize="true"
                 width="800px" height="520px" draggable>
            <!-- @ts-ignore -->
            <codemirror v-model="editConfig.data" placeholder="请在这里输入查询条件" :style="{ height: '400px' }"
                        :autofocus="true"
                        :indent-with-tab="true" :tabSize="4" :extensions="extensions"/>
            <template #footer>
                <a-button type="text" @click="jumpToSeniorSearchByUpdate">跳转到高级查询</a-button>
                <a-button @click="editConfig.dialog = false">取消</a-button>
                <a-button type="primary" @click="recordEditClick">修改</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts">
import {defineComponent, h, markRaw} from "vue";
import {mapState} from 'pinia';
import {Codemirror} from 'vue-codemirror';
import {json} from '@codemirror/lang-json';
import XEUtils from 'xe-utils';

import useIndexStore from "@/store/IndexStore";
import useUrlStore from "@/store/UrlStore";

import IndexView from "@/view/index/IndexView";

import MessageEventEnum from "@/enumeration/MessageEventEnum";

import ArrayUtil from "@/utils/ArrayUtil";
import MessageUtil from "@/utils/MessageUtil";
import BrowserUtil from "@/utils/BrowserUtil";

import PageHelp from "@/page/DataBrowse/component/PageHelp.vue";
import ExportDialog from "@/page/DataBrowse/component/ExportDialog.vue";
import DbCondition from "@/page/DataBrowse/component/DbCondition.vue";
import DbIndexSelect from "@/page/DataBrowse/component/DbIndexSelect.vue";
import DbSimpleItem from "@/page/DataBrowse/component/DbSimpleItem.vue";
import DataBuild from "@/page/DataBrowse/build/DataBuild";
import '@/page/DataBrowse/index.less';

import mitt from "@/plugins/mitt";
import {
    isDark,
} from "@/global/BeanFactory";
import StructureIcon from "@/icon/StructureIcon.vue";

import JsonView from "@/components/JsonView/index.vue";
import {TableBorder, TableData, TableExpandable} from "@arco-design/web-vue";
import DataBrowseComponent from "@/page/DataBrowse/component/DataBrowseComponent";
import Sortable from "sortablejs";
import {TableRowSelection} from "@arco-design/web-vue/es/table/interface";

let sort: Sortable | undefined;

export default defineComponent({
    name: 'data-browse',
    components: {
        DbSimpleItem,
        DbIndexSelect,
        DbCondition,
        ExportDialog,
        PageHelp,
        JsonView,
        StructureIcon,
        Codemirror
    },
    data: () => {
        const dataBrowseComponent = new DataBrowseComponent();
        return {
            isDark,
            dataBrowseComponent: markRaw(dataBrowseComponent),
            id: dataBrowseComponent.id,

            loading: dataBrowseComponent.loading,

            page: dataBrowseComponent.page,
            size: dataBrowseComponent.size,
            total: dataBrowseComponent.total,
            index: dataBrowseComponent.index,

            // 弹窗
            exportDialog: false,

            // 查询条件
            must: dataBrowseComponent.must,
            should: dataBrowseComponent.should,
            mustNot: dataBrowseComponent.mustNot,
            orderBy: dataBrowseComponent.orderBy,

            // 展示数据
            columns: dataBrowseComponent.columns,
            showColumns: dataBrowseComponent.showColumns,
            checkItems: dataBrowseComponent.checkItems,
            result: dataBrowseComponent.result,
            records: dataBrowseComponent.records,
            selectedKeys: dataBrowseComponent.selectedKeys,

            // 配置
            expandable: {
                title: '源数据',
                width: 80,
                expandedRowRender: (record: TableData) => {
                    return h(JsonView, {
                        data: record['_source']
                    });
                }
            } as TableExpandable,
            bordered: {wrapper: true, cell: true} as TableBorder,
            scroll: {
                x: '100%',
                y: '100%'
            },
            rowSelection: {
                type: 'checkbox',
                showCheckedAll: true,
                onlyCurrent: false,
            } as TableRowSelection,

            // 对话框
            addConfig: {
                dialog: false,
                data: ''
            },
            editConfig: {
                dialog: false,
                id: '',
                data: ''
            },
            extensions: [json()] as Array<any>
        }
    },
    computed: {
        ...mapState(useIndexStore, ['indices', 'indicesMap']),
        ...mapState(useUrlStore, ['url']),
        recordMap() {
            return ArrayUtil.map<any, string, '_id'>(this.records, '_id');
        },
        emptyText() {
            if (!this.url) {
                return '请先选择链接'
            }
            if (!this.index) {
                return '请在右上角选择索引'
            }
            return '什么也没有';
        },
        indexName(): string {
            return this.index ? this.index.name : '';
        }
    },
    created() {
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            this.dataBrowseComponent.clean();
            this.addConfig.dialog = false;
        });
    },
    methods: {
        // >----------------------------------- 表格事件 ---------------------------------->
        format(column: Date): string {
            return XEUtils.toDateString(column, 'yyyy-MM-dd HH:ss:mm')
        },
        executeQuery(renderHeader: boolean) {
            this.dataBrowseComponent.executeQuery(renderHeader)
                .then(() => {
                    this.$nextTick(() => {
                        this.addSortable();
                    })
                });
        },
        // <----------------------------------- 表格事件 ----------------------------------<

        // >----------------------------------- 上面按钮 ---------------------------------->
        // 左侧
        recordAdd() {
            if (!this.index) {
                return;
            }
            this.addConfig = {
                dialog: true,
                data: DataBuild(this.index.mapping)
            }
        },
        recordAddClick() {
            this.dataBrowseComponent.add(this.addConfig.data)
                .then(() => this.addConfig.dialog = false);
        },
        recordReduce(deleteRowIndies?: Array<string>) {
            this.dataBrowseComponent.reduce(deleteRowIndies)
        },
        recordEdit(_id?: string) {
            if (!this.index) {
                MessageUtil.error('请选择索引');
                return;
            }
            let record;
            if (this.selectedKeys.length !== 1) {
                if (_id) {
                    record = this.recordMap.get(_id);
                    if (!record) {
                        return;
                    }
                } else {
                    return;
                }
            } else {
                record = this.recordMap.get(this.selectedKeys[0]);
            }
            console.log(record)
            this.editConfig = {
                dialog: true,
                id: record['_id'],
                data: JSON.stringify(record['_source']['_source'], null, 4)
            }
        },
        recordEditClick() {
            this.dataBrowseComponent.update(this.editConfig.id, this.editConfig.data)
                .then(() => {
                    this.editConfig.dialog = false;
                })
        },

        // 右侧
        indexChange(index: IndexView) {
            this.dataBrowseComponent.indexChange(index)
                .then(() => this.addSortable());
        },
        openMappingDrawer() {
            this.dataBrowseComponent.openMappingDrawer();
        },
        jumpToBaseSearch() {
            this.dataBrowseComponent.jumpToBaseSearch();
        },
        jumpToSeniorSearch() {
            this.dataBrowseComponent.jumpToSeniorSearch();
        },
        openExportDialog() {
            // 选择了索引
            if (!this.index) {
                MessageUtil.error('请选择索引');
                return;
            }
            // 有记录
            if (this.records.length === 0) {
                MessageUtil.warning('数据为空');
                return;
            }
            this.exportDialog = true;
        },
        // <----------------------------------------- 上面按钮 -----------------------------------------<

        // >----------------------------------------- 功能 ----------------------------------------->
        copy: (value: any) => BrowserUtil.copy(JSON.stringify(value, null, 4)),
        jumpToSeniorSearchByInsert() {
            this.dataBrowseComponent.jumpToSeniorSearchByInsert(this.addConfig.data)
                .then(() => {
                    this.addConfig.dialog = false;
                });
        },
        jumpToSeniorSearchByUpdate() {
            this.dataBrowseComponent.jumpToSeniorSearchByUpdate(this.editConfig.id, this.editConfig.data)
                .then(() => {
                    this.editConfig.dialog = false;
                });
        },
        addSortable() {
            let tableViewWrap = document.getElementById(this.id);
            if (sort) {
                sort.destroy();
            }
            const wrapperTr = tableViewWrap!.querySelector('.arco-table-tr')! as HTMLElement;
            sort = Sortable.create(wrapperTr, {
                draggable: '.arco-table-th',
                filter: '.table-view-fixed',
                swapThreshold: 1,
                animation: 150,
                delay: 0,
                onUpdate: (evt: any) => {
                    const {newIndex, oldIndex} = evt;
                    if (newIndex == oldIndex) {
                        // 没有变位置，直接返回
                        return;
                    }
                    // 表头修改
                    const newItem = wrapperTr.children[newIndex];
                    const oldItem = wrapperTr.children[oldIndex];

                    // 先删除移动的节点
                    wrapperTr.removeChild(newItem)
                    // 再插入移动的节点到原有节点，还原了移动的操作
                    if (newIndex > oldIndex) {
                        wrapperTr.insertBefore(newItem, oldItem)
                    } else {
                        wrapperTr.insertBefore(newItem, oldItem.nextSibling)
                    }
                    // 列变化
                    this.$nextTick(() => {
                        // 变化列
                        const currRow = this.columns.splice(oldIndex - 2, 1)[0];
                        this.columns.splice(newIndex - 2, 0, currRow);
                    });
                }
            });
        },
        resetColumn() {
            this.dataBrowseComponent.resetColumn();
        },
        handleChange(values: any[]) {
            this.dataBrowseComponent.handleChange(values);
        },
    }
});
</script>
<style lang="less"></style>