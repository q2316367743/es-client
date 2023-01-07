<template>
    <div class="setting">
        <el-tabs v-model="active">
            <el-tab-pane :label="$t('setting.base.title')" name="base"></el-tab-pane>
            <el-tab-pane :label="$t('setting.link.title')" name="url_history"></el-tab-pane>
            <el-tab-pane label="服务器&同步" name="server-sync"></el-tab-pane>
            <el-tab-pane label="更新记录" name="update"></el-tab-pane>
            <el-tab-pane label="关于" name="about"></el-tab-pane>
        </el-tabs>
        <div class="setting-main">
            <el-scrollbar>
                <setting-base v-if="active === 'base'"/>
                <setting-url v-else-if="active === 'url_history'"/>
                <setting-server-sync v-else-if="active === 'server-sync'"/>
                <setting-update v-else-if="active === 'update'"/>
                <setting-about v-else-if="active === 'about'"/>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

// 引入相关组件
import SettingBase from "@/page/Setting/components/Base.vue";
import SettingUrl from "@/page/Setting/components/Url.vue";
import SettingServerSync from "@/page/Setting/components/ServerAndSync.vue";
import SettingUpdate from "@/page/Setting/components/Update.vue";
import SettingAbout from "@/page/Setting/components/About.vue";

import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'setting',
    components: {
        SettingServerSync,
        SettingAbout,
        SettingUpdate,
        SettingUrl,
        SettingBase
    },
    data: () => {
        return {
            active: "base",
        };
    },
    created() {
        emitter.on(MessageEventEnum.PAGE_SETTING_ACTIVE, (active) => {
            this.active = active as string;
        })
    }
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