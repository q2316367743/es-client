<template>
    <el-card class="chart-item">
        <template #header>
            <div class="header">
                <div>{{ title }}</div>
                <el-button type="text" style="color: #F56C6C">删除</el-button>
            </div>
        </template>
        <div class="body">
            <div class="description">{{ description }}</div>
            <div class="update-time">{{ updateTime }}</div>
            <div class="option">
                <el-button type="text">查看</el-button>
                <el-button type="text">编辑</el-button>
            </div>
        </div>
    </el-card>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'ChartItem',
    props: {
        title: {
            required: false,
            default: '',
            type: String
        },
        updateTime: {
            required: false,
            default: '',
            type: String
        },
        description: {
            required: false,
            default: '',
            type: String
        }
    },
    data: () => ({})
})
</script>
<style lang="less">
.chart-item {
    width: 300px;
    height: 200px;
    position: relative;

    .header {
        display: flex;
        justify-content: space-between;
    }

    .body {
        position: absolute;
        top: 69px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 18px 20px;

        .description {
            position: absolute;
            top: 18px;
            left: 20px;
            right: 20px;
            bottom: 30px;
        }

        .update-time {
            position: absolute;
            right: 10px;
            bottom: 10px;
        }

        .option {
            position: absolute;
            left: 10px;
            bottom: 5px;
        }

    }
}
</style>