<template>
    <div id="data-browse">
        <div class="option">
            <div class="left">
                <div class="item" :class="page === 1 ? 'disable' : ''" @click="toFirst">
                    <i class="vxe-icon-arrow-double-left" />
                </div>
                <div class="item" :class="page === 1 ? 'disable' : ''" @click="prePage">
                    <i class="vxe-icon-arrow-left" />
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
                    <i class="vxe-icon-arrow-right" />
                </div>
                <div class="item" :class="page * size > count ? 'disable' : ''" @click="toLast">
                    <i class="vxe-icon-arrow-double-right" />
                </div>
                <div class="sep"></div>
                <div class="item" :class="!index ? 'disable' : ''" @click="executeQuery(false)">
                    <i class="vxe-icon-refresh" />
                </div>
                <div class="sep"></div>
                <div class="item" :class="!index ? 'disable' : ''">
                    <i class="vxe-icon-add" />
                </div>
                <div class="item" :class="deleteRowIndies.size === 0 ? 'disable' : ''">
                    <i class="vxe-icon-minus" />
                </div>
                <div class="item" :class="!index ? 'disable' : ''">
                    <i class="vxe-icon-indicator" />
                </div>
                <div class="item" :class="deleteRowIndies.size === 0 ? 'disable' : ''" style="font-size: 14px">
                    <i class="vxe-icon-eye-fill" />
                </div>
                <div class="item" :class="deleteRowIndies.size === 0 ? 'disable' : ''">
                    <i class="vxe-icon-save" />
                </div>
            </div>
            <div class="right">
                <vxe-pulldown destroy-on-close v-model="indexVisible" class="data-browser-pulldown">
                    <template #default>
                        <div class="item" style="display: flex;" @click="indexVisible = !indexVisible;">
                            <div v-if="!index">未选择索引</div>
                            <div v-else>{{ index.name }}</div>
                            <el-icon :size="20" style="margin: 2px;">
                                <arrow-up v-if="indexVisible" />
                                <arrow-down v-else />
                            </el-icon>
                        </div>
                    </template>
                    <template #dropdown>
                        <el-empty v-if="indicesShow.length === 0" description="请选择链接" />
                        <el-scrollbar v-else height="400px" style="width: 300px">
                            <div v-for="index in indicesShow" :command="index.name" class="data-browse-list-item"
                                @click="indexChange(index)">
                                <span>{{ index.name }}</span>
                                <span v-if="index.alias && index.alias.length > 0">
                                    <el-tag v-for="alias in index.alias">{{ alias }}</el-tag>
                                </span>
                            </div>
                        </el-scrollbar>
                    </template>
                </vxe-pulldown>
                <div class="item">
                    <i class="vxe-icon-print" />
                </div>
                <div class="item">
                    <i class="vxe-icon-eye-fill" />
                </div>
                <div class="item">
                    <el-icon>
                        <Operation />
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="condition"></div>
        <div class="content">
            <vxe-table border height="100%" class="es-scrollbar" empty-text="请选择索引" :data="records" :loading="loading"
                :column-config="columnConfig" :row-config="rowConfig" @current-change="currentChange"
                :cell-class-name="cellClassName" :header-cell-class-name="() => ('rain-table-panel-header')"
                :sort-config="sortConfig" @sort-change="sortChange" @checkbox-all="checkboxAll"
                @checkbox-change="checkboxChange">
                <vxe-column type="seq" width="40" fixed="left"></vxe-column>
                <vxe-column type="checkbox" width="60"></vxe-column>
                <vxe-column type="expand" width="80">
                    <template #content="{ row, rowIndex }">
                        <json-viewer :value="row._source" :expand-depth="4" copyable sort :expanded="true"
                            :preview-mode="true"></json-viewer>
                    </template>
                </vxe-column>
                <vxe-column v-for="header of headers" :key="header.id" :field="header.field" :title="header.field"
                    :width="header.minWidth" :title-prefix="header.help" show-overflow="tooltip" sortable
                    :formatter="format" />
            </vxe-table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'pinia';
import { ElMessage, ElMessageBox } from "element-plus";
import JsonViewer from 'vue-json-viewer';

import { VxeTablePropTypes, VxeColumnPropTypes, VxeTableDefines, VxeTableEvents } from 'vxe-table'
import XEUtils from 'xe-utils';

import { ArrowDown, ArrowUp, Operation, Download, View, Check } from "@element-plus/icons-vue";

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";

import Index from "@/view/Index";
import Header from "@/view/Header";

import IndexApi from "@/api/IndexApi";

import conditionBuild from './ConditionBuild';
import recordBuild from './RecordBuild';



export default defineComponent({
    name: 'data-browse',
    components: {
        ArrowDown, ArrowUp, Operation, Download, View, Check, JsonViewer
    },
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
        }
    },
    data: () => ({
        page: 1,
        size: useSettingStore().getPageSize,
        count: 1,
        index: undefined as Index | undefined,

        // 下拉面板
        indexVisible: false,

        // 查询条件
        where: '',
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
        deleteRowIndies: new Set<number>(),

        // vxe表格相关配置
        loading: false,
        tableTooltipConfig: {
            showAll: true,
            enterable: true,
            contentMethod: ({ type, column, row, items, _columnIndex }) => {
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
        }
    }),
    methods: {
        executeQuery(renderHeader: boolean = true) {
            if (!this.index) {
                return;
            }
            this.loading = true;
            IndexApi._search(
                this.index?.name,
                conditionBuild(this.where, this.orderBy, this.page, this.size)
            ).then(result => {
                this.result = result;
                let { headers, records, count } = recordBuild(result, this.index!);
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
                let items = this.orderBy.split(',');
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
            this.deleteRowIndies = new Set<number>();
            param.$table.getCheckboxRecords().map(e => parseInt(e['_id'])).forEach(id => this.deleteRowIndies.add(id));
        },
        checkboxChange(param: VxeTableDefines.CheckboxChangeEventParams) {
            this.deleteRowIndies = new Set<number>();
            param.$table.getCheckboxRecords().map(e => parseInt(e['_id'])).forEach(id => this.deleteRowIndies.add(id));
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
                        .then(({ value }) => {
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

        // 右侧
        indexChange(index: Index) {
            console.log(index)
            this.index = index;
            this.indexVisible = false;
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.executeQuery();
        }
        // <----------------------------------------- 上面按钮 -----------------------------------------<
    }
});
</script>
<style lang="less">
#data-browse {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid #e4e7ed;

    .option {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 25px;
        border-bottom: 1px solid #e4e7ed;
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;
        }

        .right {
            display: flex;
        }


        .item {
            padding: 1px 5px;
            line-height: 23px !important;
            cursor: pointer;

            &:hover {
                border: 1px solid #f2f2f2;
                padding: 0 4px;
            }

            &.disable {
                color: #f2f2f2;

                &:hover {
                    border: 1px solid #ffffff;
                }
            }
        }

    }

    .condition {
        position: absolute;
        top: 26px;
        left: 0;
        right: 0;
        height: 30px;
        border-bottom: 1px solid #e4e7ed;
    }

    .content {
        position: absolute;
        top: 55px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}

.data-browse-list-item {
    width: 374px;
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
    overflow: hidden;

    &:hover {
        background-color: #f2f2f2;
    }
}

// 下拉列表
.data-browser-pulldown {
    .vxe-pulldown--panel {
        left: -120px;
    }
}

/*滚动条整体部分*/
.es-scrollbar ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

/*滚动条的轨道*/
.es-scrollbar ::-webkit-scrollbar-track {
    background-color: #FFFFFF;
}

/*滚动条里面的小方块，能向上向下移动*/
.es-scrollbar ::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    border-radius: 5px;
    border: 1px solid #F1F1F1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
}

.es-scrollbar ::-webkit-scrollbar-thumb:hover {
    background-color: #A8A8A8;
}

.es-scrollbar ::-webkit-scrollbar-thumb:active {
    background-color: #787878;
}

/*边角，即两个滚动条的交汇处*/
.es-scrollbar ::-webkit-scrollbar-corner {
    background-color: #FFFFFF;
}
</style>