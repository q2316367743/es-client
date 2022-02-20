<template>
    <el-form style="margin-top: 10px;">
        <el-form-item :label="$t('setting.base.default_shard_number')">
            <el-input-number v-model="default_shard"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.default_replica_number')">
            <el-input-number v-model="default_replica"></el-input-number>
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
    }),
    watch: {
        default_shard() {
            useSettingStore().setDefaultShard(this.default_shard);
        },
        default_replica() {
            useSettingStore().setDefaultReplica(this.default_replica);
        },
    }
});
</script>
<style scoped>
</style>