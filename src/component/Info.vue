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
                        <el-dropdown-item>{{ $t('app.status') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('app.node_status') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('app.cluster_nodes') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('app.plugin') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('app.cluster_status') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('app.cluster_health') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('app.template') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <json-dialog :json="info_data" title="信息" v-model="info_dialog"></json-dialog>
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
        async info() {
            this.info_data = await clusterApi.info();
            this.info_dialog = true;
        },
        handleCommand(command: string) {
            switch (command) {
                case 'info':
                    this.info();
                    break;
            }
        }
    }
});
</script>
<style scoped>
</style>