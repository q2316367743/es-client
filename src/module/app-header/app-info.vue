<!-- 此处是右上角详情 -->
<template>
    <a-dropdown trigger="click" @select="handleCommand">
        <a-button type="text" status="normal" :class="className" :disabled="selfDisabled">
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
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import useUrlStore from "@/store/UrlStore";
import clusterApi from "@/components/es/api/ClusterApi";
import {showJsonDialogByAsync} from "@/utils/DialogUtil";

export default defineComponent({
    name: 'home-info',
    emits: ['command'],
    props: {
        className: {
            type: String,
            required: false,
            default: ''
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: () => ({
        title: '',
        dialog: false,
        data: {},
        previewMode: true,
        nodeStatsDialog: false
    }),
    computed: {
        ...mapState(useUrlStore, ['url']),
        selfDisabled(): boolean {
            if (!this.url) {
                return true;
            }
            return this.disabled;
        }
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
            showJsonDialogByAsync(this.$t('app.info.info'), clusterApi.info());
        },
        async state() {
            showJsonDialogByAsync(this.$t('app.info.status'), clusterApi._stats());
        },
        async node_stats() {
            showJsonDialogByAsync(this.$t('app.info.nodeStatus'), clusterApi._nodes_stats());
        },
        async cluster_nodes() {
            showJsonDialogByAsync(this.$t('app.info.clusterNodes'), clusterApi._nodes());
        },
        async plugin() {
            showJsonDialogByAsync(this.$t('app.info.plugin'), clusterApi._nodes_plugins());
        },
        async cluster_status() {
            showJsonDialogByAsync(this.$t('app.info.clusterStatus'), clusterApi._cluster_state());
        },
        async cluster_health() {
            showJsonDialogByAsync(this.$t('app.info.clusterHealth'), clusterApi._cluster_health());
        },
        async template() {
            showJsonDialogByAsync(this.$t('app.info.template'), clusterApi._template());
        }
    }
});
</script>
<style>
</style>
