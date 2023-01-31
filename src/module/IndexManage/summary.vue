<template>
    <el-descriptions title="概览" :column="2" class="index-manage-summary" border v-loading="loading"
                     element-loading-text="数据查询中">
        <el-descriptions-item width="70px" label="健康">
            <div class="health">
                <div class="dot" :style="{backgroundColor: health}"/>
                <div>{{ health }}</div>
            </div>
        </el-descriptions-item>
        <el-descriptions-item width="70px" label="状态">{{ state }}</el-descriptions-item>
        <el-descriptions-item label="节点数">{{ numberOfNodes }}</el-descriptions-item>
        <el-descriptions-item label="数据节点数">{{ numberOfDataNodes }}</el-descriptions-item>
        <el-descriptions-item label="文档数">{{ docsCount }}</el-descriptions-item>
        <el-descriptions-item label="文档删除">{{ docsDeleted }}</el-descriptions-item>
        <el-descriptions-item label="活动主要分片">{{ activePrimaryShards }}</el-descriptions-item>
        <el-descriptions-item label="活动分片">{{ activeShards }}</el-descriptions-item>
        <el-descriptions-item label="relocating分片">{{ relocatingShards }}</el-descriptions-item>
        <el-descriptions-item label="initializing分片">{{ initializingShards }}</el-descriptions-item>
        <el-descriptions-item label="unassigned分片">{{ unassignedShards }}</el-descriptions-item>
        <el-descriptions-item label="存储大小">{{ storageSize }}</el-descriptions-item>
        <el-descriptions-item label="别名">
            <el-tag v-for="alias in aliases" class="alias">{{ alias }}</el-tag>
        </el-descriptions-item>
    </el-descriptions>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import useIndexStore from "@/store/IndexStore";
import Assert from "@/utils/Assert";
import IndexApi from "@/api/IndexApi";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import {mapState} from "pinia";

export default defineComponent({
    name: 'index-manage-summary',
    props: {
        index: String,
        state: String
    },
    data: () => ({
        loading: false,
        health: '',
        numberOfNodes: 0,
        numberOfDataNodes: 0,
        activePrimaryShards: 0,
        activeShards: 0,
        relocatingShards: 0,
        initializingShards: 0,
        unassignedShards: 0,
        docsCount: '0',
        docsDeleted: '0',
        storageSize: '',
        aliases: new Array<string>()
    }),
    created() {
        this.init();
    },
    computed: {
        ...mapState(useIndexStore, ['indicesMap']),
    },
    watch: {
        indicesMap() {
            this.init()
        }
    },
    methods: {
        init() {
            this.loading = true;
            let indexView = useIndexStore().indicesMap.get(this.index!)!;
            Assert.notNull(indexView, "索引不存在", () => this.loading = false);

            // 获取索引健康状态
            IndexApi(this.index!).health().then(health => {
                this.health = health.status;
                this.numberOfNodes = health.number_of_nodes;
                this.numberOfDataNodes = health.number_of_data_nodes;
                this.activePrimaryShards = health.active_primary_shards;
                this.activeShards = health.active_shards;
                this.relocatingShards = health.relocating_shards;
                this.initializingShards = health.initializing_shards;
                this.unassignedShards = health.unassigned_shards;
                this.docsCount = indexView.doc_count + '';
                this.docsDeleted = Optional.ofNullable(indexView)
                    .map(e => e.indexStats)
                    .map(e => e.total)
                    .map(e => e.docs)
                    .map(e => e.deleted)
                    .map(e => e + '')
                    .orCallback(() => this.docsCount = '')
                    .orElse('');
                this.storageSize = indexView.size;
                this.aliases = indexView.alias;
            }).catch(e => MessageUtil.error("索引健康值获取错误", e))
                .finally(() => this.loading = false);
        }
    }
});
</script>
<style scoped lang="less">
.index-manage-summary {
    margin-top: 20px;


    .health {
        display: flex;

        .dot {
            margin-top: 7px;
            margin-right: 7px;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
        }
    }


    .alias {
        margin-right: 5px;
        margin-bottom: 5px;
    }
}
</style>