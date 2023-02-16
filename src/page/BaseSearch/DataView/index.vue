<template>
    <div class="base-search-data-view">
        <json-view v-if="view === 2" :data="result" />
        <div v-else-if="view === 3" class="base-search-table-view">
            <base-search-table-view :data="result" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonView from "@/components/JsonView/index.vue";
import BaseSearchTableView from "@/page/BaseSearch/DataView/TableView.vue";

export default defineComponent({
    name: 'base-search-data-view',
    components: {BaseSearchTableView, JsonView},
    props: {
        result: Object,
        view: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data: () => ({

    })
});
</script>
<style lang="less">
.base-search-table-view {
    height: calc(100vh - 108px);
    width: 100%;
    overflow: hidden;
}
</style>