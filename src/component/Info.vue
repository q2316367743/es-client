<!-- 此处是右上角详情 -->
<template>
    <div class="info">
        <el-dropdown @command="handleCommand">
            <el-button type="primary">
                <span>信息</span>
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="info">信息</el-dropdown-item>
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
    <json-dialog :json="info_data" title="信息" v-model="info_dialog"></json-dialog>
</template>
<script lang="ts">
import clusterApi from "@/api/cluster";
import { Info } from '@/view/Info'

import { defineComponent } from "vue";
import { ArrowDown } from '@element-plus/icons-vue'

import JsonDialog from "./JsonDialog.vue";

export default defineComponent({
    components: {
        ArrowDown,
        JsonDialog
    },
    data: () => ({
        info_data: {} as Info,
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
            clusterApi.info((res: Info) => {
                this.info_data = res;
                this.info_dialog = true;
            });
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