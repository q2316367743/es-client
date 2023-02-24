<template>
    <div id="data-browse">
        <!-- 顶部按钮 -->
        <div class="option">
            <!-- 左侧条件 -->
            <div class="left">
                <page-help :total="count" v-model:size="size" v-model:page="page" @page-update="executeQuery(false)" />
                <div class="sep"></div>
                <db-simple-item :disable="!index" :tip="$t('common.operation.refresh')" @click="executeQuery(false)">
                    <i class="vxe-icon-refresh" />
                </db-simple-item>
                <div class="sep"></div>
                <db-simple-item :disable="!index" :tip="$t('common.operation.add')" @click="recordAdd">
                    <i class="vxe-icon-add" />
                </db-simple-item>
                <db-simple-item :disable="deleteRowIndies.size === 0" :tip="$t('common.operation.delete')"
                    @click="recordReduce">
                    <i class="vxe-icon-minus" />
                </db-simple-item>
                <db-simple-item :disable="deleteRowIndies.size !== 1" :tip="$t('common.operation.update')"
                    @click="recordEdit">
                    <i class="vxe-icon-edit" />
                </db-simple-item>
            </div>
            <!-- 右侧条件 -->
            <div class="right">
                <!-- 选择索引 -->
                <db-index-select @index-change="indexChange" />
                <!-- 打印 -->
                <db-simple-item :disable="!index" tip="打印" @click="openExportDialog">
                    <icon-printer />
                </db-simple-item>
                <!-- 索引结构 -->
                <db-simple-item :disable="!index" tip="索引结构" @click="openMappingDrawer">
                    <icon-nav />
                </db-simple-item>
                <!-- 跳转到基础查询 -->
                <db-simple-item :disable="!index" tip="跳转到 基础查询" @click="jumpToBaseSearch">
                    <icon-search />
                </db-simple-item>
                <!-- 跳转到高级查询 -->
                <db-simple-item :disable="!index" tip="跳转到 高级查询" @click="jumpToSeniorSearch">
                    <icon-filter />
                </db-simple-item>
                <!-- 操作 -->
                <a-dropdown trigger="click">
                    <div class="item">
                        <icon-more-vertical />
                    </div>
                    <template #content>
                        <a-doption>
                            <a-link href="https://www.yuque.com/baozhiyige-tewwf/ygxv4r/fcqkthtec4u90hgz" target="_blank">帮助
                            </a-link>
                        </a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <!-- 输入条件 -->
        <db-condition v-model:must-value="must" v-model:should-value="should" v-model:must-not-value="mustNot"
            v-model:order-by-value="orderBy" @executeQuery="executeQuery(false)" />
        <!-- 数据表格 -->
        <div class="content-table">
            <vxe-table border height="100%" class="es-scrollbar" :empty-text="emptyText" :data="records" ref="vxeTable"
                :loading="loading" :menu-config="menuConfig" :column-config="columnConfig" :row-config="rowConfig"
                @current-change="currentChange" :header-cell-class-name="() => ('rain-table-panel-header')"
                :sort-config="sortConfig" @menu-click="menuClick" @sort-change="sortChange" @checkbox-all="checkboxAll"
                @checkbox-change="checkboxChange" @cell-menu="cellMenu">
                <vxe-column type="seq" width="60" fixed="left" title="序号"></vxe-column>
                <vxe-column type="checkbox" width="60"></vxe-column>
                <vxe-column type="expand" width="80" title="源">
                    <template #content="{ row, rowIndex }">
                        <div class="data-browse-expand">
                            <a-button type="text" text link class="copy" @click="copy(row._source)">复制</a-button>
                            <json-view :data="row._source" :copy="false" />
                        </div>
                    </template>
                </vxe-column>
                <vxe-column field="_id" title="_id" show-overflow="tooltip" width="80" sortable :formatter="format" />
                <vxe-column field="_index" title="_index" show-overflow="tooltip" width="100" sortable
                    :formatter="format" />
                <vxe-column field="_score" title="_score" show-overflow="tooltip" width="100" sortable
                    :formatter="format" />
                <vxe-column v-for="header of headers" :key="header.id" :field="header.field" :title="header.field"
                    :width="header.minWidth" :title-prefix="header.help" show-overflow="tooltip" sortable
                    :formatter="format" />
            </vxe-table>
        </div>
        <!-- 导出弹窗 -->
        <export-dialog v-model="exportDialog" :index-name="index ? index.name : ''" :records="records" :result="result" />
        <!-- 新增对话框 -->
        <a-modal v-model:visible="addConfig.dialog" :title="`在【${index?.name}】中新增数据`" width="800px" height="520px"
            draggable>
            <!-- @ts-ignore -->
            <codemirror v-model="addConfig.data" placeholder="请在这里输入查询条件" :style="{ height: '400px' }" :autofocus="true"
                :indent-with-tab="true" :tabSize="4" :extensions="extensions" />
            <template #footer>
                <a-button type="text" @click="jumpToSeniorSearchByInsert">跳转到高级查询</a-button>
                <a-button @click="addConfig.dialog = false">取消</a-button>
                <a-button type="primary" @click="recordAddClick">新增</a-button>
            </template>
        </a-modal>
        <!-- 修改对话框 -->
        <a-modal v-model:visible="editConfig.dialog" :title="`在【${index?.name}】中修改【${editConfig.id}】数据`" :resize="true"
            width="800px" height="520px" draggable>
            <!-- @ts-ignore -->
            <codemirror v-model="editConfig.data" placeholder="请在这里输入查询条件" :style="{ height: '400px' }" :autofocus="true"
                :indent-with-tab="true" :tabSize="4" :extensions="extensions" />
            <template #footer>
                <a-button type="text" @click="jumpToSeniorSearchByUpdate">跳转到高级查询</a-button>
                <a-button @click="editConfig.dialog = false">取消</a-button>
                <a-button type="primary" @click="recordEditClick">修改</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'pinia';
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { VxeColumnPropTypes, VxeTableDefines, VxeTablePropTypes } from 'vxe-table'
import XEUtils from 'xe-utils';

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";
import useUrlStore from "@/store/UrlStore";

import IndexView from "@/view/index/IndexView";
import Header from "@/view/Header";

import DocumentApi from "@/api/DocumentApi";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import Optional from "@/utils/Optional";
import StrUtil from "@/utils/StrUtil";
import ArrayUtil from "@/utils/ArrayUtil";
import MessageUtil from "@/utils/MessageUtil";
import BrowserUtil from "@/utils/BrowserUtil";

import PageHelp from "@/page/DataBrowse/component/PageHelp.vue";
import ExportDialog from "@/page/DataBrowse/component/ExportDialog.vue";
import DbCondition from "@/page/DataBrowse/component/DbCondition.vue";
import DbIndexSelect from "@/page/DataBrowse/component/DbIndexSelect.vue";
import DbSimpleItem from "@/page/DataBrowse/component/DbSimpleItem.vue";
import conditionBuild from '@/page/DataBrowse/build/ConditionBuild';
import recordBuild from '@/page/DataBrowse/build/RecordBuild';
import DataBuild from "@/page/DataBrowse/build/DataBuild";
import '@/page/DataBrowse/index.less';
import tool from "@/page/DataBrowse/tool";

import mitt from "@/plugins/mitt";
import {
    isDark,
    useBaseSearchEvent,
    useIndexManageEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import StructureIcon from "@/icon/StructureIcon.vue";
import BaseOrder from "@/entity/BaseOrder";

import JsonView from "@/components/JsonView/index.vue";

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
    data: () => ({
        page: 1,
        size: useSettingStore().getPageSize,
        count: 1,
        index: undefined as IndexView | undefined,
        isDark,

        // 弹窗
        exportDialog: false,

        // 查询条件
        must: '',
        should: '',
        mustNot: '',
        orderBy: '',

        // 展示数据
        headers: [] as Array<Header>,
        result: {} as any,
        records: new Array<any>(),

        //当前选中信息
        record: undefined as any | undefined,
        recordRowIndex: 0,
        recordColumnIndex: 0,
        // 删除的行索引
        deleteRowIndies: new Set<string>(),

        menuRecord: undefined as {
            field: string,
            value: string,
            data: any
        } | undefined,

        // vxe表格相关配置
        loading: false,
        columnConfig: {
            resizable: true,
            isCurrent: true
        },
        rowConfig: {
            isCurrent: true
        },
        sortConfig: {
            remote: true
        } as VxeTablePropTypes.SortConfig,

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
    }),
    computed: {
        ...mapState(useIndexStore, ['indices', 'indicesMap']),
        ...mapState(useUrlStore, ['url']),
        recordMap() {
            return ArrayUtil.map(this.records, '_id');
        },
        menuConfig(): VxeTablePropTypes.MenuConfig {
            if (!this.index) {
                let indexItems = new Array<VxeTableDefines.MenuFirstOption>();
                for (let index of this.indices) {
                    if (!StrUtil.matchAll(index.name, useSettingStore().getHomeExcludeIndices)) {
                        indexItems.push({
                            code: `index-${index.name}`,
                            name: index.name
                        })
                    }
                }
                return {
                    body: {
                        options: [indexItems]
                    }
                } as VxeTablePropTypes.MenuConfig;
            }
            return tool.renderMenu();
        },
        emptyText() {
            if (!this.url) {
                return '请先选择链接'
            }
            if (!this.index) {
                return '请在右上角选择索引'
            }
            return '什么也没有';
        }
    },
    created() {
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置条件
            this.index = undefined;
            this.must = '';
            this.should = '';
            this.mustNot = '';
            this.orderBy = '';
            this.exportDialog = false;
            this.addConfig.dialog = false;
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.count = 1;
            // 展示数据
            this.headers = [] as Array<Header>;
            this.result = {} as any;
            this.records = new Array<any>();

            //当前选中信息
            this.record = undefined as any | undefined;
            this.recordRowIndex = 0;
            this.recordColumnIndex = 0;
            // 删除的行索引
            this.deleteRowIndies = new Set<string>();

            this.loading = false;
        });
    },
    methods: {
        executeQuery(renderHeader: boolean = true) {
            if (!this.index) {
                return;
            }
            this.loading = true;
            DocumentApi(this.index.name)._search(
                conditionBuild(this.must, this.should, this.mustNot, this.orderBy, this.page, this.size)
            ).then(result => {
                this.result = result;
                let { headers, records, count } = recordBuild(result, this.index!);
                if (renderHeader) {
                    this.headers = headers;
                }
                this.records = records;
                this.count = count;
            }).catch(e => MessageUtil.error('查询失败', e))
                .finally(() => this.loading = false);
        },
        // >----------------------------------- 表格事件 ---------------------------------->
        format(column: { cellValue: any }): VxeColumnPropTypes.Formatter {
            if (column.cellValue instanceof Date) {
                return XEUtils.toDateString(column.cellValue, 'yyyy-MM-dd HH:ss:mm')
            }
            return column.cellValue;
        },
        currentChange(data: any) {
            this.record = data.row;
            this.recordRowIndex = data.rowIndex;
            this.recordColumnIndex = data.columnIndex;
        },
        sortChange(column: any) {
            // 解析orderBy语句
            if (this.orderBy === '') {
                if (column.order) {
                    this.orderBy = `${column.field} ${column.order}`
                } else {
                    this.orderBy = ''
                }
            } else {
                if (this.orderBy.includes(column.field)) {
                    // 存在排序字段
                    // 如果需要排序
                    let startIndex = this.orderBy.indexOf(column.field);
                    let tempOrderBy = this.orderBy.substring(startIndex);
                    let nextOrderByIndex = tempOrderBy.indexOf(',') > -1 ? tempOrderBy.indexOf(',') : tempOrderBy.length;
                    let endIndex = startIndex + nextOrderByIndex;
                    if (column.order) {
                        this.orderBy = this.orderBy.substring(0, startIndex) +
                            `${column.field} ${column.order}` +
                            this.orderBy.substring(endIndex, this.orderBy.length)
                    } else {
                        this.orderBy = this.orderBy.substring(0, endIndex === this.orderBy.length ? startIndex - 1 : startIndex) +
                            this.orderBy.substring(endIndex, this.orderBy.length)
                    }
                } else {
                    // 不存在，直接拼后面
                    this.orderBy = this.orderBy + `,${column.field} ${column.order}`
                }
            }
            this.executeQuery()
        },
        checkboxAll(param: VxeTableDefines.CheckboxAllEventParams) {
            this.deleteRowIndies = new Set<string>();
            param.$table.getCheckboxRecords().map(e => e['_id']).forEach(id => this.deleteRowIndies.add(id));
        },
        checkboxChange(param: VxeTableDefines.CheckboxChangeEventParams) {
            this.deleteRowIndies = new Set<string>();
            param.$table.getCheckboxRecords().map(e => e['_id']).forEach(id => this.deleteRowIndies.add(id));
        },
        menuClick(param: VxeTableDefines.MenuClickParams) {
            let code = param.menu.code!;
            // 索引特殊，先处理
            if (code.startsWith('index')) {
                // 跳转索引
                let index = this.indicesMap.get(code.substring(6));
                if (index) {
                    this.indexChange(index);
                }
                return;
            }
            // 未选择不处理
            if (!this.menuRecord) {
                MessageUtil.error('错误，无法获取选中元素')
                return;
            }
            if (code === 'copy') {
                BrowserUtil.copy(Optional.ofNullable(this.menuRecord).map(e => e['value']).orElse(""));
            } else if (code === 'add') {
                this.recordAdd();
            } else if (code === 'update') {
                this.recordEdit(this.menuRecord.data['_id'])
            } else if (code === 'delete') {
                this.recordReduce(new Set<string>([this.menuRecord.data['_id']]));
            } else if (code.startsWith('query')) {
                // 查询
                let codes = code.split('|');
                let express = `${this.menuRecord.field} ${codes[2]} '${this.menuRecord.value}'`;
                switch (codes[1]) {
                    case 'must':
                        this.must = express;
                        break;
                    case 'should':
                        this.should = express;
                        break;
                    case 'must not':
                        this.mustNot = express;
                        break;
                }
                this.executeQuery(false);
            } else if (code.startsWith('sort')) {
                // 排序
                if (code === 'sort-clear') {
                    this.orderBy = '';
                } else if (code === 'sort-asc') {
                    this.orderBy = `${this.menuRecord.field}`
                } else if (code === 'sort-desc') {
                    this.orderBy = `${this.menuRecord.field} desc`
                }
                this.executeQuery(false);
            } else {
                console.error(code)
            }
        },
        cellMenu(param: VxeTableDefines.CellMenuEventParams) {
            this.menuRecord = {
                field: param.column.field,
                value: param.cell.textContent as string,
                data: param.row
            };
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
            if (!this.index) {
                return;
            }
            DocumentApi(this.index.name)._insert(this.addConfig.data)
                .then(result => MessageUtil.success(
                    `新增成功，新数据ID【${result._id || ''}】`,
                    () => {
                        this.addConfig.dialog = false;
                        // 延迟100ms，
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.executeQuery(false);
                            }, 1000);
                        })
                    })).catch(e => MessageUtil.error('新增失败', e));
        },
        recordReduce(deleteRowIndies?: Set<string>) {
            let indices = Optional.ofNullable(deleteRowIndies)
                .orElse(this.deleteRowIndies);
            console.log(indices, this.index)
            let result = tool.recordReduce(indices, this.index);
            if (result) {
                result.then(() => {
                    // 延迟100ms，
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.executeQuery(false);
                        }, 1000);
                    });
                    // 当前选中重置
                    this.record = undefined as any | undefined;
                    this.recordRowIndex = 0;
                    this.recordColumnIndex = 0;
                    // 删除的行索引
                    this.deleteRowIndies = new Set<string>();
                    // 清除选中行
                    (this.$refs['vxeTable'] as any).clearCheckboxRow();
                }).catch(() => {
                    // 跳转到高级查询
                    let ids = new Array<string>();
                    indices.forEach(id => ids.push(id));
                    usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
                    useSeniorSearchEvent.emit({
                        link: `/${this.index?.name}/_delete_by_query`,
                        method: 'POST',
                        params: JSON.stringify({
                            query: {
                                bool: {
                                    must: [
                                        {
                                            ids: {
                                                values: ids
                                            }
                                        }
                                    ]
                                }
                            }
                        }, null, 4)
                    });
                    this.clearChoose();
                })
            }
        },
        recordEdit(_id?: string) {
            if (!this.index) {
                MessageUtil.error('请选择索引');
                return;
            }
            let record;
            if (this.deleteRowIndies.size !== 1) {
                if (_id) {
                    record = this.recordMap.get(_id);
                    if (!record) {
                        return;
                    }
                } else {
                    return;
                }
            } else {
                record = this.recordMap.get(this.deleteRowIndies.keys().next().value);
            }
            this.editConfig = {
                dialog: true,
                id: record['_id'],
                data: JSON.stringify(record['_source'], null, 4)
            }
        },
        recordEditClick() {
            if (!this.index) {
                MessageUtil.error('请选择索引');
                return;
            }
            DocumentApi(this.index.name)._update(this.editConfig.id, this.editConfig.data).then(() => {
                MessageUtil.success('修改成功');
                this.editConfig.dialog = false;
                // 延迟100ms，
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.executeQuery(false);
                    }, 1000);
                });
                // 当前选中重置
                this.clearChoose();
            }).catch(e => MessageUtil.error('修改失败', e));
        },

        // 右侧
        indexChange(index: IndexView) {
            this.index = index;
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.must = '';
            this.should = '';
            this.mustNot = '';
            this.executeQuery();
        },
        openMappingDrawer() {
            if (!this.index) {
                return;
            }
            useIndexManageEvent.emit(this.index.name);
        },
        jumpToBaseSearch() {
            if (!this.index) {
                return;
            }
            // 页面跳转
            usePageJumpEvent.emit(PageNameEnum.BASE_SEARCH);
            // 基础数据
            let orders = new Array<BaseOrder>();
            // 填充数据
            let count = 1;
            let condition = conditionBuild(this.must, this.should, this.mustNot, this.orderBy, this.page, this.size);
            // 排序
            for (let key in condition.sort) {
                orders.push({
                    id: count++,
                    field: `_doc.${key}`,
                    type: condition.sort[key].order,
                    isEnable: true
                });
            }
            useBaseSearchEvent.emit({
                execute: true,
                name: this.index.name,
                index: this.index.name,
                conditions: [],
                orders
            });
        },
        jumpToSeniorSearch() {
            if (!this.index) {
                return;
            }
            // 跳转页面
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            // 填充数据
            useSeniorSearchEvent.emit({
                name: this.index.name,
                link: `/${this.index.name}/_search`,
                method: 'POST',
                params: JSON.stringify(
                    conditionBuild(this.must, this.should, this.mustNot, this.orderBy, this.page, this.size),
                    null,
                    4)
            })
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
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            useSeniorSearchEvent.emit({
                link: `/${this.index?.name}/_doc`,
                method: 'POST',
                params: this.addConfig.data
            });
            this.addConfig.dialog = false;
            // 清除当前选中
            this.clearChoose();
        },
        jumpToSeniorSearchByUpdate() {
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            useSeniorSearchEvent.emit({
                link: `/${this.index?.name}/_doc/${this.editConfig.id}`,
                method: 'PUT',
                params: this.editConfig.data
            });
            this.editConfig.dialog = false;
            // 清除当前选中
            this.clearChoose();
        },
        clearChoose() {
            // 当前选中重置
            this.record = undefined as any | undefined;
            this.recordRowIndex = 0;
            this.recordColumnIndex = 0;
            // 删除的行索引
            this.deleteRowIndies = new Set<string>();
            // 清除选中行
            (this.$refs['vxeTable'] as any).clearCheckboxRow();
        }
    }
});
</script>
<style lang="less"></style>