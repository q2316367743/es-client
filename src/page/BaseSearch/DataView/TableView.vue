<template>
    <div class="base-search-table-view">
        <vxe-toolbar ref="baseSearchTool" custom style="padding: 0.6em 12px;" />
        <div class="base-search-view-table">
            <vxe-table ref="baseSearchTable" empty-text="数据为空" :data="records" height="100%"
            :column-config="columnConfig" :export-config="exportConfig">
            <vxe-column type="expand" width="80" title="详细">
                <template #content="{ row, rowIndex }">
                    <div class="data-browse-expand">
                        <a-button type="text" status="normal" class="copy" @click="copy(row._source)">复制</a-button>
                        <json-view :data="row._source" />
                    </div>
                </template>
            </vxe-column>
            <vxe-column type="seq" width="60" fixed="left" title="序号"></vxe-column>
            <vxe-column field="_id" title="_id" show-overflow="tooltip" width="80" sortable :formatter="format" />
            <vxe-column field="_index" title="_index" show-overflow="tooltip" width="100" sortable :formatter="format" />
            <vxe-column field="_score" title="_score" show-overflow="tooltip" width="100" sortable :formatter="format" />
            <vxe-column v-for="(header, index) of mappings" :key="index" :field="header.field" :title="header.field"
                show-overflow="tooltip" sortable :width="header.weight" :formatter="format">
                <template #default="{ row }">
                    {{ typeof row[header.field] === 'object' ? JSON.stringify(row[header.field]) : row[header.field] }}
                </template>
            </vxe-column>
        </vxe-table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { VxeColumnPropTypes, VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance } from "vxe-table";
import XEUtils from "xe-utils";
import BrowserUtil from "@/utils/BrowserUtil";
import JsonView from "@/components/JsonView/index.vue";

interface Col {

    field: string;

    weight: number;

}

export default defineComponent({
    name: 'base-search-table-view',
    props: {
        data: Object as PropType<any>
    },
    components: { JsonView },

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
        let baseSearchTool = this.$refs['baseSearchTool'] as VxeToolbarInstance;
        let baseSearchTable = this.$refs['baseSearchTable'] as VxeTableInstance;
        baseSearchTable.connect(baseSearchTool);
        this.render();
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
        }
    }
});
</script>
<style lang="less">
.base-search-table-view {
    height: calc(100vh - 108px);
    width: 100%;
    overflow: hidden;
    position: relative;

    .base-search-view-table {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>