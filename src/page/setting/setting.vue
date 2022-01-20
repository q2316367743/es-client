<template>
    <el-card class="setting">
        <template #header>设置</template>
        <el-tabs v-model="active">
            <el-tab-pane :label="$t('setting.base.title')" name="base"></el-tab-pane>
            <el-tab-pane label="链接管理" name="url_history" class="url"></el-tab-pane>
            <el-tab-pane label="历史记录" name="senior_param"></el-tab-pane>
        </el-tabs>
        <BaseSetting v-if="active === 'base'"></BaseSetting>
        <url-setting v-else-if="active === 'url_history'"></url-setting>
        <div v-else-if="active === 'senior_param'">历史记录</div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import UrlSetting from "./component/UrlSetting.vue";
import BaseSetting from "./component/BaseSetting.vue";

export default defineComponent({
    components: {
        UrlSetting,
        BaseSetting
    },
    data: () => {
        return {
            active: "base",
        };
    },
    methods: {
    },
});
</script>

<style lang="less">
.setting {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .el-card__body {
        position: absolute;
        top: 58px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
    }

    .option {
        position: absolute;
        top: 20px;
        right: 25px;
        z-index: 10;
    }
}
</style>