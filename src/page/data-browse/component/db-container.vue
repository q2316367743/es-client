<template>
    <div class="content-table">
        <vxe-table ref="tableRef" :data="records" :height="height" :column-config="columnConfig" :row-config="rowConfig"
                   :empty-text="emptyText" :loading="loading" :menu-config="menuConfig"
                   @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent"
                   @menu-click="contextMenuClickEvent">
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column type="expand" width="80" title="详细">
                <template #content="{ row, rowIndex }">
                    <div class="expand-wrapper">
                        <json-view :data="row"/>
                    </div>
                </template>
            </vxe-column>
            <vxe-column v-for="column in showColumns" :key="column.title" :field="column.dataIndex"
                        :title="column.title" :fixed="column.title === '_id' ? 'left' : null"
                        :width="Math.max(column.title.length * 14, 80)" show-overflow="tooltip"/>
        </vxe-table>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import useUrlStore from "@/store/UrlStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {
    VxeTableEvents,
    VxeTableInstance,
    VxeTablePropTypes
} from 'vxe-table';
import {useWindowSize} from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";
import {utools} from "@/plugins/utools";
import JsonView from "@/components/JsonView/index.vue";

const size = useWindowSize();

const columnConfig: VxeTablePropTypes.ColumnConfig = {
    resizable: true,
};
const rowConfig: VxeTablePropTypes.RowConfig = {
    keyField: '_id',
    isCurrent: true,
    isHover: true
};

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

const menuConfig: VxeTablePropTypes.MenuConfig = {
    header: {
        options: [
            [
                {
                    code: 'filter',
                    name: '筛选',
                    visible: false,
                    disabled: false,
                    children: [
                        {code: 'clearFilter', name: '清除筛选', visible: true, disabled: false},
                        {code: 'filterSelect', name: '按所选单元格的值筛选', visible: true, disabled: false}
                    ]
                },
                {
                    code: 'sort',
                    name: '排序',
                    visible: false,
                    disabled: false,
                    children: [
                        {code: 'clearSort', name: '清除排序', visible: true, disabled: false},
                        {code: 'sortAsc', name: '升序', visible: true, disabled: false},
                        {code: 'sortDesc', name: '倒序', visible: true, disabled: false}
                    ]
                },
            ]
        ]
    },
    body: {
        options: [
            [
                {code: 'copy', name: '复制', prefixIcon: 'vxe-icon-copy', visible: true},
                {code: 'copy-row', name: '复制当前行', prefixIcon: 'vxe-icon-copy', visible: true},
            ],
            [
                {code: 'expand', name: '展开/收起当前行', visible: true},
                {code: 'select', name: '选中/取消当前行', visible: true}
            ]
        ]
    },
};

const contextMenuClickEvent: VxeTableEvents.MenuClick = ({menu, row, column}) => {
    const $table = tableRef.value
    switch (menu.code) {
        case 'copy':
            // 示例
            if (row && column) {
                utools.copyText(row[column.field])
                MessageUtil.info("已复制到剪贴板！")
            }
            break
        case 'copy-row':
            if (row) {
                utools.copyText(JSON.stringify(row))
                MessageUtil.info("已复制到剪贴板！")
            }
            break;
        case 'expand':
            if ($table) {
                $table.toggleRowExpand(row)
            }
            break;
        case 'select':
            if ($table) {
                $table.toggleCheckboxRow(row)
            }
            break
        default:
            MessageUtil.info(`点击了 ${menu.name} 选项`)
    }
}
</script>
<style scoped>

</style>
