<!-- 此处是右上角详情 -->
<template>
    <div>
        <div class="info">
            <el-dropdown @command="handleCommand">
                <el-button type="primary">
                    <span>{{ $t('app.info') }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="info">{{ $t('app.info') }}</el-dropdown-item>
                        <el-dropdown-item command="status">{{ $t('app.status') }}</el-dropdown-item>
                        <el-dropdown-item command="node_status">{{ $t('app.node_status') }}</el-dropdown-item>
                        <el-dropdown-item command="cluster_nodes">{{ $t('app.cluster_nodes') }}</el-dropdown-item>
                        <el-dropdown-item command="plugin">{{ $t('app.plugin') }}</el-dropdown-item>
                        <el-dropdown-item command="cluster_status">{{ $t('app.cluster_status') }}</el-dropdown-item>
                        <el-dropdown-item command="cluster_health">{{ $t('app.cluster_health') }}</el-dropdown-item>
                        <el-dropdown-item command="template">{{ $t('app.template') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <json-dialog :json="data" :title="title" v-model="dialog" :preview-mode="previewMode"></json-dialog>
    </div>
</template>
<script lang="ts">
import clusterApi from "@/api/ClusterApi";

import { defineComponent } from "vue";
import { ArrowDown } from '@element-plus/icons-vue'

import JsonDialog from "./JsonDialog.vue";

export default defineComponent({
    components: {
        ArrowDown,
        JsonDialog
    },
    data: () => ({
        title: '',
        dialog: false,
        data: {},
        previewMode: true
    }),
    methods: {
        handleCommand(command: string) {
            switch (command) {
                case 'info':
                    this.info();
                    break;
                case 'status':
                    this.state();
                    break;
                case 'node_status':
                    this.node_stats();
                    break;
                case 'cluster_nodes':
                    this.cluster_nodes();
                    break;
                case 'plugin':
                    this.plugin();
                    break;
                case 'cluster_status':
                    this.cluster_status();
                    break;
                case 'cluster_health':
                    this.cluster_health();
                    break;
                case 'template':
                    this.template();
                    break;
            }
        },
        async info() {
            this.title = this.$t('app.info')
            this.data = await clusterApi.info();
            this.dialog = true;
            this.previewMode = false;
        },
        async state() {
            this.title = this.$t('app.status')
            this.data = await clusterApi._stats();
            this.dialog = true;
            this.previewMode = false;
        },
        async node_stats() {
            this.title = this.$t('app.node_status')
            this.data = await clusterApi._nodes_stats();
            this.dialog = true;
            this.previewMode = false;
        },
        async cluster_nodes() {
            this.title = this.$t('app.cluster_nodes')
            this.data = await clusterApi._nodes();
            this.dialog = true;
            this.previewMode = false;
        },
        async plugin() {
            this.title = this.$t('app.plugin')
            this.data = await clusterApi._nodes_plugins();
            this.dialog = true;
            this.previewMode = false;
        },
        async cluster_status() {
            this.title = this.$t('app.cluster_status')
            this.data = await clusterApi._cluster_state();
            this.dialog = true;
            this.previewMode = false;
        },
        async cluster_health() {
            this.title = this.$t('app.cluster_health')
            this.data = await clusterApi._cluster_health();
            this.dialog = true;
            this.previewMode = false;
        },
        async template() {
            this.title = this.$t('app.template')
            this.data = await clusterApi._template();
            this.dialog = true;
            this.previewMode = false;
        }
    }
});
</script>
<style scoped>
</style>