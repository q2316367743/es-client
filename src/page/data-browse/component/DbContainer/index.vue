<template>
    <div class="content-table">
        <vxe-table ref="tableRef" :data="useDbResultRecords" :height="height" :column-config="columnConfig"
                   :row-config="rowConfig"
                   :empty-text="emptyText" :loading="loading" :menu-config="menuConfig"
                   @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent"
                   @menu-click="contextMenuClickEvent">
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column type="expand" width="80" title="详细">
                <template #content="{ row }">
                    <div class="expand-wrapper">
                        <json-view :data="row"/>
                    </div>
                </template>
            </vxe-column>
            <vxe-column v-for="column in useDbResultColumns" :key="column.title" :field="column.dataIndex"
                        :title="column.title" :fixed="column.title === '_id' ? 'left' : null" :visible="column.show"
                        :width="Math.max(column.title.length * 14, 80)" show-overflow="tooltip"/>
        </vxe-table>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import useUrlStore from "@/store/UrlStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {VxeTableInstance} from 'vxe-table';
import {useWindowSize} from "@vueuse/core";
import JsonView from "@/components/view/JsonView/index.vue";
import {
    buildContextMenuClickEvent,
    buildSelectAllChangeEvent,
    buildSelectChangeEvent
} from "@/page/data-browse/component/DbContainer/func";
import {columnConfig, menuConfig, rowConfig} from "@/page/data-browse/component/DbContainer/args";
import {useDbResultColumns, useDbResultRecords} from "@/page/data-browse/store/DbResultStore";

const size = useWindowSize();


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


const loading = computed(() => useDataBrowseStore().loading);

onMounted(() => {
    const $table = tableRef.value
    if ($table) {
        $table.setCheckboxRow(useDataBrowseStore().selectedKeys, true);
    }
})

// 全选事件
const selectAllChangeEvent = buildSelectAllChangeEvent(tableRef);
// 选择事件
const selectChangeEvent = buildSelectChangeEvent(tableRef);
// 菜单点击事件
const contextMenuClickEvent = buildContextMenuClickEvent(tableRef)
</script>
<style scoped>

</style>
