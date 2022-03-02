<template>
    <el-card class="data-chart">
        <template #header>
            <div class="card-header">
                <span>数据图表</span>
                <el-button class="button" type="text" @click="save_and_edit_dialog = true">新增</el-button>
            </div>
        </template>
        <el-space class="card-body">
            <chart-item title="图表1" description="描述" update-time="2022-01-19 14:26:00"></chart-item>
            <chart-item title="图表1" description="描述" update-time="2022-01-19 14:26:00"></chart-item>
        </el-space>
        <el-dialog title="新增数据图表" v-model="save_and_edit_dialog">
            <chart-edit style="height: 50vh;overflow-y: auto;"></chart-edit>
        </el-dialog>
    </el-card>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import ChartItem from "./components/ChartItem.vue";
import ChartEdit from "./components/ChartEdit.vue";

export default defineComponent({
    name: 'DataChart',
    components: { ChartItem, ChartEdit },
    data: () => ({
        save_and_edit_dialog: false
    })
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