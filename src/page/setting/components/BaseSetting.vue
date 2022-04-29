<template>
    <el-form style="margin-top: 10px;">
        <el-form-item :label="$t('setting.base.default_shard_number')">
            <el-input-number v-model="default_shard"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.default_replica_number')">
            <el-input-number v-model="default_replica"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.default_viewer')">
            <el-select v-model="default_viewer">
                <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useSettingStore } from "@/store/SettingStore";

export default defineComponent({
    data: () => ({
        default_shard: useSettingStore().getDefaultShard,
        default_replica: useSettingStore().getDefaultReplica,
        default_viewer: useSettingStore().getDefaultViewer
    }),
    watch: {
        default_shard() {
            useSettingStore().setDefaultShard(this.default_shard);
        },
        default_replica() {
            useSettingStore().setDefaultReplica(this.default_replica);
        },
        default_viewer() {
            useSettingStore().setDefaultViewer(this.default_viewer);
        },
    }
});
</script>
<style scoped>
</style>