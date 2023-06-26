<template>
    <div class="setting">
        <a-tabs v-model:active-key="active">
            <a-tab-pane :title="$t('setting.title.base')" key="base"></a-tab-pane>
            <a-tab-pane :title="$t('setting.title.url')" key="url"></a-tab-pane>
            <a-tab-pane :title="$t('setting.title.update')" key="update"></a-tab-pane>
            <a-tab-pane :title="$t('setting.title.about')" key="about"></a-tab-pane>
        </a-tabs>
        <div class="setting-main">
            <a-scrollbar style="overflow: auto;height: calc(100vh - 108px);">
                <div>
                    <setting-base v-show="active === 'base'"/>
                    <setting-url v-show="active === 'url'"/>
                    <setting-update v-show="active === 'update'"/>
                    <setting-about v-show="active === 'about'"/>
                </div>
            </a-scrollbar>
        </div>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";

// 引入相关组件
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'setting',
    components: {
        SettingAbout: defineAsyncComponent(() => import("@/page/setting/components/About.vue")),
        SettingUpdate: defineAsyncComponent(() => import("@/page/setting/components/Update.vue")),
        SettingUrl: defineAsyncComponent(() => import("@/page/setting/components/Url.vue")),
        SettingBase: defineAsyncComponent(() => import("@/page/setting/components/Base.vue"))
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
    top: 0;
    left: 7px;
    right: 7px;
    bottom: 7px;
    padding: 0;

    .setting-main {
        position: absolute;
        top: 50px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        padding: 0;
    }
}
</style>
