<template>
    <div class="dashboard-info">
        <a-row style="width: 100%">
            <a-col :span="24" :xs="24" :lg="24" :xl="24" :xxl="12">
                <dashboard-card title="节点信息" :loading="infoLoad" @render="getInfoData()">
                    <a-descriptions :column="1" style="width: 100%" :align="{value: 'right'}"
                                    v-if="info !== null">
                        <a-descriptions-item label="name">{{ info.name }}</a-descriptions-item>
                        <a-descriptions-item label="cluster_name">{{ info.cluster_name }}</a-descriptions-item>
                        <a-descriptions-item label="cluster_uuid">{{ info.cluster_uuid }}</a-descriptions-item>
                        <a-descriptions-item label="tagline">{{ info.tagline }}</a-descriptions-item>
                        <a-descriptions-item label="version.number">{{ info.version.number }}</a-descriptions-item>
                        <a-descriptions-item label="version.build_flavor">{{ info.version.build_flavor }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.build_type">{{
                                info.version.build_type
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.build_hash">{{
                                info.version.build_hash
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.build_date">{{
                                info.version.build_date
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.build_snapshot">{{ info.version.build_snapshot }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.lucene_version">{{ info.version.lucene_version }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.minimum_wire_compatibility_version">
                            {{ info.version.minimum_wire_compatibility_version }}
                        </a-descriptions-item>
                        <a-descriptions-item label="version.minimum_index_compatibility_version">
                            {{ info.version.minimum_index_compatibility_version }}
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-space direction="vertical" size="large" :style="{width:'100%'}" v-else>
                        <a-skeleton animation>
                            <a-space direction="vertical" :style="{width:'100%'}" size="large">
                                <a-skeleton-line :rows="13"/>
                            </a-space>
                        </a-skeleton>
                    </a-space>
                </dashboard-card>
            </a-col>


            <a-col :span="24" :xs="24" :lg="24" :xl="24" :xxl="12">
                <dashboard-card title="集群健康" :loading="clusterHealthLoad" @render="getClusterHealth()">
                    <a-descriptions :column="1" style="width: 100%" :align="{value: 'right'}"
                                    v-if="clusterHealth !== null">
                        <a-descriptions-item label="cluster_name">{{ clusterHealth.cluster_name }}</a-descriptions-item>
                        <a-descriptions-item label="status">{{ clusterHealth.status }}</a-descriptions-item>
                        <a-descriptions-item label="timed_out">{{ clusterHealth.timed_out }}</a-descriptions-item>
                        <a-descriptions-item label="number_of_nodes">{{
                                clusterHealth.number_of_nodes
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="number_of_data_nodes">{{
                                clusterHealth.number_of_data_nodes
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="active_primary_shards">{{
                                clusterHealth.active_primary_shards
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="active_shards">{{
                                clusterHealth.active_shards
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="relocating_shards">{{
                                clusterHealth.relocating_shards
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="initializing_shards">{{
                                clusterHealth.initializing_shards
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="unassigned_shards">{{
                                clusterHealth.unassigned_shards
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="delayed_unassigned_shards">
                            {{ clusterHealth.delayed_unassigned_shards }}
                        </a-descriptions-item>
                        <a-descriptions-item label="number_of_pending_tasks">{{
                                clusterHealth.number_of_pending_tasks
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="number_of_in_flight_fetch">
                            {{ clusterHealth.number_of_in_flight_fetch }}
                        </a-descriptions-item>
                        <a-descriptions-item label="task_max_waiting_in_queue_millis">
                            {{ clusterHealth.task_max_waiting_in_queue_millis }}
                        </a-descriptions-item>
                        <a-descriptions-item label="active_shards_percent_as_number">
                            {{ clusterHealth.active_shards_percent_as_number }}
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-space direction="vertical" size="large" :style="{width:'100%'}" v-else>
                        <a-skeleton animation>
                            <a-space direction="vertical" :style="{width:'100%'}" size="large">
                                <a-skeleton-line :rows="15"/>
                            </a-space>
                        </a-skeleton>
                    </a-space>
                </dashboard-card>
            </a-col>

        </a-row>
    </div>
</template>
<script lang="ts" setup>
import ClusterApi from "@/components/es/api/ClusterApi";
import {computed, ref, watch} from "vue";
import {Info} from "@/components/es/domain/Info";
import MessageUtil from "@/utils/MessageUtil";
import useUrlStore from "@/store/UrlStore";
import {ClusterHealth} from "@/components/es/domain/ClusterHealth";
import DashboardCard from "@/page/dashboard/components/DashboardCard.vue";

const empty = computed(() => useUrlStore().empty);

const info = ref<Info | null>(null);
const infoLoad = ref(false);
const clusterHealth = ref<ClusterHealth | null>(null);
const clusterHealthLoad = ref(false);

function getInfoData() {
    if (empty.value) {
        return;
    }
    infoLoad.value = true;
    ClusterApi.info().then(rsp => info.value = rsp)
        .catch(e => MessageUtil.error("节点信息获取失败", e))
        .finally(() => infoLoad.value = false);
}

getInfoData();

function getClusterHealth() {
    if (empty.value) {
        return;
    }
    clusterHealthLoad.value = true
    ClusterApi._cluster_health().then(rsp => clusterHealth.value = rsp)
        .catch(e => MessageUtil.error("集群健康值获取失败", e))
        .finally(() => clusterHealthLoad.value = false);
}

getClusterHealth();

watch(() => useUrlStore().current, () => {
    getInfoData();
    getClusterHealth()
})

</script>
<style scoped>
.dashboard-info {
}
</style>
