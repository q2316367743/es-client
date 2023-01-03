<template>
    <div class="setting">
        <el-tabs v-model="active">
            <el-tab-pane :label="$t('setting.base.title')" name="base"></el-tab-pane>
            <el-tab-pane :label="$t('setting.link.title')" name="url_history" class="url"></el-tab-pane>
            <el-tab-pane label="更新记录" name="update" class="url"></el-tab-pane>
            <el-tab-pane label="关于" name="about" class="url"></el-tab-pane>
        </el-tabs>
        <div class="setting-main">
            <el-scrollbar>
                <BaseSetting v-if="active === 'base'"></BaseSetting>
                <url-setting v-else-if="active === 'url_history'"></url-setting>
                <setting-update v-else-if="active === 'update'"/>
                <setting-about v-else-if="active === 'about'"/>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

import UrlSetting from "./components/UrlSetting.vue";
import BaseSetting from "./components/BaseSetting.vue";
import SettingUpdate from "@/page/Setting/components/Update.vue";
import SettingAbout from "@/page/Setting/components/About.vue";

export default defineComponent({
    name: 'setting',
    components: {
        SettingAbout,
        SettingUpdate,
        UrlSetting,
        BaseSetting
    },
    data: () => {
        return {
            active: "base",
        };
    },
    methods: {},
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

    .setting-main {
        position: absolute;
        top: 50px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        padding: 0;
    }
}
</style>