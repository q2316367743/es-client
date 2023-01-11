<template>
    <div class="data-view">
        <json-view v-if="view === 2" :data="result"/>
        <table-viewer v-else-if="view === 3" :data="result"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import TableViewer from "@/components/TableViewer/index.vue";
import JsonView from "@/components/JsonView/index.vue";

export default defineComponent({
    name: 'data-view',
    components: {JsonView, TableViewer},
    props: {
        view: Number,
        result: Object
    },
});
</script>
<style scoped>
</style>