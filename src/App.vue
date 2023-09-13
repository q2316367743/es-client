<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <a-config-provider size="medium" global>
        <a-layout id="app" :class="Constant.mode === 'desktop' ? 'desktop' : ''">
            <!-- 顶部菜单栏 -->
            <app-header />
            <!-- 主页面 -->
            <a-layout id="main">
                <a-layout-sider :collapsed="collapsed" :width="150" :collapsed-width="50">
                    <a-menu v-model:collapsed="collapsed" v-model:selected-keys="selectedKeys" show-collapse-button>
                        <a-menu-item :key="PageNameEnum.HOME">
                            <template #icon>
                                <icon-home />
                            </template>
                            {{ $t('menu.home') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.DATA_BROWSE">
                            <template #icon>
                                <icon-apps />
                            </template>
                            {{ $t('menu.dataBrowser') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.BASE_SEARCH">
                            <template #icon>
                                <icon-search />
                            </template>
                            {{ $t('menu.baseSearch') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.SENIOR_SEARCH">
                            <template #icon>
                                <icon-filter />
                            </template>
                            {{ $t('menu.seniorSearch') }}
                        </a-menu-item>
                        <a-sub-menu :key="PageNameEnum.SETTING">
                            <template #icon>
                                <icon-settings />
                            </template>
                            <template #title>设置</template>
                            <a-menu-item :key="PageNameEnum.SETTING_GLOBAL">
                                全局设置
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.SETTING_URL">
                                链接管理
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.SETTING_UPDATE">
                                更新日志
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.SETTING_ABOUT">
                                关于
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </a-layout-sider>
                <!-- 内容-->
                <a-layout-content>
                    <a-spin :loading="loading" :tip="text">
                        <router-view />
                    </a-spin>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <!-- 索引管理 -->
        <index-manage />
        <!-- 版本更新 -->
        <version-update v-model:visible="updateDialog" />
        <!-- 欢迎新用户 -->
        <a-modal v-model:visible="newDialog" :title="$t('app.welcome')" class="es-dialog" mask-closable render-to-body
            draggable top="5vh" width="600px" :footer="false">
            <a-scrollbar height="calc(80vh - 54px)">
                <setting-about v-if="newDialog" />
            </a-scrollbar>
        </a-modal>
    </a-config-provider>
</template>

<script lang="ts">
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import useLoadingStore from "@/store/LoadingStore";
import { useGlobalStore } from "@/store/GlobalStore";
// 引入框架
import { defineAsyncComponent, defineComponent } from 'vue';
import { mapState } from "pinia";
// 模块
import AppHeader from '@/module/app-header/index.vue';
// 插件
import emitter from '@/plugins/mitt';
// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
// 常量
import Constant from '@/global/Constant'
// 工具类
import Assert from "@/utils/Assert";
import { versionManage, } from "@/global/BeanFactory";
import useBaseSearchHistoryStore from "@/store/BaseSearchHistoryStore";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";

export default defineComponent({
    components: {
        // 组件
        AppHeader,
        SettingAbout: defineAsyncComponent(() => import("@/page/setting/components/about.vue")),
        VersionUpdate: defineAsyncComponent(() => import("@/module/version-update/index.vue")),
        IndexManage: defineAsyncComponent(() => import('@/module/index-manage/index.vue')),
    },
    data: () => {
        return {
            Constant,
            updateDialog: false,
            newDialog: false,
            collapsed: true,
            selectedKeys: [PageNameEnum.HOME] as Array<PageNameEnum>,
            PageNameEnum,
        };
    },
    computed: {
        ...mapState(useGlobalSettingStore, ['jsonTheme']),
        ...mapState(useLoadingStore, ['loading', 'text']),
    },
    watch: {
        selectedKeys(newValue: any[]) {
            this.$router.push(newValue[0]);
        },
        '$route.path': {
            handler(value) {
                this.selectedKeys = [value];
            }
        }
    },
    created() {
        // 初始化
        Promise.all([
            useUrlStore().init(),
            useBaseSearchHistoryStore().init(),
            useEditorSettingStore().init()
        ])
            .then(() => {
                // 版本更新处理
                switch (versionManage.checkBasicUpdate()) {
                    case 1:
                        this.newDialog = true;
                        break;
                    case 2:
                        this.updateDialog = true;
                        break;
                }
                versionManage.execUpdate();

            })


        if (utools.isDarkColors()) {
            // 设置为暗黑主题
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            // 恢复亮色主题
            document.body.removeAttribute('arco-theme');
        }
    },
    methods: {
        switchDarkColors() {
            useGlobalStore().switchDarkColors()
        },

        jumpToAddUrl() {
            this.$router.push({
                path: '/setting/url',
                query: {
                    method: 'add'
                }
            })
        },

        async selectUrl(value: any) {
            // 清空链接
            if (value === '') {
                // 清空链接选择
                useUrlStore().clear();
                // 清空索引信息
                useIndexStore().clear();
                // 发哦送清空事件
                emitter.emit(MessageEventEnum.URL_UPDATE);
                return
            }
            // 选择链接
            Assert.isTrue(useUrlStore().choose(value as number), this.$t('app.urlUnFind'));
            // 索引刷新
            await useIndexStore().reset();
            // 发送url连接事件
        },
        async refresh() {
            await useIndexStore().reset();
        },
        selectMenu(index: PageNameEnum) {
            // 切换active
            this.selectedKeys = [index];
        },
    },
});
</script>

<style lang="less">
.app-feedback {
    width: calc(100vw - 40px);
    height: calc(100vh - 58px - 60px);
    border: none;
}
</style>
