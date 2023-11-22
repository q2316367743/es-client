<template>
    <div class="dashboard-node">
        <a-card title="统计">
            <template #title>
                <span>节点</span>
                <a-button type="text" size="large" @click="getNodeState()" :disabled="nodeStateLoad">
                    <template #icon>
                        <icon-refresh/>
                    </template>
                </a-button>
            </template>
            <template #extra>
                <icon-refresh spin v-if="nodeStateLoad"/>
                <span style="margin-left: 7px" v-if="nodeStateLoad">加载中</span>
            </template>
            <a-row>
                <a-col :span="8">
                    <a-statistic title="总数" :value="total"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="成功" :value="successful"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="失败" :value="failed"/>
                </a-col>
            </a-row>
        </a-card>
        <a-alert style="margin-top: 7px;">节点</a-alert>
        <!-- 每一个节点 -->
        <a-card v-for="item in nodeItems" style="margin-top: 7px;">
            <template #title>
                {{item.node.name}}
            </template>
            <template #extra>
                {{item.name}}
            </template>
            <!-- 基础信息 -->
            <a-descriptions :column="1">
                <a-descriptions-item label="时间戳">{{ dateFormat(item.node.timestamp) }}</a-descriptions-item>
                <a-descriptions-item label="IP地址">{{ item.node.host }}</a-descriptions-item>
                <a-descriptions-item label="角色">
                    <a-space>
                        <a-tag color="arcoblue" v-for="role in item.node.roles">{{ role }}</a-tag>
                    </a-space>
                </a-descriptions-item>
                <a-divider>系统信息</a-divider>
                <a-descriptions-item label="负载" v-if="item.node.os.cpu.load_average">
                    <a-space>
                        <span>{{ item.node.os.cpu.load_average["1m"] }}</span>
                        <span>{{ item.node.os.cpu.load_average["5m"] }}</span>
                        <span>{{ item.node.os.cpu.load_average["15m"] }}</span>
                        <template #split>
                            <a-divider direction="vertical"/>
                        </template>
                    </a-space>
                </a-descriptions-item>
                <a-descriptions-item label="CPU">
                    <a-progress :percent="item.node.os.cpu.percent / 100" :status="calcStatus(item.node.os.cpu.percent)"/>
                </a-descriptions-item>
                <a-descriptions-item label="内存">
                    <div>
                        <span>{{ prettyDataUnit(item.node.os.mem.used_in_bytes) }}</span>
                        <span> / </span>
                        <span>{{ prettyDataUnit(item.node.os.mem.total_in_bytes) }}</span>
                    </div>
                    <a-progress
                            :percent="item.node.os.mem.used_percent / 100"
                            :status="calcStatus(item.node.os.mem.used_percent)"/>
                </a-descriptions-item>
                <a-descriptions-item label="交换区">
                    <div>
                        <span>{{ prettyDataUnit(item.node.os.swap.used_in_bytes) }}</span>
                        <span> / </span>
                        <span>{{ prettyDataUnit(item.node.os.swap.total_in_bytes) }}</span>
                    </div>
                    <a-progress
                            :percent="Math.floor(item.node.os.swap.used_in_bytes / item.node.os.swap.total_in_bytes * 100) / 100"
                            :status="nodeStateMemStatus(item.node.os.swap.used_in_bytes, item.node.os.swap.total_in_bytes)"/>
                </a-descriptions-item>
            </a-descriptions>
        </a-card>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Node, NodeState} from "@/components/es/domain/NodeState";
import ClusterApi from "@/components/es/api/ClusterApi";
import MessageUtil from "@/utils/MessageUtil";
import useUrlStore from "@/store/UrlStore";
import {prettyDataUnit} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";

interface NodeItem {
    name: string;
    node: Node;
}

const empty = computed(() => useUrlStore().empty);

const nodeState = ref<NodeState | null>(null);
const nodeStateLoad = ref(false);

const total = computed(() => nodeState.value ? nodeState.value._nodes.total : 0);
const successful = computed(() => nodeState.value ? nodeState.value._nodes.successful : 0);
const failed = computed(() => nodeState.value ? nodeState.value._nodes.failed : 0);
const nodeItems = computed<Array<NodeItem>>(() => {
    if (!nodeState.value) {
        return [];
    }
    const items = new Array<NodeItem>();
    for (let nodeKey in nodeState.value.nodes) {
        items.push({
            name: nodeKey,
            node: nodeState.value.nodes[nodeKey]
        });
    }
    return items;
});

function getNodeState() {
    if (empty.value) {
        return;
    }
    nodeStateLoad.value = true
    ClusterApi._nodes_stats().then(rsp => nodeState.value = rsp)
        .catch(e => MessageUtil.error("节点状态获取失败", e))
        .finally(() => nodeStateLoad.value = false);
}

watch(() => useUrlStore().current, () => getNodeState());
getNodeState();

function nodeStateMemStatus(use: number, total: number): 'success' | 'warning' | 'danger' {
    const percent = Math.floor(use / total * 100);
    return calcStatus(percent);
}

function calcStatus(percent: number): 'success' | 'warning' | 'danger' {
    if (percent >= 80) {
        return 'danger';
    }
    if (percent >= 60) {
        return 'warning';
    }
    return 'success';
}

function dateFormat(date: number): string {
    return toDateString(date);
}

</script>
<style scoped>
.dashboard-node {
    padding: 7px;
}
</style>
