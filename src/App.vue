<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <a-config-provider size="medium" global>
        <a-layout id="app" :class="Constant.mode === 'desktop' ? 'desktop' : ''">
            <!-- 顶部菜单栏 -->
            <app-header/>
            <!-- 主页面 -->
            <a-layout id="main">
                <a-layout-sider :collapsed="collapsed" :width="150" :collapsed-width="50">
                    <a-menu v-model:collapsed="collapsed" v-model:selected-keys="selectedKeys" show-collapse-button>
                        <a-menu-item :key="PageNameEnum.HOME">
                            <template #icon>
                                <icon-home/>
                            </template>
                            {{ $t('menu.home') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.DATA_BROWSE">
                            <template #icon>
                                <icon-apps/>
                            </template>
                            {{ $t('menu.dataBrowser') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.BASE_SEARCH">
                            <template #icon>
                                <icon-search/>
                            </template>
                            {{ $t('menu.baseSearch') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.SENIOR_SEARCH">
                            <template #icon>
                                <icon-filter/>
                            </template>
                            {{ $t('menu.seniorSearch') }}
                        </a-menu-item>
                        <a-sub-menu :key="PageNameEnum.SETTING">
                            <template #icon>
                                <icon-settings/>
                            </template>
                            <template #title>设置</template>
                            <a-menu-item :key="PageNameEnum.SETTING_GLOBAL">
                                全局设置
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.SETTING_SENIOR_FILTER_RECORD">
                                高级查询过滤器
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.SETTING_URL">
                                链接管理
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.SETTING_BACKUP">
                                备份管理
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu :key="PageNameEnum.MORE">
                            <template #icon>
                                <icon-more/>
                            </template>
                            <template #title>更多</template>
                            <a-menu-item :key="PageNameEnum.MORE_UPDATE">
                                更新日志
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.MORE_ABOUT">
                                关于
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </a-layout-sider>
                <!-- 内容-->
                <a-layout-content>
                    <a-spin :loading="loading" :tip="text">
                        <router-view/>
                    </a-spin>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <!-- 索引管理 -->
        <index-manage/>
        <!-- 版本更新 -->
        <version-update v-model:visible="updateDialog"/>
    </a-config-provider>
</template>

<script lang="ts">
// 引入状态管理
import useIndexStore from '@/store/IndexStore';
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import useLoadingStore from "@/store/LoadingStore";
import {useGlobalStore} from "@/store/GlobalStore";
// 引入框架
import {defineAsyncComponent, defineComponent} from 'vue';
import {mapState} from "pinia";
// 模块
import AppHeader from '@/module/app-header/index.vue';
// 插件
// 枚举
import PageNameEnum from "@/enumeration/PageNameEnum";
// 常量
import Constant from '@/global/Constant'
// 工具类
import {versionManager, VersionStatus} from "@/components/version-manager";
import {initData} from "@/global/BeanFactory";

export default defineComponent({
    components: {
        // 组件
        AppHeader,
        VersionUpdate: defineAsyncComponent(() => import("@/module/version-update/index.vue")),
        IndexManage: defineAsyncComponent(() => import('@/module/index-manage/index.vue')),
    },
    data: () => {
        return {
            Constant,
            updateDialog: false,
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
        initData().then(() => {
                console.log("初始化完成");
                // 版本
                switch (versionManager()) {
                    case VersionStatus.NEW:
                        this.$router.push(PageNameEnum.MORE_ABOUT)
                        break;
                    case VersionStatus.UPDATE:
                        this.updateDialog = true;
                        break;
                }
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
        async refresh() {
            await useIndexStore().reset();
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
