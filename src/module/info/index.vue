<!-- 此处是右上角详情 -->
<template>
    <div class="info" style="padding-top: 2px">
        <el-dropdown trigger="click" @command="handleCommand" :disabled="url === undefined">
            <el-icon :size="20">
                <info-icon/>
            </el-icon>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="info">{{ $t('app.info.info') }}</el-dropdown-item>
                    <el-dropdown-item command="status">{{ $t('app.info.status') }}</el-dropdown-item>
                    <el-dropdown-item command="node_status">{{ $t('app.info.nodeStatus') }}</el-dropdown-item>
                    <el-dropdown-item command="cluster_nodes">{{ $t('app.info.clusterNodes') }}</el-dropdown-item>
                    <el-dropdown-item command="plugin">{{ $t('app.info.plugin') }}</el-dropdown-item>
                    <el-dropdown-item command="cluster_status">{{ $t('app.info.clusterStatus') }}</el-dropdown-item>
                    <el-dropdown-item command="cluster_health">{{ $t('app.info.clusterHealth') }}</el-dropdown-item>
                    <el-dropdown-item command="template">{{ $t('app.info.template') }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <json-dialog :json="data" :title="title" v-model="dialog" :preview-mode="previewMode"></json-dialog>
    </div>
</template>
<script lang="ts">
import clusterApi from "@/api/ClusterApi";

import {defineComponent} from "vue";
import {ArrowDown} from '@element-plus/icons-vue'

import JsonDialog from "@/components/JsonDialog.vue";
import InfoIcon from "@/icon/InfoIcon.vue";
import {mapState} from "pinia";
import useUrlStore from "@/store/UrlStore";

export default defineComponent({
    name: 'home-info',
    emits: ['command'],
    components: {
        InfoIcon,
        ArrowDown,
        JsonDialog,
    },
    data: () => ({
        title: '',
        dialog: false,
        data: {},
        previewMode: true,
        nodeStatsDialog: false
    }),
    computed: {
        ...mapState(useUrlStore, ['url'])
    },
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
            this.title = this.$t('app.info.info')
            this.data = await clusterApi.info();
            this.dialog = true;
            this.previewMode = false;
        },
        async state() {
            this.title = this.$t('app.info.status')
            this.data = await clusterApi._stats();
            this.dialog = true;
            this.previewMode = false;
        },
        async node_stats() {
            this.title = this.$t('app.info.nodeStatus')
            this.data = await clusterApi._nodes_stats();
            this.dialog = true;
            this.previewMode = false;
        },
        async cluster_nodes() {
            this.title = this.$t('app.info.clusterNodes')
            this.data = await clusterApi._nodes();
            this.dialog = true;
            this.previewMode = false;
        },
        async plugin() {
            this.title = this.$t('app.info.plugin')
            this.data = await clusterApi._nodes_plugins();
            this.dialog = true;
            this.previewMode = false;
        },
        async cluster_status() {
            this.title = this.$t('app.info.clusterStatus')
            this.data = await clusterApi._cluster_state();
            this.dialog = true;
            this.previewMode = false;
        },
        async cluster_health() {
            this.title = this.$t('app.info.clusterHealth')
            this.data = await clusterApi._cluster_health();
            this.dialog = true;
            this.previewMode = false;
        },
        async template() {
            this.title = this.$t('app.info.template')
            this.data = await clusterApi._template();
            this.dialog = true;
            this.previewMode = false;
        }
    }
});
</script>
<style>
</style>