<!-- 此处是右上角详情 -->
<template>
    <a-dropdown trigger="click" @select="handleCommand">
        <a-button type="text" status="normal" :class="className" :disabled="url === undefined || disabled">
            <template #icon>
                <icon-info-circle :size="16"/>
            </template>
        </a-button>
        <template #content>
            <a-doption value="info">{{ $t('app.info.info') }}</a-doption>
            <a-doption value="status">{{ $t('app.info.status') }}</a-doption>
            <a-doption value="node_status">{{ $t('app.info.nodeStatus') }}</a-doption>
            <a-doption value="cluster_nodes">{{ $t('app.info.clusterNodes') }}</a-doption>
            <a-doption value="plugin">{{ $t('app.info.plugin') }}</a-doption>
            <a-doption value="cluster_status">{{ $t('app.info.clusterStatus') }}</a-doption>
            <a-doption value="cluster_health">{{ $t('app.info.clusterHealth') }}</a-doption>
            <a-doption value="template">{{ $t('app.info.template') }}</a-doption>
        </template>
    </a-dropdown>
    <json-dialog :json="data" :title="title" v-model:value="dialog" :preview-mode="previewMode"></json-dialog>
</template>
<script lang="ts">
import clusterApi from "@/components/es/api/ClusterApi";

import {defineComponent} from "vue";

import JsonDialog from "@/components/json-dialog/index.vue";
import {mapState} from "pinia";
import useUrlStore from "@/store/UrlStore";

export default defineComponent({
    name: 'home-info',
    emits: ['command'],
    props: {
        className: {
            type: String,
            required: false,
            default: ''
        },
        disabled: Boolean
    },
    components: {
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
        handleCommand(command: any) {
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
