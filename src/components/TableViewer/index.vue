<template>
    <div class="table-viewer" :id="id">
        <div class="table-view-toolbar">
            <a-trigger trigger="click" :unmount-on-close="false" :popup-translate="[105, 3]">
                <a-button type="outline" size="small">
                    <template #icon>
                        <icon-select-all />
                    </template>
                </a-button>
                <template #content>
                    <div class="table-view-trigger">
                        <a-list style="width: 250px">
                            <template #header>
                                <a-button type="primary" size="small" @click="resetColumn">重置</a-button>
                            </template>
                            <a-scrollbar style="height: 341px;overflow: auto;">
                                <a-checkbox-group v-model="checkItems" @change="handleChange">
                                    <a-list-item v-for="column in columns">
                                        <a-checkbox :value="column.dataIndex">{{ column.title }}</a-checkbox>
                                    </a-list-item>
                                </a-checkbox-group>
                            </a-scrollbar>
                        </a-list>
                    </div>
                </template>
            </a-trigger>
        </div>
        <div class="table-view-wrap">
            <a-table :columns="showColumns" :data="records" :expandable="expandable" hoverable column-resizable scrollbar
                sticky-header :scroll="scroll" :pagination="false" row-key="_id" :bordered="bordered" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, h, PropType } from "vue";
import { TableBorder, TableColumnData, TableData, TableExpandable } from "@arco-design/web-vue";
import Sortable from 'sortablejs';

import BrowserUtil from "@/utils/BrowserUtil";
import JsonView from "@/components/JsonView/index.vue";

function buildTableColumnData(dataIndex: string, width: number, title?: string, tooltip: boolean = false): TableColumnData {
    return {
        title: title ? title : dataIndex,
        dataIndex,
        ellipsis: true,
        tooltip,
        width,
        cellClass: 'table-view-cell'
    }
}

export default defineComponent({
    name: 'table-viewer',
    props: {
        data: Object as PropType<any>
    },
    components: { JsonView },

    data: () => {
        let now = new Date().getTime();
        return {
            records: [] as Array<TableData>,
            columns: [] as Array<TableColumnData>,
            showColumns: [] as Array<TableColumnData>,
            emptyText: '空空如也',

            id: 'table-view-' + now,

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
            bordered: { wrapper: true, cell: true } as TableBorder,
            scroll: {
                x: '100%',
                y: '100%'
            },

            // 筛选
            checkItems: new Array<string>(),
            allowUpdate: true
        }
    },
    watch: {
        data() {
            this.render();
        }
    },
    mounted() {
        this.render();
    },
    methods: {
        render() {
            // 当变化时，进行渲染
            if (!this.verify_index()) {
                this.records = []
                this.columns = [];
                this.emptyText = '数据无法解析，请使用其他视图查看'
                return;
            }
            // 数据清空
            this.records = [];
            let columnMap = new Map<string, TableColumnData>();
            // 基础对象
            columnMap.set('_id', {
                title: '_id',
                dataIndex: '_id',
                ellipsis: true,
                width: 110,
                sortable: {
                    sortDirections: ['ascend', 'descend']
                },
                cellClass: 'table-view-cell table-view-fixed'
            });
            ['_index', '_score'].forEach(key => columnMap.set(key, buildTableColumnData(key, 110)));

            // 开始渲染
            for (let item of this.data.hits.hits) {
                let record = {} as Record<string, string>;
                record['_id'] = item['_id'];
                record['_index'] = item['_index'];
                record['_score'] = item['_score'];
                let _source = item['_source'];
                this.renderObj(_source, columnMap, record, '');
                record['_source'] = item;
                this.records.push(record);
            }
            this.columns = Array.from(columnMap.values());
            let x = 0;
            this.columns.map(e => e.width).forEach(e => x += (e || 0));
            this.scroll.x = `${x}px`;
            this.showColumns = this.columns;
            this.checkItems = this.showColumns.map(column => column.dataIndex!);
            // 拖拽
            this.$nextTick(() => {
                let tableViewWrap = document.getElementById(this.id);
                console.log(tableViewWrap, tableViewWrap!.querySelector('.arco-table-tr'))
                Sortable.create(tableViewWrap!.querySelector('.arco-table-tr')!, {
                    handle: '.arco-table-th', //设置指定列作为拖拽
                    onEnd: (evt: any) => {
                        const { newIndex, oldIndex } = evt;
                        console.log(newIndex)
                        console.log(oldIndex)
                        // FIXME: 此处有问题
                        const currRow = this.showColumns.splice(oldIndex, 1)[0]
                        this.showColumns.splice(newIndex, 0, currRow)
                    }
                });
            })
        },
        renderObj(
            obj: Record<string, any>,
            columnMap: Map<string, TableColumnData>,
            record: Record<string, string>,
            prefix: string
        ) {
            for (let key in obj) {
                // 基础值
                let source = obj[key];
                let dataIndex = prefix === '' ? key : `${prefix}-${key}`;
                let title = prefix === '' ? key : `${prefix}.${key}`;
                let width = 80;
                let value = '';
                // 处理对象
                if (typeof source === 'object') {
                    // JSON转字符串
                    if (source instanceof Array) {
                        value = JSON.stringify(source);
                    } else {
                        this.renderObj(source, columnMap, record, title);
                        break;
                    }
                } else {
                    // 普通类型，直接渲染
                    value = `${source}`;
                }
                // 计算宽度
                width = Math.max(value.length * 10 + 80, title.length * 10 + 80);
                width = Math.min(width, 600);
                // 列
                let column = buildTableColumnData(dataIndex, width, title, width === 800);

                // 判断列宽度
                if (columnMap.has(dataIndex)) {
                    let temp = columnMap.get(dataIndex);
                    if (temp && temp.width && temp.width < width) {
                        // 宽度不合适，使用新的
                        columnMap.set(dataIndex, column);
                    }
                } else {
                    // 不存在列，新增
                    columnMap.set(dataIndex, column);
                }

                // 值
                record[dataIndex] = value;
            }
        },
        verify_index(): boolean {
            if (!this.data) {
                return false;
            }
            if (!this.data.hits) {
                return false;
            }
            return this.data.hits.hits;

        },
        copy(value: any) {
            BrowserUtil.copy(JSON.stringify(value, null, 4));
        },
        handleChange(values: any[]) {
            this.showColumns = this.columns.filter(column => values.includes(column.dataIndex));
            this.allowUpdate = this.showColumns.length === this.columns.length;
        },
        resetColumn() {
            this.showColumns = this.columns;
            this.checkItems = this.showColumns.map(column => column.dataIndex!);
            this.allowUpdate = true;
        }
    }
});
</script>
<style lang="less">
.table-viewer {
    height: 100%;
    width: 100%;
    position: relative;

    .table-view-toolbar {
        margin: 2px;
    }

    .table-view-wrap {
        position: absolute;
        top: 34px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}

.arco-table-container {
    height: 100%;
}

.table-view-trigger {
    width: 250px;
    height: 400px;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);
    box-shadow: 0 0 12px var(--color-border-2);
    display: flex;

    .arco-list-header {
        text-align: center;
    }
}

.table-view-cell {
    font-family: JetBrainsMono, 微软雅黑, Courier, monospace;
}
</style>