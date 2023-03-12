<template>
    <div class="table-viewer" :id="id">
        <div class="table-view-toolbar">
            <a-trigger trigger="click" :unmount-on-close="false" :popup-translate="[75, 3]">
                <a-button type="outline" size="small">
                    <template #icon>
                        <icon-select-all />
                    </template>
                    {{ `${showColumns.length} / ${columns.length}` }}
                </a-button>
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
        </div>
        <div class="table-view-wrap">
            <a-table :columns="showColumns" :data="records" :expandable="expandable" hoverable column-resizable scrollbar
                :scroll="scroll" :pagination="false" row-key="_id" :bordered="bordered" :draggable="draggable" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, h, PropType } from "vue";
import { TableBorder, TableColumnData, TableData, TableDraggable, TableExpandable } from "@arco-design/web-vue";
import Sortable from 'sortablejs';

import BrowserUtil from "@/utils/BrowserUtil";
import JsonView from "@/components/JsonView/index.vue";
import { buildTableColumnData, JsonToTableBuild } from "@/build/JsonToTableBuild";
import useSettingStore from "@/store/SettingStore";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";
import useIndexStore from "@/store/IndexStore";

let sort: Sortable | undefined;

export default defineComponent({
    name: 'table-viewer',
    props: {
        data: Object as PropType<any>,
        index: {
            type: String,
            required: false,
            default: ''
        }
    },
    components: { JsonView },

    data: () => {
        let now = new Date().getTime();
        return {
            records: [] as Array<TableData>,
            columns: [] as Array<TableColumnData>,
            showColumns: [] as Array<TableColumnData>,
            emptyText: '空空如也',

            oldIndex: '',

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
            draggable: {
                type: 'handle'
            } as TableDraggable,

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
            // 数据处理
            let { columns, records } = JsonToTableBuild(this.data);
            if (useSettingStore().getTableHeaderMode === TableHeaderModeEnum.MAPPING) {
                // 如果表头模式是来自映射
                if (this.index !== '') {
                    // 如果存在索引
                    let index = useIndexStore().map.get(this.index);
                    if (index) {
                        // 存在索引
                        columns = index.fields.filter(field => field.dataIndex !== '')
                            .map(field => buildTableColumnData(field.dataIndex, 100, field.name));
                    }
                }
            }
            this.columns = columns;
            this.records = records;
            // 数据清空
            let x = 0;
            this.columns.map(e => e.width).forEach(e => x += (e || 0));
            this.scroll.x = `${x}px`;
            // 此处设置显示的列
            if (this.index !== this.oldIndex ||
                (this.allowUpdate && this.index === '') ||
                (this.index === this.oldIndex && this.index !== '' && this.allowUpdate)
            ) {
                // 重置索引:切换索引 || (索引为空 && 允许更新) || (索引存在 && 索引未切换 && 允许更新)
                this.allowUpdate = true;
                this.showColumns = this.columns
                this.checkItems = this.showColumns.map(column => column.dataIndex!);
            }
            this.oldIndex = this.index || '';
            // 拖拽
            this.$nextTick(() => {
                this.addSortable();
            })
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
                    const { newIndex, oldIndex } = evt;
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
                        const currRow = this.showColumns.splice(oldIndex - 2, 1)[0];
                        this.showColumns.splice(newIndex - 2, 0, currRow);
                    });
                }
            });
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
</style>