<template>
    <div class="table-viewer-show">
        <vxe-toolbar ref="tableViewerToolbar" custom export/>
        <vxe-table class="es-scrollbar" :empty-text="$t('app.component.data_is_empty')"
                   :data="records" ref="tableViewerTable"
                   :column-config="columnConfig" :export-config="exportConfig">
            <vxe-column type="expand" width="80">
                <template #content="{ row, rowIndex }">
                    <div class="data-browse-expand">
                        <json-view :data="row._source" />
                        <el-button type="primary" text link class="copy" @click="copy(row._source)">复制</el-button>
                    </div>
                </template>
            </vxe-column>
            <vxe-column type="seq" width="50" fixed="left" title="序号"></vxe-column>
            <vxe-column field="_id" title="_id" show-overflow="tooltip" width="80" sortable :formatter="format"/>
            <vxe-column field="_index" title="_index" show-overflow="tooltip" width="100" sortable
                        :formatter="format"/>
            <vxe-column field="_score" title="_score" show-overflow="tooltip" width="100" sortable
                        :formatter="format"/>
            <vxe-column v-for="(header, index) of mappings" :key="index" :field="header.field" :title="header.field"
                        show-overflow="tooltip" sortable :width="header.weight"
                        :formatter="format">
                <template #default="{ row }">
                    {{ typeof row[header.field] === 'object' ? JSON.stringify(row[header.field]) : row[header.field] }}
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ZoomIn} from "@element-plus/icons-vue";
import {VxeColumnPropTypes, VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance} from "vxe-table";
import XEUtils from "xe-utils";
import BrowserUtil from "@/utils/BrowserUtil";
import {ElMessage} from "element-plus";
import JsonView from "@/components/JsonView/index.vue";

interface Col {

    field: string;

    weight: number;

}

export default defineComponent({
    name: 'table-viewer',
    props: {
        data: Object as PropType<any>
    },
    components: {JsonView, ZoomIn},

    data: () => {
        let now = new Date().getTime();
        return {
            flag: 0,
            records: [] as Array<any>,
            mappings: [] as Array<Col>,
            columnConfig: {
                resizable: true
            },
            exportConfig: {
                filename: '数据-' + now,
                sheetName: '数据-' + now,
                // 自定义类型
                types: ['csv', 'html', 'xml', 'txt']
            } as VxeTablePropTypes.ExportConfig
        }
    },
    watch: {
        data() {
            this.render();
        }
    },
    mounted() {
        this.render();
        let tableViewerTable = this.$refs['tableViewerTable'] as VxeTableInstance;
        let tableViewerToolbar = this.$refs['tableViewerToolbar'] as VxeToolbarInstance;
        this.$nextTick(() => {
            tableViewerTable.connect(tableViewerToolbar);
        });
    },
    methods: {
        format(column: { cellValue: any }): VxeColumnPropTypes.Formatter {
            if (column.cellValue instanceof Date) {
                return XEUtils.toDateString(column.cellValue, 'yyyy-MM-dd HH:ss:mm')
            }
            return column.cellValue;
        },
        render() {
            // 当变化时，进行渲染
            if (!this.verify_index()) {
                this.flag = 0;
                if (this.data?.status) {
                    this.flag = 1;
                }
                return;
            } else {
                this.flag = 2;
            }
            this.records = [];
            this.mappings = [];
            let keySet = new Set<string>();
            for (let item of this.data.hits.hits) {
                let i = {} as any;
                i['_id'] = item['_id'];
                i['_index'] = item['_index'];
                i['_score'] = item['_score'];
                let source = item['_source'];
                for (let key in source) {
                    i[key] = source[key];
                    if (!keySet.has(key)) {
                        this.mappings.push({
                            field: key,
                            weight: Math.max(key.length * 20 + 15, 60)
                        });
                        keySet.add(key);
                    }
                }
                i['_source'] = item;
                this.records.push(i);
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
            ElMessage({
                showClose: true,
                type: 'success',
                message: '复制成功'
            })
        }
    }
});
</script>
<style scoped lang="less">
.table-viewer-show {
    overflow: auto;
}

.table-viewer-column {
    z-index: 10;
    position: absolute;
    right: 20px;
    top: 0;
}

.table-viewer-table {
    position: absolute;
    top: 50px;
    right: 10px;
    left: 0;
}

.column {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .dialog-open {
        display: none;
        position: absolute;
        top: 8px;
        right: 0;
        height: 23px;
        width: 23px;
        cursor: pointer;
    }

    &:hover .dialog-open {
        display: block;
    }
}
</style>