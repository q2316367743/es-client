<template>
    <el-form style="margin-top: 10px;" label-width="160px">
        <el-divider content-position="left">新建索引</el-divider>
        <el-form-item :label="$t('setting.base.default_shard_number')">
            <el-input-number v-model="instance.defaultShard"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.default_replica_number')">
            <el-input-number v-model="instance.defaultReplica"></el-input-number>
        </el-form-item>
        <el-divider content-position="left">分页设置</el-divider>
        <el-form-item :label="$t('setting.base.page_size')">
            <el-input-number v-model="instance.pageSize"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('setting.base.page_step')">
            <el-input-number v-model="instance.pageStep"></el-input-number>
        </el-form-item>
        <el-divider content-position="left">http设置</el-divider>
        <el-form-item :label="$t('setting.base.timeout')">
            <el-input-number v-model="instance.timeout" :min="0" :step="1000"
                             :placeholder="$t('setting.base.timeout_placeholder')"></el-input-number>
        </el-form-item>
        <el-divider content-position="left">默认查询条件</el-divider>
        <el-form-item label="状态">
            <el-select v-model="instance.homeSearchState">
                <el-option :value="0" label="不设置"></el-option>
                <el-option :value="1" label="打开"></el-option>
                <el-option :value="2" label="关闭"></el-option>
            </el-select>
        </el-form-item>
        <el-divider content-position="left">其他</el-divider>
        <el-form-item :label="$t('setting.base.default_viewer')">
            <el-select v-model="instance.defaultViewer">
                <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useSettingStore from "@/store/SettingStore";

export default defineComponent({
    data: () => ({
        instance: useSettingStore().instance,
    }),
});
</script>
<style scoped>

</style>