<template>
    <div class="data-view">
        <base-viewer v-if="view === 1" :data="result"></base-viewer>
        <json-viewer v-else-if="view === 2" :value="result" :expand-depth="6" copyable sort expanded>
        </json-viewer>
        <table-viewer v-if="view === 3" :data="result" :mapping="mapping">
        </table-viewer>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import BaseViewer from "@/components/BaseViewer.vue";
import JsonViewer from 'vue-json-viewer';
import TableViewer from "@/components/TableViewer/index.vue";

export default defineComponent({
    name: 'data-view',
    components: {BaseViewer, JsonViewer, TableViewer},
    props: {
        view: Number,
        result: Object,
        mapping: Object,
    },
});
</script>
<style scoped>
.data-view {
    margin-top: 16px;
}
</style>