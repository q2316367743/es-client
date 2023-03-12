<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <a-config-provider :locale="locale" size="medium" global>
        <div id="app" :class="Constant.mode === 'desktop' ? 'desktop' : ''">
            <!-- 顶部菜单栏 -->
            <header id="header" data-tauri-drag-region @click="closeNotification">
                <div class="left">
                    <div class="logo" data-tauri-drag-region>{{ $t('app.name') }}</div>
                    <a-button type="text" status="normal" class="full-screen" @click="collapsed = !collapsed"
                        :disabled="loading">
                        <template #icon>
                            <icon-menu-unfold v-if="collapsed" />
                            <icon-menu-fold v-else />
                        </template>
                    </a-button>
                    <!-- 索引服务器选择 -->
                    <a-select v-model="urlId" :placeholder="$t('app.linkPlaceholder')" size="small" allow-search allow-clear
                        @change="selectUrl" class="url-select" :loading="urlSelectLoading || loading"
                        :show-extra-options="true">
                        <a-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id" />
                        <template #empty>
                            <div style="padding: 6px 0; text-align: center;">
                                <a-button type="primary" @click="selectUrl('add')">{{ $t('common.operation.add') }}
                                </a-button>
                            </div>
                        </template>
                        <template #footer>
                            <div style="padding: 6px 0; text-align: center;">
                                <a-button type="primary" @click="selectUrl('add')">{{ $t('common.operation.add') }}
                                </a-button>
                            </div>
                        </template>
                    </a-select>
                    <!-- 刷新按钮 -->
                    <a-button class="refresh" @click="refresh" :disabled="loading || !urlId || urlId === ''">{{
                        $t('common.operation.refresh')
                    }}
                    </a-button>
                </div>
                <div class="right">
                    <!-- 各种信息弹框 -->
                    <info class-name="menu-item" :disabled="loading" />
                    <!-- 通知中心 -->
                    <a-button class="menu-item" type="text" status="normal" :disabled="loading"
                        @click.stop="openNotification">
                        <a-badge :count="hasRead ? 0 : 1" dot>
                            <icon-notification />
                        </a-badge>
                    </a-button>
                    <!-- 主题切换 -->
                    <a-button class="menu-item" @click="darkChange" type="text" status="normal">
                        <icon-moon :size="16" v-if="isDark" />
                        <icon-sun :size="16" v-else />
                    </a-button>
                    <!-- 多语言切换 -->
                    <a-dropdown @select="languageCommand" trigger="click">
                        <a-button class="menu-item" type="text" status="normal">
                            <icon-language :size="16" />
                        </a-button>
                        <template #content>
                            <a-doption value="zhCn">中文</a-doption>
                            <a-doption value="enUs">English</a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 版本 -->
                    <a-dropdown @select="versionCommand">
                        <a-button class="menu-item" type="text" status="normal" :disabled="loading">{{
                            Constant.version
                        }}
                        </a-button>
                        <template #content>
                            <a-doption value="feedback">{{ $t('app.feedback') }}</a-doption>
                            <a-doption value="log">{{ $t('app.updateRecord') }}</a-doption>
                            <a-doption value="update" v-if="Constant.mode === 'desktop'">检查更新</a-doption>
                            <a-doption value="about">{{ $t('app.about') }}</a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 最小化 -->
                    <a-button class="menu-item" :disabled="!optionShow.min || urlSelectLoading" v-if="optionShow.visibility"
                        @click="toMin">
                        <template #icon>
                            <icon-minus />
                        </template>
                    </a-button>
                    <!-- 最大化 -->
                    <a-button class="menu-item" :disabled="!optionShow.max || urlSelectLoading" v-if="optionShow.visibility"
                        @click="toMax">
                        <template #icon>
                            <icon-copy />
                        </template>
                    </a-button>
                    <!-- 关闭 -->
                    <a-button class="menu-item" :disabled="!optionShow.close || urlSelectLoading"
                        v-if="optionShow.visibility" @click="toClose">
                        <template #icon>
                            <icon-close />
                        </template>
                    </a-button>
                </div>
            </header>
            <a-spin :loading="loading" :tip="text" class="global-spin">
                <!-- 主页面 -->
                <div id="main">
                    <div id="navigation" :style="{ width: collapsed ? '50px' : '184px' }">
                        <a-menu :collapsed="collapsed" v-model:selected-keys="selectedKeys" breakpoint="x1">
                            <a-menu-item :key="PageNameEnum.HOME">
                                <template #icon>
                                    <icon-home />
                                </template>
                                {{ $t('menu.home') }}
                            </a-menu-item>
                            <a-menu-item :key="PageNameEnum.DATA_BROWSER">
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
                            <a-menu-item :key="PageNameEnum.SETTING">
                                <template #icon>
                                    <icon-settings />
                                </template>
                                {{ $t('menu.setting') }}
                            </a-menu-item>
                        </a-menu>
                    </div>
                    <!-- 内容-->
                    <div id="container">
                        <home v-show="selectedKeys[0] === PageNameEnum.HOME"></home>
                        <data-browse v-show="selectedKeys[0] === PageNameEnum.DATA_BROWSER"></data-browse>
                        <base-search v-show="selectedKeys[0] === PageNameEnum.BASE_SEARCH"></base-search>
                        <senior-search v-show="selectedKeys[0] === PageNameEnum.SENIOR_SEARCH"></senior-search>
                        <setting v-show="selectedKeys[0] === PageNameEnum.SETTING"></setting>
                    </div>
                </div>
            </a-spin>
        </div>
        <!-- 保存或新增URL弹窗 -->
        <save-or-update-url />
        <index-manage />
        <a-modal v-model:visible="updateDialog" :title="$t('app.versionUpdate')" mask-closable draggable lock-scroll
            width="600px">
            <version-update v-if="updateDialog" />
        </a-modal>
        <a-modal v-model:visible="newDialog" :title="$t('app.welcome')" class="es-dialog" mask-closable render-to-body
            draggable top="5vh" width="600px">
            <a-scrollbar height="calc(80vh - 54px)">
                <setting-about v-if="newDialog" />
            </a-scrollbar>
        </a-modal>
        <a-modal v-model:visible="feedbackDialog" :title="$t('app.feedback')" top="25vh" :close-on-click-modal="false"
            render-to-body draggable unmount-on-close>
            <feedback-module v-if="feedbackDialog" />
        </a-modal>
        <notification-manage v-model="notificationDrawer" />
    </a-config-provider>
</template>

<script lang="ts">
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useSettingStore from "@/store/SettingStore";
// 引入框架
import { defineAsyncComponent, defineComponent } from 'vue';
import { mapState } from "pinia";
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-cn';
// 模块
import Info from '@/module/info/index.vue';
// 页面
import Home from '@/page/Home/index.vue';
// 插件
import emitter from '@/plugins/mitt';
// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
// 常量
import Constant from '@/global/Constant'
// 工具类
import Optional from "@/utils/Optional";
import Assert from "@/utils/Assert";

import {
    applicationLaunch,
    isDark,
    lodisStrategyContext,
    nativeStrategyContext,
    toggleDark,
    usePageJumpEvent,
    useUrlEditEvent,
    useUrlSelectEvent,
    versionManage,
    windowStrategyContext
} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import useLoadingStore from "@/store/LoadingStore";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import WindowStrategyUtil from "@/strategy/WindowStrategy/WindowStrategyUtil";
import useNotificationStore from "@/store/NotificationStore";

export default defineComponent({
    components: {
        // 页面
        Home,
        DataBrowse: defineAsyncComponent(() => import('@/page/DataBrowse/index.vue')),
        BaseSearch: defineAsyncComponent(() => import('@/page/BaseSearch/index.vue')),
        SeniorSearch: defineAsyncComponent(() => import('@/page/SeniorSearch/index.vue')),
        Setting: defineAsyncComponent(() => import('@/page/Setting/index.vue')),
        // 组件
        Info,
        SettingAbout: defineAsyncComponent(() => import("@/page/Setting/components/About.vue")),
        VersionUpdate: defineAsyncComponent(() => import("@/module/VersionUpdate/index.vue")),
        FeedbackModule: defineAsyncComponent(() => import("@/module/Feedback/index.vue")),
        SaveOrUpdateUrl: defineAsyncComponent(() => import("@/module/SaveOrUpdateUrl/index.vue")),
        IndexManage: defineAsyncComponent(() => import('@/module/IndexManage/index.vue')),
        NotificationManage: defineAsyncComponent(() => import('@/module/NotificationManage/index.vue')),
    },
    data: () => {
        return {
            urlId: undefined as number | string | undefined,
            locale: zhCn,
            isDark,
            Constant,
            updateDialog: false,
            newDialog: false,
            feedbackDialog: false,
            collapsed: false,
            selectedKeys: new Array<PageNameEnum>(),
            // 窗口操作展示
            optionShow: WindowStrategyUtil(),
            urlSelectLoading: true,
            notificationDrawer: false,
            PageNameEnum,
            // 图标
        };
    },
    computed: {
        ...mapState(useUrlStore, ['urls', 'url']),
        ...mapState(useIndexStore, ['name', 'active_shards', 'total_shards', 'status']),
        ...mapState(useSettingStore, ['instance']),
        ...mapState(useLoadingStore, ['loading', 'text']),
        ...mapState(useNotificationStore, ['hasRead']),
        jsonTheme() {
            if (isDark.value) {
                return Optional.ofNullable(this.instance.jsonThemeByDark).orElse('atom-one-dark');
            } else {
                return Optional.ofNullable(this.instance.jsonThemeByLight).orElse('github');
            }
        }
    },
    watch: {
        url() {
            this.urlId = this.url?.id!;
        },
        selectedKeys(newValue: any[]) {
            emitter.emit(MessageEventEnum.PAGE_ACTIVE, newValue[0]);
        },
        urlId(newValue) {
            if (newValue && typeof newValue === 'number') {
                lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.LAST_URL, newValue + '');
            }
        }
    },
    created() {
        applicationLaunch.register(async () => {
            console.log('开始执行应用启动后任务')
            // 刷新索引列表
            useUrlStore().reset(() => {
                // url渲染成功
                this.urlSelectLoading = false;
                // utools/vscode第一次进入事件
                let code = sessionStorage.getItem('action');
                console.log('当前的code：', code)
                if (code && code !== 'application') {
                    let id = parseInt(code);
                    if (Number.isInteger(id)) {
                        this.selectUrl(id);
                    }
                } else {
                    // 如果是utils，但是从应用进来，或者不是utils（因为只有utils存在action）
                    // 如果展示历史
                    if (useSettingStore().getLastUrl) {
                        lodisStrategyContext.getStrategy().get<string>(LocalStorageKeyEnum.LAST_URL)
                            .then(value => {
                                if (value) {
                                    let id = parseInt(value);
                                    if (Number.isInteger(id)) {
                                        this.selectUrl(id);
                                    }
                                }
                            });
                    }
                }
                // 删除sessionStorage
                sessionStorage.removeItem('action');
                // vscode事件
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message['type'] === 'url-open') {
                        let id = parseInt(message['content']);
                        if (Number.isInteger(id)) {
                            this.selectUrl(id);
                        }
                    }
                });
            });
            // 未完全退出事件
            useUrlSelectEvent.on(urlId => this.selectUrl(urlId === 0 ? '' : urlId));

            // 版本更新处理
            switch (versionManage.checkBasicUpdate()) {
                case 1:
                    this.newDialog = true;
                    break;
                case 2:
                    this.updateDialog = true;
                    break;
            }
            await versionManage.execUpdate();

            this.selectMenu(useSettingStore().getDefaultPage);

        });

        // 国际化
        let language = useSettingStore().getLanguage;
        if (language === 'zh') {
            this.locale = zhCn;
        } else if (language === 'en') {
            this.locale = enUS;
        }

        // 执行页面跳转事件
        usePageJumpEvent.on((page: PageNameEnum) => {
            this.selectMenu(page);
        });

        // 执行窗口刷新事件
        emitter.on(MessageEventEnum.REFRESH_URL, () => {
            this.refresh();
        });

        // 打开通知中心
        emitter.on(MessageEventEnum.OPEN_NOTIFICATION_MANAGE, () => {
            this.openNotification()
        });

        if (Constant.platform === 'vscode') {
            // vscode需要实现主题自适应
            let theme = document.body.className;
            if (theme === 'vscode-light') {
                // 浅色主题
                isDark.value = false;
            } else if (theme === 'vscode-dark') {
                // 黑夜主题
                isDark.value = true;
            }
        } else if (Constant.platform === 'utools') {
            // utools自适应主题
            if (window.utools && utools && utools.isDarkColors) {
                // 黑夜主题
                isDark.value = utools.isDarkColors();
            }
        }
    },
    methods: {
        async selectUrl(value: any) {
            // 新增，打开新增面板
            if (value === 'add') {
                this.urlId = undefined;
                useUrlEditEvent.emit();
                return;
            }
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
            emitter.emit(MessageEventEnum.URL_UPDATE);
            // 选择链接后判断自动全屏
            if (useSettingStore().getAutoFullScreen) {
                this.collapsed = true;
            }

        },
        async refresh() {
            await useIndexStore().reset();
            emitter.emit(MessageEventEnum.URL_REFRESH)
        },
        selectMenu(index: PageNameEnum) {
            // 切换active
            this.selectedKeys = [index];
        },
        languageCommand(command: any) {
            useSettingStore().setLanguage(command);
            this.$i18n.locale = command;
            if (command === 'zh') {
                this.locale = zhCn;
            } else if (command === 'en') {
                this.locale = enUS;
            }
        },
        darkChange() {
            toggleDark();
            emitter.emit(MessageEventEnum.SYSTEM_THEME);
        },
        versionCommand(command: any) {
            switch (command) {
                case 'about':
                    this.selectMenu(PageNameEnum.SETTING);
                    emitter.emit(MessageEventEnum.PAGE_SETTING_ACTIVE, 'about');
                    break;
                case 'log':
                    this.selectMenu(PageNameEnum.SETTING);
                    emitter.emit(MessageEventEnum.PAGE_SETTING_ACTIVE, 'update');
                    break;
                case 'update':
                    nativeStrategyContext.getStrategy().checkUpdate();
                    break;
                case 'feedback':
                    this.feedbackDialog = true;
                    break;
            }
        },
        toMin: () => windowStrategyContext.getStrategy().min(),
        toMax: () => windowStrategyContext.getStrategy().max(),
        toClose: () => windowStrategyContext.getStrategy().close(),
        openNotification() {
            this.notificationDrawer = true;
            useNotificationStore().read();
        },
        closeNotification() {
            this.notificationDrawer = false;
        }
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
