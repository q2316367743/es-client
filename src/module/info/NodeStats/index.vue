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
        <div class="content">
            <el-scrollbar>
                <el-tabs v-model="active">
                    <el-tab-pane v-for="(node, key) in nodes" :label="key" :name="key">
                        <node-stats-item :node="node"/>
                    </el-tab-pane>
                </el-tabs>
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
        closeIcon: markRaw(Close),
        refreshIcon: markRaw(Refresh),
        nodes: {} as Record<string, Node>
    }),
    created() {
        this.init();
    },
    methods: {
        init() {
            this.active = '';
            this.loading = true;
            ClusterApi._nodes_stats().then(res => {
                this.clusterName = res.cluster_name;
                this.nodes = Object.freeze(res.nodes);
                let keys = Object.keys(this.nodes);
                if (keys.length > 0) {
                    this.active = keys[0];
                }
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