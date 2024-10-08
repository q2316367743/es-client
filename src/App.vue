<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <a-layout id="app">
        <!-- 顶部菜单栏 -->
        <app-header/>
        <!-- 主页面 -->
        <a-layout id="main">
            <app-side/>
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
</template>

<script lang="ts" setup>
// 引入状态管理
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import useLoadingStore from "@/store/LoadingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import useUrlStore from "@/store/UrlStore";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import {useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import {useBackupSettingStore} from "@/store/setting/BackupSettingStore";
import useIndexStore from "@/store/IndexStore";
// 引入框架
import {computed, defineAsyncComponent} from 'vue';
import {useRouter} from "vue-router";
// 枚举
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
// 工具类
import {versionManager, VersionStatus} from "@/components/version-manager";
import {getItemByDefault} from "@/utils/utools/DbStorageUtil";
import Assert from "@/utils/Assert";
import {showVersionUpdateDialog} from "@/module/version-update";
import {checkElectronUpdate} from "@/components/version-manager/ElectronUpdate";

const router = useRouter();

const AppHeader = defineAsyncComponent(() => import("@/module/app-header/index.vue"));
const AppSide = defineAsyncComponent(() => import("@/module/app-sider/index.vue"));
const IndexManage = defineAsyncComponent(() => import('@/module/index-manage/index.vue'));

const jsonTheme = computed(() => useGlobalSettingStore().jsonTheme);
const loading = computed(() => useLoadingStore().loading);
const text = computed(() => useLoadingStore().text);

async function initData(): Promise<void> {
    await Promise.all([
        // 设置
        useGlobalSettingStore().init(),
        useEditorSettingStore().init(),
        useBaseSearchSettingStore().init(),
        useBackupSettingStore().init()
    ]);
    return Promise.resolve();
}

// 初始化数据
initData().then(() => {
    console.log("初始化完成");
    // 版本
    switch (versionManager()) {
        case VersionStatus.NEW:
            router.push(PageNameEnum.MORE_ABOUT);
            break;
        case VersionStatus.UPDATE:
            showVersionUpdateDialog()
            router.push(PageNameEnum.MORE_UPDATE);
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
    checkElectronUpdate();
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
