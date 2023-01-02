<template>
    <div class="setting">
        <el-tabs v-model="active">
            <el-tab-pane :label="$t('setting.base.title')" name="base"></el-tab-pane>
            <el-tab-pane :label="$t('setting.link.title')" name="url_history" class="url"></el-tab-pane>
        </el-tabs>
        <BaseSetting v-if="active === 'base'"></BaseSetting>
        <url-setting v-else-if="active === 'url_history'"></url-setting>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import UrlSetting from "./components/UrlSetting.vue";
import BaseSetting from "./components/BaseSetting.vue";

export default defineComponent({
    name: 'setting',
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
    padding: 10px;
}
</style>