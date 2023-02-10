<template>
    <vxe-table :data="records" empty-text="没有记录" ref="seniorSearchRecordRef"
               :column-config="columnConfig" :export-config="exportConfig">
        <vxe-column type="seq" width="50" fixed="left" title="序号"></vxe-column>
        <vxe-column type="expand" width="80" title="请求体">
            <template #content="{ row, rowIndex }">
                <div class="data-browse-expand">
                    <json-view :data="JSON.parse(row.params)"/>
                </div>
            </template>
        </vxe-column>
        <vxe-column field="date" width="150" title="查询时间" :formatter="formatter"></vxe-column>
        <vxe-column field="success" width="100" title="查询状态">
            <template #default="{ row }">
                <div style="display: flex;">
                    <div class="dot" :style="{backgroundColor: row.success ? 'green':'red'}"/>
                    <div>{{ row.success ? '成功' : '失败' }}</div>
                </div>
            </template>
        </vxe-column>
        <vxe-column field="time" width="100" title="执行时间">
            <template #default="{ row }">
                {{ row.time }}ms
            </template>
        </vxe-column>
        <vxe-column field="method" width="100" title="请求方式"></vxe-column>
        <vxe-column field="link" width="150" title="请求连接" show-overflow="ellipsis"></vxe-column>
        <vxe-column width="250" title="操作">
            <template #default="{ row }">
                <a-button type="primary" @click="load(row)">载入</a-button>
            </template>
        </vxe-column>
    </vxe-table>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";
import {VxeTablePropTypes} from "vxe-table";
import SeniorSearchRecord from "@/page/SeniorSearch/domain/SeniorSearchRecord";
import XEUtils from "xe-utils";
import {useSeniorSearchEvent} from "@/global/BeanFactory";
import JsonView from "@/components/JsonView/index.vue";

export default defineComponent({
    name: 'senior-search-record',
    components: {JsonView},
    data: () => ({
        columnConfig: {
            resizable: true
        },
        exportConfig: {
            filename: '高级查询搜索历史',
            sheetName: '高级查询搜索历史',
            // 自定义类型
            types: ['csv', 'html', 'xml', 'txt']
        } as VxeTablePropTypes.ExportConfig
    }),
    computed: {
        ...mapState(useSeniorSearchRecordStore, ['records']),
    },
    watch: {
        records: {
            handler(newValue: Array<SeniorSearchRecord>) {
                let seniorSearchRecordRef = this.$refs.seniorSearchRecordRef as any;
                seniorSearchRecordRef.loadData(newValue.sort((a, b) => b.date.getTime() - a.date.getTime()));
            },
            deep: true
        }
    },
    methods: {
        formatter(column: any) {
            return XEUtils.toDateString(column.cellValue, 'yyyy-MM-dd HH:ss:mm')
        },
        load(record: SeniorSearchRecord) {
            useSeniorSearchEvent.emit({
                current: true,
                params: record.params,
                link: record.link,
                method: record.method,
                execute: false
            })
        }
    }
});
</script>
<style scoped>

</style>