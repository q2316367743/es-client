<!-- 此处是右上角详情 -->
<template>
    <div class="info">
        <el-dropdown>
            <el-button type="primary">
                <span>信息</span>
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click.prevent="info">信息</el-dropdown-item>
                    <el-dropdown-item>状态</el-dropdown-item>
                    <el-dropdown-item>节点状态</el-dropdown-item>
                    <el-dropdown-item>集群节点</el-dropdown-item>
                    <el-dropdown-item>插件</el-dropdown-item>
                    <el-dropdown-item>群集状态</el-dropdown-item>
                    <el-dropdown-item>集群健康值</el-dropdown-item>
                    <el-dropdown-item>模板</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
    <el-dialog
        title="信息"
        v-model="info_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="info_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="状态"
        v-model="stats_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="stats_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="节点状态"
        v-model="nodes_stats_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="nodes_stats_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="集群节点"
        v-model="nodes_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="nodes_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="插件"
        v-model="node_plugins_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="node_plugins_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="群集状态"
        v-model="cluster_state_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="cluster_state_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="集群健康值"
        v-model="cluster_health_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="cluster_health_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
        title="模板"
        v-model="template_dialog"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="template_data" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
</template>
<script lang="ts">
import cluster_api from "@/apis/cluster";

import { defineComponent } from "vue";
import JsonViewer from "vue-json-viewer";
import { ArrowDown } from '@element-plus/icons-vue'

export default defineComponent({
    components: {
        JsonViewer,
        ArrowDown
    },
    data: () => ({
        info_data: {},
        info_dialog: false,
        stats_data: {},
        stats_dialog: false,
        nodes_dialog: false,
        nodes_data: {},
        nodes_stats_data: {},
        nodes_stats_dialog: false,
        node_plugins_data: {},
        node_plugins_dialog: false,
        cluster_state_data: {},
        cluster_state_dialog: false,
        cluster_health_data: {},
        cluster_health_dialog: false,
        template_data: {},
        template_dialog: false,
    }),
    methods: {
        info() {
            cluster_api.info((res: any) => {
                this.info_data = res;
                this.info_dialog = true;
            });
        },
    }
});
</script>
<style scoped>
</style>