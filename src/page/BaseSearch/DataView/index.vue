<template>
    <div class="base-search-data-view">
        <json-view v-if="view === 2" :data="result" />
        <base-search-table-view v-else-if="view === 3" :data="result" />
        <json-viewer v-else-if="view === 4" :value="result" :expand-depth=5 :copyable="copyable" sort preview-mode
            theme="es-awesome-json-theme" style="margin-top: 8px;"/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from 'vue-json-viewer';

import JsonView from "@/components/JsonView/index.vue";
import BaseSearchTableView from "@/page/BaseSearch/DataView/TableView.vue";

export default defineComponent({
    name: 'base-search-data-view',
    components: { BaseSearchTableView, JsonView, JsonViewer },
    props: {
        result: Object,
        view: {
            type: Number,
            required: false,
            default: 1
        },
    },
    data: () => ({
        copyable: { copyText: "复制", copiedText: "复制成功", timeout: 2000 }
    })
});
</script>
<style lang="less">
</style>