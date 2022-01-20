<template>
    <el-form label-width="200px" style="margin-top: 10px;">
        <el-form-item :label="$t('setting.base.language')">
            <el-select v-model="language" class="m-2" placeholder="Select">
                <el-option label="中文" value="zh"></el-option>
                <el-option label="English" value="en"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('setting.base.is_save_log')">
            <el-switch v-model="is_save_log"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('setting.base.log_max_day')">
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
        log_max_day: useSettingStore().getLogMaxDay,
        language: useSettingStore().language,
    }),
    watch: {
        is_save_log() {
            useSettingStore().setIsSaveLog(this.is_save_log);
        },
        log_max_day() {
            useSettingStore().setLogMaxDay(this.log_max_day);
        },
        language() {
            useSettingStore().setLanguage(this.language);
            this.$i18n.locale = this.language;
        }
    }
});
</script>
<style scoped>
</style>