<template>
    <el-card class="data-chart">
        <template #header>
            <div class="card-header">
                <span>数据图表</span>
                <el-button class="button" type="text">新增</el-button>
            </div>
        </template>
        <el-space class="card-body">
            <chart-item title="图表1" description="描述" update-time="2022-01-19 14:26:00"></chart-item>
            <chart-item title="图表1" description="描述" update-time="2022-01-19 14:26:00"></chart-item>
        </el-space>
    </el-card>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import ChartItem from "@/page/DataChart/component/ChartItem.vue";

export default defineComponent({
    name: 'DataChart',
    components: {ChartItem},
    data: () => ({})
})
</script>
<style lang="less">
.data-chart {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    .card-header {
        display: flex;
        justify-content: space-between;
    }
}
</style>