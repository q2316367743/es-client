<template>
    <div class="content-table">
        <vxe-table ref="tableRef" :data="records" :height="height" :column-config="columnConfig" :row-config="rowConfig"
                   :empty-text="emptyText" :loading="loading"
                   @checkbox-all="selectAllChangeEvent"
                   @checkbox-change="selectChangeEvent">
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column v-for="column in showColumns" :key="column.title" :field="column.dataIndex"
                        :title="column.title" :fixed="column.title === '_id' ? 'left' : undefined"
                        :width="Math.max(column.title.length * 14, 80)" show-overflow="title" />
        </vxe-table>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import useUrlStore from "@/store/UrlStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {VxeTable, VxeColumn, VXETableConfigOptions, VxeTableEvents, VxeTableInstance} from 'vxe-table';
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize();

const columnConfig = {
    resizable: true,
} as VXETableConfigOptions;
const rowConfig = {} as VXETableConfigOptions;

const tableRef = ref<VxeTableInstance | null>(null);

const height = computed(() => size.height.value - 40 - 20 - 26 - 35)
const emptyText = computed(() => {
    if (!useUrlStore().url) {
        return '请先选择链接'
    }
    if (!useDataBrowseStore().index) {
        return '请在右上角选择索引'
    }
    return '什么也没有';
});
const records = computed(() => useDataBrowseStore().records);
const showColumns = computed(() => useDataBrowseStore().showColumns);
const loading = computed(() => useDataBrowseStore().loading);

onMounted(() => {
    const $table = tableRef.value
    if ($table) {
        $table.setCheckboxRow(useDataBrowseStore().selectedKeys, true);
    }
})

const selectAllChangeEvent: VxeTableEvents.CheckboxAll = () => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        useDataBrowseStore().updateSelectKeys(records)
    }
}

const selectChangeEvent: VxeTableEvents.CheckboxChange = () => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        useDataBrowseStore().updateSelectKeys(records)
    }
}
</script>
<style scoped>

</style>
