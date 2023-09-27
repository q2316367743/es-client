<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <a-config-provider size="medium" global>
        <a-layout id="app" :class="Constant.mode === 'desktop' ? 'desktop' : ''">
            <!-- 顶部菜单栏 -->
            <app-header/>
            <!-- 主页面 -->
            <a-layout id="main">
                <a-layout-sider :collapsed="collapsed" :width="150" :collapsed-width="50">
                    <app-sider />
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
        <version-update v-if="updateDialog" v-model:visible="updateDialog"/>
        <!-- 数据导出 -->
        <app-data-export/>
    </a-config-provider>
</template>

<script lang="ts" setup>
// 引入状态管理
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import useLoadingStore from "@/store/LoadingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import useUrlStore from "@/store/UrlStore";
// 引入框架
import {computed, defineAsyncComponent, ref} from 'vue';
import {useRouter} from "vue-router";
// 模块
import AppHeader from '@/module/app-header/index.vue';
import AppSider from '@/module/app-sider/index.vue';
// 枚举
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
// 常量
import Constant from '@/global/Constant'
import {initData} from "@/global/BeanFactory";
// 工具类
import {versionManager, VersionStatus} from "@/components/version-manager";
import {getItemByDefault} from "@/utils/utools/DbStorageUtil";
import Assert from "@/utils/Assert";
import useIndexStore from "@/store/IndexStore";

const router = useRouter();

const AppDataExport = defineAsyncComponent(() => import("@/module/app-data-export/index.vue"));
const VersionUpdate = defineAsyncComponent(() => import("@/module/version-update/index.vue"));
const IndexManage = defineAsyncComponent(() => import('@/module/index-manage/index.vue'));

const updateDialog = ref(false);

const jsonTheme = computed(() => useGlobalSettingStore().jsonTheme);
const collapsed = computed(() => useGlobalStore().collapsed);
const loading = computed(() => useLoadingStore().loading);
const text = computed(() => useLoadingStore().text);

// 初始化数据
initData().then(() => {
    console.log("初始化完成");
    // 版本
    switch (versionManager()) {
        case VersionStatus.NEW:
            router.push(PageNameEnum.MORE_ABOUT)
            break;
        case VersionStatus.UPDATE:
            updateDialog.value = true;
            break;
    }
    // 最后的链接
    if (useGlobalSettingStore().getLastUrl) {
        const lastUrlId = getItemByDefault(LocalNameEnum.KEY_LAST_URL, 0);
        if (lastUrlId !== 0) {
            useUrlStore().choose(lastUrlId);
            // 选择链接
            Assert.isTrue(useUrlStore().choose(lastUrlId), "链接未找到");
            // 索引刷新
            useIndexStore().reset();
        }
    }
});
// 初始化主题
useGlobalStore().initDarkColors();


</script>

<style lang="less">
.app-feedback {
    width: calc(100vw - 40px);
    height: calc(100vh - 58px - 60px);
    border: none;
}
</style>
