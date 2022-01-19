<template>
    <el-form label-width="150px" style="margin-top: 10px;">
        <el-form-item label="是否存储日志：">
            <el-switch v-model="is_save_log"></el-switch>
        </el-form-item>
        <el-form-item label="日志最大存储天数：">
            <el-input-number v-model="log_max_day"></el-input-number>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useSettingStore } from "@/store/SettingStore";

export default defineComponent({
    data: () => ({
        is_save_log: useSettingStore().getIsSaveLog,
        log_max_day: useSettingStore().getLogMaxDay
    }),
    watch: {
        is_save_log() {
            useSettingStore().setIsSaveLog(this.is_save_log);
        },
        log_max_day() {
            useSettingStore().setLogMaxDay(this.log_max_day);
        }
    }
});
</script>
<style scoped>

</style>