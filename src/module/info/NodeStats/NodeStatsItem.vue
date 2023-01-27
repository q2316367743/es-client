<template>
    <div class="node-stats-item">
        <el-descriptions title="概览" :column="3" border>
            <el-descriptions-item width="100px" label="名字" :span="3">{{
                    Optional.ofNullable(node).map(e => e.name).orElse('')
                }}
            </el-descriptions-item>
            <el-descriptions-item label="传输地址">
                <el-link type="primary" :href="Optional.ofNullable(node).map(e => e.transport_address).orElse('')">
                    {{ Optional.ofNullable(node).map(e => e.transport_address).orElse('') }}
                </el-link>
                <div class="url-copy" @click="copy(Optional.ofNullable(node).map(e => e.transport_address).orElse(''))">
                    复制
                </div>
            </el-descriptions-item>
            <el-descriptions-item label="角色">
                <el-tag v-for="role in Optional.ofNullable(node).map(e => e.roles).orElse([])"
                        style="margin-right: 8px;">{{ role }}
                </el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="属性" :column="3" border style="margin-top: 20px;">
            <el-descriptions-item width="100px"
                                  v-for="(value, key) in Optional.ofNullable(node).map(e => e.attributes).orElse({})"
                                  :label="key">{{ value }}
            </el-descriptions-item>
        </el-descriptions>
        <div class="el-descriptions" style="margin-top: 20px;">
            <div class="el-descriptions__header">
                <div class="el-descriptions__title">系统</div>
                <div class="el-descriptions__extra"></div>
            </div>
            <div class="node-stats-item-content">
                <div class="node-stats-item-pressure" id="node-stats-item-mem"/>
                <div class="node-stats-item-pressure" id="node-stats-item-swap"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Node} from "@/es/NodeState";
import BrowserUtil from "@/utils/BrowserUtil";
import * as echarts from 'echarts/core';
import {TooltipComponent, TooltipComponentOption} from 'echarts/components';
import {GaugeChart, GaugeSeriesOption} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import Optional from "@/utils/Optional";

echarts.use([TooltipComponent, GaugeChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GaugeSeriesOption
>;

function pretty(value: number): { res: number, sum: number } {
    let sum = 0;
    let res = value;
    while (res > 1024) {
        res = res / 1024;
        sum += 1;
    }
    return {res, sum};
}

function getOption(value: number, title: string, max: number) {
    let item = pretty(value);
    let total = max / (1024 ** item.sum) * 100 / 100;
    let unit;
    switch (item.sum) {
        case 1:
            unit = 'Kb';
            break;
        case 2:
            unit = 'Mb';
            break;
        case 3:
            unit = 'Gb';
            break;
        case 4:
            unit = 'T';
            break;
        default:
            unit = 'b';
    }
    return {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}'
                },
                max: Math.round(total),
                data: [
                    {
                        value: Math.round(item.res),
                        name: `${title}（单位：${unit}）`
                    }
                ]
            }
        ]
    } as EChartsOption
}

// 初始化
let memChart = undefined as echarts.ECharts | undefined;
let swapChart = undefined as echarts.ECharts | undefined;

export default defineComponent({
    name: 'node-stats-item',
    props: {
        node: Object as PropType<Node>
    },
    data: () => ({
        Optional
    }),
    mounted() {
        let memDom = document.getElementById('node-stats-item-mem')!;
        memChart = echarts.init(memDom);
        let swapDom = document.getElementById('node-stats-item-swap')!;
        swapChart = echarts.init(swapDom);
        this.mem();
        this.swap();
    },
    methods: {
        copy: BrowserUtil.copy,
        mem() {
            if (memChart) {
                memChart.setOption(getOption(
                    Optional.ofNullable(this.node)
                        .map(e => e.os)
                        .map(e => e.mem)
                        .map(e => e.used_in_bytes)
                        .orElse(0),
                    '内存',
                    Optional.ofNullable(this.node)
                        .map(e => e.os)
                        .map(e => e.mem)
                        .map(e => e.total_in_bytes)
                        .orElse(0)));
            }
        },
        swap() {
            if (swapChart) {
                swapChart.setOption(getOption(
                    Optional.ofNullable(this.node)
                        .map(e => e.os)
                        .map(e => e.swap)
                        .map(e => e.used_in_bytes)
                        .orElse(0),
                    '交换区',
                    Optional.ofNullable(this.node)
                        .map(e => e.os)
                        .map(e => e.swap)
                        .map(e => e.total_in_bytes)
                        .orElse(0)));
            }
        },
    }
});
</script>
<style scoped lang="less">
.node-stats-item-content {
    display: flex;
    justify-content: space-around;

    .node-stats-item-pressure {
        height: 400px;
        width: 400px;
    }
}
</style>