<template>
    <div class="node-stats" v-loading="loading" element-loading-text="加载中">
        <div class="header">
            <div class="title">
                <span>{{ clusterName }}</span>
                <el-button text link :icon="refreshIcon" size="large" style="margin-left: 10px;" @click="init"/>
            </div>
            <div class="option">
                <el-button text link :icon="closeIcon" @click="closeDialog"/>
            </div>
        </div>
        <div class="tab">
            <el-tabs v-model="active">
                <el-tab-pane v-for="nodeName in nodeNames" :label="nodeName" :name="nodeName"/>
            </el-tabs>
        </div>
        <div class="content">
            <el-scrollbar>
                <node-stats-item v-if="node" :node="node"/>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Close, Refresh} from '@element-plus/icons-vue';
import ClusterApi from "@/api/ClusterApi";
import NodeStatsItem from "@/module/info/NodeStats/NodeStatsItem.vue";
import {Node} from "@/es/NodeState";

export default defineComponent({
    name: 'node-stats',
    emits: ['close'],
    components: {
        NodeStatsItem
    },
    data: () => ({
        loading: true,
        clusterName: '',
        active: '',
        nodeNames: new Array<string>(),
        nodeMap: new Map<string, Node>(),
        closeIcon: markRaw(Close),
        refreshIcon: markRaw(Refresh)
    }),
    computed: {
        node(): Node | undefined {
            return this.nodeMap.get(this.active);
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true;
            ClusterApi._nodes_stats().then(res => {
                this.clusterName = res.cluster_name;
                this.nodeNames = Object.keys(res.nodes);
                if (this.nodeNames.length > 0) {
                    this.active = this.nodeNames[0];
                }
                let nodeMap = new Map<string, Node>();
                for (let nodeName of this.nodeNames) {
                    nodeMap.set(nodeName, res.nodes[nodeName]);
                }
                this.nodeMap = nodeMap;
            }).finally(() => {
                this.loading = false;
            });
        },
        closeDialog() {
            this.$emit('close');
        }
    }
});
</script>
<style scoped lang="less">
@import "./index.less";
</style>