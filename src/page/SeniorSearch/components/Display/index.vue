<template>
    <div class="senior-search-display">
        <div class="view">
            <!-- 结果集渲染 -->
            <senior-search-data-view v-show="displayActive === 'result'" :view="view" :data="data" />
            <!-- 请求记录 -->
            <senior-search-record v-show="displayActive === 'search'" />
            <!-- 历史记录 -->
            <senior-search-history v-show="displayActive === 'history'" />
        </div>
        <div class="tabs">
            <div class="tab" :class="displayActive === 'result' ? 'active' : ''" @click="displayActive = 'result'">结果</div>
            <div class="tab" :class="displayActive === 'search' ? 'active' : ''" @click="displayActive = 'search'">请求记录
            </div>
            <div class="tab" :class="displayActive === 'history' ? 'active' : ''" @click="displayActive = 'history'">历史记录
            </div>
        </div>
        <a-back-top target-container=".senior-content .el-scrollbar__wrap" />
    </div>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";

export default defineComponent({
    name: 'senior-search-display',
    components: {
        SeniorSearchRecord: defineAsyncComponent(() => import('@/page/SeniorSearch/components/Display/Search.vue')),
        SeniorSearchHistory: defineAsyncComponent(() => import('@/page/SeniorSearch/components/Display/History.vue')),
        SeniorSearchDataView: defineAsyncComponent(() => import('@/page/SeniorSearch/components/Display/DataView.vue')),
    },
    props: {
        data: Object,
        view: Number
    },
    data: () => ({
        displayActive: 'result'
    }),
    watch: {
        data() {
            this.displayActive = 'result';
        }
    }
});
</script>
<style scoped lang="less">
.senior-search-display {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 32px;
    overflow: hidden;

    .view {
        position: relative;
        padding: 0 4px;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .tabs {
        width: 32px;
        display: block;

        .tab {
            writing-mode: vertical-lr;
            width: 32px;
            margin: 5px 0;
            cursor: pointer;
            padding: 8px 6px;

            &.active {
                background-color: var(--color-neutral-2);
            }

            &:hover {
                background-color: var(--color-neutral-2);
            }
        }
    }
}
</style>