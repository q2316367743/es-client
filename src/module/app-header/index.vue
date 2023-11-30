<template>
    <a-layout-header id="header">
        <div class="left">
            <a-tooltip :content="shards" :background-color="color">
                <div class="logo" :style="{color: color}" :title="name || $t('app.name')">{{ name || $t('app.name') }}</div>
            </a-tooltip>
            <!-- 索引服务器选择 -->
            <a-select v-model="urlId" placeholder="请选择链接" size="small" allow-search allow-clear @change="selectUrl"
                      class="url-select" :show-extra-options="true">
                <a-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id"/>
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
            <!-- 控制台 -->
            <app-bug/>
            <!-- 各种信息弹框 -->
            <app-info class-name="menu-item" :disabled="loading"/>
            <!-- 主题切换 -->
            <a-dropdown>
                <a-button class="menu-item" type="text" status="normal">
                    <template #icon>
                        <icon-sun v-if="darkType === DarkTypeEnum.LIGHT"/>
                        <icon-moon v-else-if="darkType === DarkTypeEnum.DARK"/>
                        <icon-palette v-else/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption @click="switchDarkColors(DarkTypeEnum.LIGHT)">
                        <template #icon>
                            <icon-sun/>
                        </template>
                        日间
                    </a-doption>
                    <a-doption @click="switchDarkColors(DarkTypeEnum.DARK)">
                        <template #icon>
                            <icon-moon/>
                        </template>
                        黑夜
                    </a-doption>
                    <a-doption @click="switchDarkColors(DarkTypeEnum.AUTO)">
                        <template #icon>
                            <icon-palette/>
                        </template>
                        跟随系统
                    </a-doption>
                </template>
            </a-dropdown>
            <!-- 版本 -->
            <a-dropdown @select="versionCommand" position="br">
                <a-button class="menu-item" type="text" status="normal" :disabled="loading" style="padding: 0 7px;">
                    {{ Constant.version }}
                </a-button>
                <template #content>
                    <a-doption value="feedback">{{ $t('app.feedback') }}</a-doption>
                    <a-doption value="log">{{ $t('app.updateRecord') }}</a-doption>
                    <a-doption value="about">关于</a-doption>
                </template>
            </a-dropdown>
        </div>
        <!-- 问题反馈 -->
        <a-modal v-model:visible="feedbackDialog" title="问题反馈" top="25vh" :close-on-click-modal="false"
                 render-to-body
                 draggable unmount-on-close :footer="false">
            <feedback-module v-if="feedbackDialog"/>
        </a-modal>
    </a-layout-header>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import Constant from '@/global/Constant';
// 枚举
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalNameEnum from '@/enumeration/LocalNameEnum';
// 组件
import FeedbackModule from "@/module/Feedback/index.vue";
import AppInfo from './app-info.vue';
import AppBug from '@/module/app-bug/index.vue';
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useLoadingStore from "@/store/LoadingStore";
import {DarkTypeEnum, useGlobalStore} from "@/store/GlobalStore";
// 工具类
import Assert from "@/utils/Assert";
import {setItem} from '@/utils/utools/DbStorageUtil';

const router = useRouter();

const urlId = ref<number | string | undefined>(useUrlStore().id);
const feedbackDialog = ref<boolean>(false);

const urls = computed(() => useUrlStore().urls);
const loading = computed(() => useLoadingStore().loading);
const darkType = computed(() => useGlobalStore().darkType);
const name = computed(() => useIndexStore().name);
const color = computed(() => {
    const status = useIndexStore().status;
    if (status === 'yellow') {
        return 'rgb(var(--orange-6))';
    } else if (status === 'green') {
        return 'rgb(var(--green-6))';
    } else if (status === 'red') {
        return 'rgb(var(--red-6))';
    }
    return 'var(--color-text-1)';
});
const shards = computed(() => `分片：${useIndexStore().active_shards} / ${useIndexStore().total_shards}`)

watch(() => urlId.value, value => setItem(LocalNameEnum.KEY_LAST_URL, value));
watch(() => useUrlStore().id, value => {
    if (value !== urlId.value) {
        urlId.value = value;
    }
})

const refresh = () => useIndexStore().reset();
const switchDarkColors = useGlobalStore().switchDarkColors;

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
