<template>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                   :current-page="page" :page-size="size" @size-change="sizeChange"
                   @current-change="pageChange">
    </el-pagination>
    <base-viewer v-if="view === 1" :data="result"></base-viewer>
    <json-viewer v-else-if="view === 2" :value="result" :expand-depth="6" copyable sort expanded>
    </json-viewer>
    <table-viewer v-if="view === 3" :data="result" :mapping="mapping">
    </table-viewer>
    <base-search-editor-viewer v-if="view === 4" v-model="result" height="calc(100vh - 205px)">
    </base-search-editor-viewer>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import BaseViewer from "@/components/BaseViewer.vue";
import JsonViewer from 'vue-json-viewer';
import TableViewer from "@/components/TableViewer/index.vue";
import BaseSearchEditorViewer from '@/components/EditorViewer/base-search.vue'

export default defineComponent({
    name: 'base-search-view',
    components: {BaseViewer, JsonViewer, TableViewer, BaseSearchEditorViewer},
    props: {
        view: Number,
        result: Object,
        mapping: Object,
        page: Number,
        size: Number,
        total: Number
    },
    emits: ['size-change', 'current-change'],
    methods: {
        sizeChange(e: Event) {
            this.$emit('size-change', e);
        },
        pageChange(e: Event) {
            this.$emit('current-change', e)
        }
    }
});
</script>
<style scoped>

</style>