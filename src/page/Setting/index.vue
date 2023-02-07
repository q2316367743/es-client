<template>
    <div class="setting">
        <el-tabs v-model="active">
            <el-tab-pane :label="$t('setting.title.base')" name="base"></el-tab-pane>
            <el-tab-pane :label="$t('setting.title.url')" name="url"></el-tab-pane>
            <el-tab-pane :label="$t('setting.title.sync')" name="sync"></el-tab-pane>
            <el-tab-pane :label="$t('setting.title.update')" name="update"></el-tab-pane>
            <el-tab-pane :label="$t('setting.title.about')" name="about"></el-tab-pane>
        </el-tabs>
        <div class="setting-main">
            <el-scrollbar>
                <setting-base v-show="active === 'base'"/>
                <setting-url v-show="active === 'url'"/>
                <setting-sync v-show="active === 'sync'"/>
                <setting-update v-show="active === 'update'"/>
                <setting-about v-show="active === 'about'"/>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";

// 引入相关组件
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'setting',
    components: {
        SettingSync: defineAsyncComponent(() => import("@/page/Setting/components/Sync.vue")),
        SettingAbout: defineAsyncComponent(() => import("@/page/Setting/components/About.vue")),
        SettingUpdate: defineAsyncComponent(() => import("@/page/Setting/components/Update.vue")),
        SettingUrl: defineAsyncComponent(() => import("@/page/Setting/components/Url.vue")),
        SettingBase: defineAsyncComponent(() => import("@/page/Setting/components/Base.vue"))
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