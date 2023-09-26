<template>
    <div id="data-browse">
        <!-- 顶部按钮 -->
        <db-header/>
        <!-- 输入条件 -->
        <db-condition/>
        <!-- 数据表格 -->
        <div class="content-table">
            <a-table :columns="showColumns" :data="records" :expandable="expandable" hoverable column-resizable
                     :selectedKeys="selectedKeys" :scroll="scroll" :loading="loading" :pagination="false" row-key="_id"
                     :bordered="bordered" :row-selection="rowSelection" id="data-browse-table" scrollbar
                     @selection-change="updateSelectKeys($event)">
                <template #empty>
                    <div class="data-browse-empty">{{ emptyText }}</div>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, h} from "vue";
import {mapState} from 'pinia';
import {Codemirror} from 'vue-codemirror';
import {TableRowSelection, TableBorder, TableData, TableExpandable} from "@arco-design/web-vue";

import useUrlStore from "@/store/UrlStore";

import PageHelp from "@/page/data-browse/component/PageHelp.vue";
import DbCondition from "@/page/data-browse/component/db-condition.vue";
import DbIndexSelect from "@/page/data-browse/component/DbIndexSelect.vue";
import DbSimpleItem from "@/page/data-browse/component/DbSimpleItem.vue";

import StructureIcon from "@/icon/StructureIcon.vue";

import JsonView from "@/components/JsonView/index.vue";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import DbHeader from "@/page/data-browse/component/db-header.vue";

export default defineComponent({
    name: 'data-browse',
    components: {
        DbHeader,
        DbSimpleItem,
        DbIndexSelect,
        DbCondition,
        PageHelp,
        JsonView,
        StructureIcon,
        Codemirror
    },
    data: () => {
        return {
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
            bordered: {wrapper: true, cell: true} as TableBorder,
            scroll: {
                x: '100%',
                y: '100%'
            },
            rowSelection: {
                type: 'checkbox',
                showCheckedAll: true,
                onlyCurrent: false,
            } as TableRowSelection,

        }
    },
    computed: {
        ...mapState(useDataBrowseStore, ['records', 'index', 'showColumns', 'loading', 'selectedKeys']),
        ...mapState(useUrlStore, ['url']),
        emptyText() {
            if (!this.url) {
                return '请先选择链接'
            }
            if (!this.index) {
                return '请在右上角选择索引'
            }
            return '什么也没有';
        },
        indexName(): string {
            return this.index ? this.index.name : '';
        }
    },
    methods: {
        updateSelectKeys(items: any[]) {
            useDataBrowseStore().updateSelectKeys(items);
        }
    }
});
</script>
<style lang="less">
@import url(./index.less);
</style>
