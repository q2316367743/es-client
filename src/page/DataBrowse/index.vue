<template>
    <div id="data-browse">
        <!-- 顶部按钮 -->
        <div class="option">
            <div class="left">
                <div class="item" :class="page === 1 ? 'disable' : ''" @click="toFirst">
                    <i class="vxe-icon-arrow-double-left"/>
                </div>
                <div class="item" :class="page === 1 ? 'disable' : ''" @click="prePage">
                    <i class="vxe-icon-arrow-left"/>
                </div>
                <el-dropdown trigger="click" @command="pageSizeChange">
                    <div class="item" style="font-size: 12px;line-height: 20px;">
                        {{ (page - 1) * size }} - {{ (Math.min(page * size, count)) }}
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="1">10</el-dropdown-item>
                            <el-dropdown-item command="2">100</el-dropdown-item>
                            <el-dropdown-item command="3">250</el-dropdown-item>
                            <el-dropdown-item command="4">500</el-dropdown-item>
                            <el-dropdown-item command="5">1,000</el-dropdown-item>
                            <el-dropdown-item command="6">自定义</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="item" style="font-size: 12px">
                    / {{ count }}
                </div>
                <div class="item" :class="page * size > count ? 'disable' : ''" @click="nextPage">
                    <i class="vxe-icon-arrow-right"/>
                </div>
                <div class="item" :class="page * size > count ? 'disable' : ''" @click="toLast">
                    <i class="vxe-icon-arrow-double-right"/>
                </div>
                <div class="sep"></div>
                <div class="item" :class="!index ? 'disable' : ''" @click="executeQuery(false)">
                    <i class="vxe-icon-refresh"/>
                </div>
                <div class="sep"></div>
                <div class="item" :class="!index ? 'disable' : ''" @click="recordAdd">
                    <i class="vxe-icon-add"/>
                </div>
                <div class="item" :class="deleteRowIndies.size === 0 ? 'disable' : ''" @click="recordReduce">
                    <i class="vxe-icon-minus"/>
                </div>
                <div class="item" :class="deleteRowIndies.size === 1 ? '' : 'disable'" @click="recordEdit">
                    <i class="vxe-icon-edit"/>
                </div>
            </div>
            <div class="right">
                <vxe-pulldown destroy-on-close v-model="indexVisible" class="data-browse-pull-down">
                    <div class="item" style="display: flex;" @click="indexVisible = !indexVisible;">
                        <div v-if="!index">未选择索引</div>
                        <div v-else>{{ index.name }}</div>
                        <el-icon :size="20" style="margin: 2px;">
                            <arrow-up v-if="indexVisible"/>
                            <arrow-down v-else/>
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-empty v-if="indicesShow.length === 0" description="请选择链接"/>
                        <el-scrollbar v-else height="400px" style="width: 400px">
                            <div v-for="index in indicesShow" class="data-browse-list-item"
                                 @click="indexChange(index)">
                                <span>{{ index.name }}</span>
                                <span v-if="index.alias && index.alias.length > 0">
                                    <el-tag v-for="alias in index.alias">{{ alias }}</el-tag>
                                </span>
                            </div>
                        </el-scrollbar>
                    </template>
                </vxe-pulldown>
                <div class="item" @click="openExportDialog">
                    <i class="vxe-icon-print"/>
                </div>
                <div class="item">
                    <i class="vxe-icon-eye-fill"/>
                </div>
                <el-dropdown trigger="click">
                    <div class="item">
                        <el-icon>
                            <Operation/>
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-link href="https://docs.esion.xyz/project-1/doc-2/" target="_blank">帮助</el-link>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <!-- 输入条件 -->
        <div class="condition">
            <div class="condition-item">
                <div :class="must === '' ? 'disable' : ''" class="key">MUST</div>
                <input type="text" v-model="must" class="input" @keydown.enter="executeQuery(false)"/>
                <div class="clear" @click="must = '';executeQuery(false);">
                    <el-icon>
                        <circle-close/>
                    </el-icon>
                </div>
            </div>
            <div class="condition-sep"></div>
            <div class="condition-item">
                <div :class="should === '' ? 'disable' : ''" class="key">SHOULD</div>
                <input type="text" v-model="should" class="input" @keydown.enter="executeQuery(false)"/>
                <div class="clear" @click="should = '';executeQuery(false);">
                    <el-icon>
                        <circle-close/>
                    </el-icon>
                </div>
            </div>
            <div class="condition-sep"></div>
            <div class="condition-item">
                <div :class="mustNot === '' ? 'disable' : ''" class="key">MUST_NOT</div>
                <input type="text" v-model="mustNot" class="input" @keydown.enter="executeQuery(false)"/>
                <div class="clear" @click="mustNot = '';executeQuery(false);">
                    <el-icon>
                        <circle-close/>
                    </el-icon>
                </div>
            </div>
            <div class="condition-sep"></div>
            <div class="condition-item">
                <div :class="orderBy === '' ? 'disable' : ''" class="key">ORDER</div>
                <input type="text" v-model="orderBy" class="input" @keydown.enter="executeQuery(false)"/>
                <div class="clear" @click="orderBy = '';executeQuery(false);">
                    <el-icon>
                        <circle-close/>
                    </el-icon>
                </div>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="content-table">
            <vxe-table border height="100%" class="es-scrollbar" :empty-text="index ? '什么也没有' : '请选择索引'"
                       :data="records" ref="vxeTable"
                       :loading="loading"
                       :column-config="columnConfig" :row-config="rowConfig" @current-change="currentChange"
                       :cell-class-name="cellClassName" :header-cell-class-name="() => ('rain-table-panel-header')"
                       :sort-config="sortConfig" @sort-change="sortChange" @checkbox-all="checkboxAll"
                       @checkbox-change="checkboxChange">
                <vxe-column type="seq" width="50" fixed="left"></vxe-column>
                <vxe-column type="checkbox" width="60"></vxe-column>
                <vxe-column type="expand" width="80">
                    <template #content="{ row, rowIndex }">
                        <div class="data-browse-expand">
                            <json-viewer :value="row._source" :expand-depth="4" copyable sort :expanded="true"
                                         :preview-mode="true"></json-viewer>
                            <el-button type="primary" text link class="copy" @click="copy(row._source)">复制</el-button>
                        </div>
                    </template>
                </vxe-column>
                <vxe-column field="_id" title="_id" show-overflow="tooltip" width="80" sortable :formatter="format"/>
                <vxe-column field="_index" title="_index" show-overflow="tooltip" width="100" sortable
                            :formatter="format"/>
                <vxe-column field="_score" title="_score" show-overflow="tooltip" width="100" sortable
                            :formatter="format"/>
                <vxe-column v-for="header of headers" :key="header.id" :field="header.field" :title="header.field"
                            :width="header.minWidth" :title-prefix="header.help" show-overflow="tooltip" sortable
                            :formatter="format"/>
            </vxe-table>
        </div>
        <!-- 导出弹窗 -->
        <vxe-modal v-model="exportDialog" title="导出数据" :show-footer="true" :resize="true"
                   width="600px" height="400px" :draggable="true">
            <div style="display: flex;justify-content: center;align-items: center;margin-top: 40px;">
                <el-form :model="exportConfig" label-width="120px">
                    <el-form-item label="文件名">
                        <el-input v-model="exportConfig.name" style="width: 215px;"/>
                    </el-form-item>
                    <el-form-item label="保存类型">
                        <el-select v-model="exportConfig.type">
                            <el-option label="JSON数据（*.json）" :value="1"/>
                            <el-option label="网页（*.html）" :value="2" disabled/>
                            <el-option label="XML数据（*.xml）" :value="3"/>
                            <el-option label="YAML数据（*.yaml）" :value="4"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择数据">
                        <el-select v-model="exportConfig.data">
                            <el-option label="当前数据（当前页的数据）" :value="1"/>
                            <el-option label="选中数据（当前页选中的数据）" :value="2" disabled/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文件内容">
                        <el-select v-model="exportConfig.result">
                            <el-option label="表格数据" :value="1"/>
                            <el-option label="原始数据" :value="2"/>
                            <el-option label="原始结果集" :value="3" :disabled="exportConfig.type === 2"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="runExportDialog(1)" text>复制到剪切板</el-button>
                <el-button @click="exportDialog = false">取消</el-button>
                <el-button @click="runExportDialog(2)" type="success">打印</el-button>
                <el-button @click="runExportDialog(3)" type="primary">导出</el-button>
            </template>
        </vxe-modal>
        <vxe-modal v-model="addConfig.dialog" :title="`在【${index?.name}】中新增数据`" :show-footer="true" :resize="true"
                   width="800px" height="520px" :draggable="true">
            <!-- @ts-ignore -->
            <codemirror
                v-model="addConfig.data"
                placeholder="请在这里输入查询条件"
                :style="{ height: '400px' }"
                :autofocus="true"
                :indent-with-tab="true"
                :tabSize="4"
                :extensions="extensions"
            />
            <template #footer>
                <el-button @click="addConfig.dialog = false">取消</el-button>
                <el-button type="primary" @click="recordAddClick">新增</el-button>
            </template>
        </vxe-modal>
        <vxe-modal v-model="editConfig.dialog" :title="`在【${index?.name}】中修改【${editConfig.id}】数据`" :show-footer="true" :resize="true"
                   width="800px" height="520px" :draggable="true">
            <!-- @ts-ignore -->
            <codemirror
                v-model="editConfig.data"
                placeholder="请在这里输入查询条件"
                :style="{ height: '400px' }"
                :autofocus="true"
                :indent-with-tab="true"
                :tabSize="4"
                :extensions="extensions"
            />
            <template #footer>
                <el-button @click="addConfig.dialog = false">取消</el-button>
                <el-button type="primary" @click="recordEditClick">修改</el-button>
            </template>
        </vxe-modal>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from 'pinia';
import {ElMessage, ElMessageBox} from "element-plus";
import JsonViewer from 'vue-json-viewer';
import {Codemirror} from 'vue-codemirror';

import {VxeColumnPropTypes, VxeTableDefines, VxeTablePropTypes} from 'vxe-table'
import XEUtils from 'xe-utils';

import {ArrowDown, ArrowUp, Check, CircleClose, Download, Operation, View} from "@element-plus/icons-vue";

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";

import Index from "@/view/index/index";
import Header from "@/view/Header";

import IndexApi from "@/api/IndexApi";

import conditionBuild from './ConditionBuild';
import recordBuild from './RecordBuild';

import './index.less';
import ExportConfig from "./ExportConfig";
import exportData from "./ExportData";
import BrowserUtil from "@/utils/BrowserUtil";
import DataBuild from "@/page/DataBrowse/DataBuild";
import {json} from '@codemirror/lang-json';
import mitt from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'data-browse',
    components: {
        ArrowDown, ArrowUp, Operation, Download, View, Check, CircleClose, JsonViewer, Codemirror
    },
    data: () => ({
        page: 1,
        size: useSettingStore().getPageSize,
        count: 1,
        index: undefined as Index | undefined,

        // 下拉面板
        indexVisible: false,

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

        // vxe表格相关配置
        loading: false,
        tableTooltipConfig: {
            showAll: true,
            enterable: true,
            contentMethod: ({type, column, row, items, _columnIndex}) => {
                return column.title;
            }
        } as VxeTablePropTypes.TooltipConfig,
        columnConfig: {
            resizable: true
        },
        rowConfig: {
            isCurrent: true
        },
        sortConfig: {
            remote: true
        } as VxeTablePropTypes.SortConfig,
        exportConfig: {
            name: '',
            type: 1,
            data: 1,
            result: 1,
            config: 1,
            fields: new Array<string>()
        } as ExportConfig,
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
        ...mapState(useIndexStore, ['indices']),
        indicesShow() {
            if (this.indices.length === 0) {
                return new Array<Index>();
            }
            // 此处是索引排序
            return this.indices.sort((e1, e2) => {
                return e1.name.localeCompare(e2.name, 'zh');
            })
        },
        indexMap() {
            let indexMap = new Map<string, any>();
            for (let record of this.records) {
                indexMap.set(record['_id'], record);
            }
            return indexMap;
        }
    },
    watch: {
        'exportConfig.type': {
            handler(newValue) {
                // 如果变为html，则不能导出全部数据
                if (newValue === 2) {
                    if (this.exportConfig.result === 3) {
                        this.exportConfig.result = 1;
                    }
                }
            },
            immediate: true
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
            this.indexVisible = false;
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
            IndexApi._search(
                this.index?.name,
                conditionBuild(this.must, this.should, this.mustNot, this.orderBy, this.page, this.size)
            ).then(result => {
                this.result = result;
                let {headers, records, count} = recordBuild(result, this.index!);
                if (renderHeader) {
                    this.headers = headers;
                }
                this.records = records;
                this.count = count;
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '查询失败，' + e
                })
            }).finally(() => {
                this.loading = false
            })
        },
        // >----------------------------------- 表格事件 ---------------------------------->
        format(column: { cellValue: any }): VxeColumnPropTypes.Formatter {
            if (column.cellValue instanceof Date) {
                return XEUtils.toDateString(column.cellValue, 'yyyy-MM-dd HH:ss:mm')
            }
            return column.cellValue;
        },
        cellClassName(data: any) {
            // #36404f
            if (this.recordRowIndex === data.rowIndex && this.recordColumnIndex === data.columnIndex) {
                return 'rain-table-panel-active'
            }
            if (this.deleteRowIndies.has(data.rowIndex)) {
                return 'rain-table-panel-delete';
            }
            return 'rain-table-panel-column';
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
        // <----------------------------------- 表格事件 ----------------------------------<

        // >----------------------------------- 上面按钮 ---------------------------------->
        // 左侧
        toFirst() {
            if (this.page === 1) {
                return;
            }
            this.page = 1;
            this.executeQuery()
        },
        prePage() {
            if (this.page === 1) {
                return;
            }
            this.page -= 1;
            this.executeQuery()
        },
        pageSizeChange(command: string) {
            switch (command) {
                case "1":
                    this.size = 10;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "2":
                    this.size = 100;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "3":
                    this.size = 250;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "4":
                    this.size = 500;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "5":
                    this.size = 1000;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "6":
                    ElMessageBox.prompt('请输入自定义分页大小', '自定义分页', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /\d+/,
                        inputErrorMessage: '请输入正确的数字',
                    })
                        .then(({value}) => {
                            this.size = parseInt(value);
                            this.page = 1;
                            this.executeQuery();
                        })
                        .catch(() => {
                        });
                    break
            }
        },
        nextPage() {
            if (this.page * this.size > this.count) {
                return;
            }
            this.page += 1;
            this.executeQuery();
        },
        toLast() {
            this.page = Math.ceil(this.count / this.size)
            this.executeQuery();
        },
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
            IndexApi._insert(this.index.name, this.addConfig.data).then(() => {
                ElMessage({
                    showClose: true,
                    type: "success",
                    message: '新增成功'
                });
                this.addConfig.dialog = false;
                // 延迟100ms，
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.executeQuery(false);
                    }, 1000);
                })
            }).catch((e) => {
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: '新增失败，' + e
                });
            })
        },
        recordReduce() {
            if (!this.index) {
                return;
            }
            if (this.deleteRowIndies.size === 0) {
                return;
            }
            ElMessageBox.confirm("确定要删除这些索引，删除后将无法恢复！", "警告", {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = new Array<string>();
                this.deleteRowIndies.forEach(id => ids.push(id));
                IndexApi._delete_by_query(this.index?.name!, {
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
                }).then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: '删除成功'
                    });
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
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: '删除失败，' + e
                    })
                });
            });

        },
        recordEdit() {
            if (!this.index) {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '请选择索引'
                })
                return;
            }
            if (this.deleteRowIndies.size !== 1) {
                return;
            }
            let record = this.indexMap.get(this.deleteRowIndies.keys().next().value);
            this.editConfig = {
                dialog: true,
                id: record['_id'],
                data: JSON.stringify(record['_source'], null, 4)
            }
        },
        recordEditClick() {
            if (!this.index) {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '请选择索引'
                })
                return;
            }
            if (this.deleteRowIndies.size !== 1) {
                return;
            }
            IndexApi._update(this.index.name, this.editConfig.id, this.editConfig.data).then(() => {
                ElMessage({
                    showClose: true,
                    type: "success",
                    message: '修改成功'
                });
                this.editConfig.dialog = false;
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
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: '修改失败，' + e
                })
            });
        },

        // 右侧
        indexChange(index: Index) {
            this.index = index;
            this.indexVisible = false;
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.must = '';
            this.should = '';
            this.mustNot = '';
            this.executeQuery();
        },
        openExportDialog() {
            // 选择了索引
            if (!this.index) {
                ElMessage({
                    showClose: true,
                    type: "warning",
                    message: "请选择索引"
                });
                return;
            }
            // 有记录
            if (this.records.length === 0) {
                ElMessage({
                    showClose: true,
                    type: "warning",
                    message: "数据为空"
                });
                return;
            }
            this.exportConfig = {
                name: this.index ? this.index!.name : '',
                type: 1,
                data: 1,
                result: 1,
                config: 1,
                fields: new Array<string>()
            }
            this.exportDialog = true;
        },
        runExportDialog(config: number) {
            this.exportConfig.config = config;
            // 根据类型判断结果
            try {
                exportData(this.exportConfig, this.records, this.result);
                this.exportDialog = false;
                // 提示
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: config === 1 ? '成功复制到剪切板' : config === 2 ? '成功打印' : config === 3 ? '成功导出' : '成功'
                })
            } catch (e) {
                ElMessage({
                    showClose: false,
                    type: 'error',
                    message: '导出失败，' + e
                });
                console.error(e)
            }
        },
        // <----------------------------------------- 上面按钮 -----------------------------------------<

        // >----------------------------------------- 功能 ----------------------------------------->
        copy(value: any) {
            BrowserUtil.copy(JSON.stringify(value, null, 4));
            ElMessage({
                showClose: true,
                type: 'success',
                message: '复制成功'
            })
        }
    }
});
</script>
<style lang="less">

</style>