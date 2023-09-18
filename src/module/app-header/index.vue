<template>
    <a-layout-header id="header">
        <div class="left">
            <div class="logo">{{ $t('app.name') }}</div>
            <!-- 索引服务器选择 -->
            <a-select v-model="urlId" placeholder="请选择链接" size="small" allow-search allow-clear @change="selectUrl"
                class="url-select" :show-extra-options="true">
                <a-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id" />
                <template #empty>
                    <div style="padding: 6px 0; text-align: center;">
                        <a-button type="primary" @click="jumpToAddUrl()">新增链接</a-button>
                    </div>
                </template>
                <template #footer>
                    <div style="padding: 6px 0; text-align: center;">
                        <a-button type="primary" @click="jumpToAddUrl()">
                            新增链接
                        </a-button>
                    </div>
                </template>
            </a-select>
            <!-- 刷新按钮 -->
            <a-button class="refresh" @click="refresh()" :disabled="loading || !urlId || urlId === ''">{{
                $t('common.operation.refresh')
            }}
            </a-button>
        </div>
        <div class="right">
            <!-- 各种信息弹框 -->
            <app-info class-name="menu-item" :disabled="loading" />
            <!-- 主题切换 -->
            <a-button class="menu-item" @click="switchDarkColors()" type="text" status="normal">
                <template #icon>
                    <icon-moon :size="16" v-if="isDark" />
                    <icon-sun :size="16" v-else />
                </template>
            </a-button>
            <!-- 版本 -->
            <a-dropdown @select="versionCommand" position="br">
                <a-button class="menu-item" type="text" status="normal" :disabled="loading">{{
                    Constant.version
                }}
                </a-button>
                <template #content>
                    <a-doption value="feedback">{{ $t('app.feedback') }}</a-doption>
                    <a-doption value="log">{{ $t('app.updateRecord') }}</a-doption>
                    <a-doption value="about">关于</a-doption>
                </template>
            </a-dropdown>
        </div>
        <!-- 问题反馈 -->
        <a-modal v-model:visible="feedbackDialog" title="问题反馈" top="25vh" :close-on-click-modal="false" render-to-body
            draggable unmount-on-close :footer="false">
            <feedback-module v-if="feedbackDialog" />
        </a-modal>
    </a-layout-header>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Constant from '@/global/Constant';
// 枚举
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalNameEnum from '@/enumeration/LocalNameEnum';
// 组件
import FeedbackModule from "@/module/Feedback/index.vue";
import AppInfo from './app-info.vue';
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useLoadingStore from "@/store/LoadingStore";
import { useGlobalStore } from "@/store/GlobalStore";
// 工具类
import Assert from "@/utils/Assert";
import { setItem } from '@/utils/utools/DbStorageUtil';

const router = useRouter();

const urlId = ref<number | string | undefined>(undefined);
const feedbackDialog = ref<boolean>(false);

const urls = computed(() => useUrlStore().urls);
const loading = computed(() => useLoadingStore().loading);
const isDark = computed(() => useGlobalStore().isDark);

watch(() => urlId.value, value => setItem(LocalNameEnum.KEY_LAST_URL, value))

const refresh = () => useIndexStore().reset();
const switchDarkColors = () => useGlobalStore().switchDarkColors();

async function selectUrl(value: any) {
    // 清空链接
    if (value === '') {
        // 清空链接选择
        useUrlStore().clear();
        // 清空索引信息
        useIndexStore().clear();
        // 发哦送清空事件
        return
    }
    // 选择链接
    Assert.isTrue(useUrlStore().choose(value as number), "链接未找到");
    // 索引刷新
    await useIndexStore().reset();
}

function jumpToAddUrl() {
    router.push({
        path: PageNameEnum.SETTING_URL,
        query: {
            method: 'add'
        }
    })
}

function versionCommand(command: any) {
    switch (command) {
        case 'about':
            router.push(PageNameEnum.MORE_ABOUT)
            break;
        case 'log':
            router.push(PageNameEnum.MORE_UPDATE)
            break;
        case 'update':
            alert('检查更新')
            break;
        case 'feedback':
            feedbackDialog.value = true;
            break;
    }
}

</script>
<style scoped></style>
