<template>
    <div>
        <el-form :model="chart">
            <el-form-item label="名称">
                <el-input v-model="chart.name" placeholder="请输入任务名称"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    v-model="chart.description"
                    :rows="5"
                    type="textarea"
                    placeholder="请输入任务描述"
                ></el-input>
            </el-form-item>
        </el-form>
        <div></div>
    </div>
</template>
<script lang="ts">
import Chart from "@/entity/Chart";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'ChartEdit',
    data: () => ({
        chart: {
            id: new Date().getTime(),
            name: '',
            index_id: 0,
            description: '',
            method: '',
            path: '',
            params: '',
            data: '',
            template: ''
        } as Chart
    })
})
</script>
<style>
</style>