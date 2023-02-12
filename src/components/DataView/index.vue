<template>
    <div :class="abs ? 'data-view' : ''">
        <div v-if="view === 2" class="data-json-view">
            <json-view :data="result"/>
        </div>
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
        result: Object,
        abs: {
            type: Boolean,
            required: false,
            default: true
        }
    },
});
</script>
<style scoped lang="less">
.data-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .data-json-view {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
}
</style>