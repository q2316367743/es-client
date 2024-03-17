<!-- 此处是右上角详情 -->
<template>
    <a-dropdown trigger="click" @select="handleCommand">
        <a-button type="text" status="normal" :class="className" :disabled="selfDisabled">
            <template #icon>
                <icon-info-circle :size="16"/>
            </template>
        </a-button>
        <template #content>
            <a-doption value="info">信息</a-doption>
            <a-doption value="status">状态</a-doption>
            <a-doption value="node_status">节点状态</a-doption>
            <a-doption value="cluster_nodes">集群节点</a-doption>
            <a-doption value="plugin">插件</a-doption>
            <a-doption value="cluster_status">集群状态</a-doption>
            <a-doption value="cluster_health">集群健康值</a-doption>
            <a-doption value="template">模板</a-doption>
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
            showJsonDialogByAsync('信息', clusterApi.info());
        },
        async state() {
            showJsonDialogByAsync('状态', clusterApi._stats());
        },
        async node_stats() {
            showJsonDialogByAsync('节点状态', clusterApi._nodes_stats());
        },
        async cluster_nodes() {
            showJsonDialogByAsync('集群节点', clusterApi._nodes());
        },
        async plugin() {
            showJsonDialogByAsync('插件1', clusterApi._nodes_plugins());
        },
        async cluster_status() {
            showJsonDialogByAsync('集群状态', clusterApi._cluster_state());
        },
        async cluster_health() {
            showJsonDialogByAsync('集群健康值', clusterApi._cluster_health());
        },
        async template() {
            showJsonDialogByAsync('模板', clusterApi._template());
        }
    }
});
</script>
<style>
</style>
