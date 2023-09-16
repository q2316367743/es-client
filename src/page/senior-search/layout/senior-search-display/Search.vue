<template>
    <a-table :data="records" :expandable="expandable" row-key="date">
        <template #columns>
            <a-table-column data-index="date" :width="150" title="查询时间">
                <template #cell="{ record }">{{ formatter(record.date) }}</template>
            </a-table-column>
            <a-table-column data-index="success" :width="100" title="查询状态">
                <template #cell="{ record }">
                    <div style="display: flex;">
                        <div class="dot" :style="{ backgroundColor: record.success ? 'green' : 'red' }" />
                        <div>{{ record.success ? '成功' : '失败' }}</div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column data-index="time" :width="100" title="执行时间">
                <template #cell="{ record }">
                    {{ record.time }}ms
                </template>
            </a-table-column>
            <a-table-column data-index="method" :width="100" title="请求方式" />
            <a-table-column data-index="link" :width="150" title="请求连接" />
            <a-table-column :width="85" title="操作" fixed="right">
                <template #cell="{ record }">
                    <a-button type="primary" @click="load(record)">载入</a-button>
                </template>
            </a-table-column>
        </template>
    </a-table>
</template>
<script lang="ts">
import { defineComponent, h } from "vue";
import { mapState } from "pinia";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";
import SeniorSearchRecord from "@/page/senior-search/domain/SeniorSearchRecord";
import XEUtils from "xe-utils";
import { useSeniorSearchEvent } from "@/global/BeanFactory";
import JsonView from "@/components/JsonView/index.vue";
import { TableData, TableExpandable } from "@arco-design/web-vue";

export default defineComponent({
    name: 'senior-search-record',
    components: { JsonView },
    data: () => ({
        expandable: {
            title: '请求体',
            width: 80,
            expandedRowRender: (record: TableData) => {
                try {
                    return h(JsonView, {
                        data: JSON.parse(record.params)
                    });
                } catch (e) {
                    return h('pre', {}, record.params);
                }
            }
        } as TableExpandable
    }),
    computed: {
        ...mapState(useSeniorSearchRecordStore, ['records']),
    },
    methods: {
        formatter(column: Date) {
            return XEUtils.toDateString(column, 'yyyy-MM-dd HH:ss:mm')
        },
        load(record: SeniorSearchRecord) {
            useSeniorSearchEvent.emit({
                current: true,
                params: record.params,
                link: record.link,
                method: record.method
            })
        }
    }
});
</script>
<style scoped></style>
