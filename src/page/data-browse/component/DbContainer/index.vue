<template>
    <div class="content-table">
        <div ref="tableRef" :style="{height: height + 'px'}"></div>
        <a-result v-if="emptyText !== ''" :title="emptyText" style="position:absolute;top: 20vh;left: 0;"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, shallowRef, watch} from "vue";
import useUrlStore from "@/store/UrlStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {useWindowSize} from "@vueuse/core";
import {ListTable} from '@visactor/vtable';

import type {ListTableConstructorOptions} from "@visactor/vtable/es/ts-types";
import {utools} from "@/plugins/utools";
import MessageUtil from "@/utils/MessageUtil";
import {showJson} from "@/utils/DialogUtil";
import {buildOption, transferColumns} from "@/page/data-browse/component/DbContainer/func";

const size = useWindowSize();


const option: ListTableConstructorOptions = buildOption();

const tableRef = ref<HTMLDivElement | null>(null);
const tableInstance = shallowRef<ListTable | null>(null);

const height = computed(() => size.height.value - 40 - 20 - 26 - 35)
const emptyText = computed(() => {
    if (!useUrlStore().url) {
        return '请先选择链接'
    }
    if (!useDataBrowseStore().index) {
        return '请在右上角选择索引'
    }
    if (useDataBrowseStore().records.length == 0) {
        return '什么也没有';
    }
    return '';
});
const loading = computed(() => useDataBrowseStore().loading);

onMounted(() => {
    const $table = tableRef.value
    if ($table) {
        // 创建 VTable 实例
        tableInstance.value = new ListTable($table, option);
        tableInstance.value.on('dropdown_menu_click', (args) => {
            console.log(args);
            const row = useDataBrowseStore().records[args.row - 1];
            switch (args.menuKey) {
                case 'copy-one':
                    utools.copyText(row[`${args.field}`]);
                    MessageUtil.success("已成功复制到剪切板");
                    break;
                case 'copy-line':
                    utools.copyText(JSON.stringify(row['_source'], null, 4));
                    MessageUtil.success("已成功复制到剪切板");
                    break;
                case 'show-source':
                    showJson('源数据', row['_source']);
                    break;
            }
        })
    }
});


watch(() => useDataBrowseStore().showColumns, showColumns => {
    if (tableInstance.value) {
        tableInstance.value.updateColumns(transferColumns(showColumns));
    }
});

watch(() => useDataBrowseStore().records, records => {
    if (tableInstance.value) {
        tableInstance.value.setRecords(records)
    }
});

</script>
<style scoped>

</style>
