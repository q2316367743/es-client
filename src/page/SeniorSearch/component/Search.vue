<template>
    <vxe-table :data="showRecords" empty-text="没有记录" ref="seniorSearchRecordRef"
               :column-config="columnConfig" :export-config="exportConfig">
        <vxe-column type="seq" width="50" fixed="left" title="序号"></vxe-column>
        <vxe-column field="date" width="150" title="查询时间" :formatter="formatter"></vxe-column>
        <vxe-column field="success" width="100" title="查询状态">
            <template #default="{ row }">
                {{ row.success ? '成功' : '失败' }}
            </template>
        </vxe-column>
        <vxe-column field="time" width="100" title="执行时间">
            <template #default="{ row }">
                {{ row.time }}ms
            </template>
        </vxe-column>
        <vxe-column field="method" width="100" title="请求方式"></vxe-column>
        <vxe-column field="link" width="150" title="请求连接"></vxe-column>
        <vxe-column width="250" title="操作">
            <el-button type="primary">载入</el-button>
            <el-button type="success">查看</el-button>
            <el-button type="danger">删除</el-button>
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

export default defineComponent({
    name: 'senior-search-record',
    data: () => ({
        showRecords: new Array<SeniorSearchRecord>(),
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
                console.log(newValue);
                this.showRecords = newValue;
            },
            deep: true
        }
    },
    methods: {
        formatter(column: any) {
            return  XEUtils.toDateString(column.cellValue, 'yyyy-MM-dd HH:ss:mm')
        }
    }
});
</script>
<style scoped>

</style>