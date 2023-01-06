<template>
    <el-form style="margin-top: 10px;" label-width="160px" label-position="top">
        <el-divider content-position="left">布局方式</el-divider>
        <el-select v-model="layoutMode">
            <el-option :value="LayoutModeEnum.DEFAULT" label="默认"/>
            <el-option :value="LayoutModeEnum.CLASSIC" label="经典"/>
        </el-select>
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
        <el-divider content-position="left">强迫症选项</el-divider>
        <el-form-item label="选择链接后自动全屏">
            <el-switch v-model="instance.autoFullScreen" :active-value="true" :inactive-value="false"
                       active-text="开启"
                       inactive-text="关闭"/>
        </el-form-item>
        <el-form-item label="默认查询条件-状态">
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
import {defineComponent} from "vue";
import useSettingStore from "@/store/SettingStore";
import {mapState} from "pinia";
import {layoutMode} from "@/global/BeanFactory";
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";

export default defineComponent({
    computed: {
        ...mapState(useSettingStore, ['instance'])
    },
    data: () => ({
        layoutMode,
        LayoutModeEnum
    }),
    created() {
        // 获取布局方式
        document.body.setAttribute('layout-mode', this.layoutMode);
    },
    watch: {
        layoutMode(newValue: string) {
            document.body.setAttribute('layout-mode', newValue);
        }
    }
});
</script>
<style scoped>
</style>