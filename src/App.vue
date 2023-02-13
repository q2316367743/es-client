<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <a-spin :loading="loading" :tip="text">
        <a-config-provider :locale="locale" size="medium">
            <header id="header" data-tauri-drag-region>
                <div class="left">
                    <div class="logo" data-tauri-drag-region>{{ $t('app.name') }}</div>
                    <div class="full-screen" @click="collapsed = !collapsed">
                        <icon-menu-unfold v-if="collapsed"/>
                        <icon-menu-fold v-else/>
                    </div>
                    <!-- 索引服务器选择 -->
                    <a-select v-model="urlId" :placeholder="$t('app.linkPlaceholder')" size="small" allow-search
                              allow-clear @change="selectUrl" class="url-select" :loading="urlSelectLoading"
                              :show-extra-options="true">
                        <a-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id"/>
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
                    <a-button class="refresh" @click="refresh">{{ $t('common.operation.refresh') }}</a-button>
                </div>
                <div class="right">
                    <!-- 各种信息弹框 -->
                    <info class-name="menu-item"/>
                    <!-- 主题切换 -->
                    <a-button class="menu-item" @click="darkChange" type="text" status="normal">
                        <icon-moon :size="16" v-if="isDark"/>
                        <icon-sun :size="16" v-else/>
                    </a-button>
                    <!-- 多语言切换 -->
                    <a-dropdown @select="languageCommand" trigger="click">
                        <a-button class="menu-item" type="text" status="normal">
                            <icon-language :size="16"/>
                        </a-button>
                        <template #content>
                            <a-doption value="zhCn">中文</a-doption>
                            <a-doption value="enUs">English</a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 版本 -->
                    <a-dropdown @select="versionCommand">
                        <a-button class="menu-item" type="text" status="normal">{{ Constant.version }}</a-button>
                        <template #content>
                            <a-doption value="feedback">{{ $t('app.feedback') }}</a-doption>
                            <a-doption value="log">{{ $t('app.updateRecord') }}</a-doption>
                            <a-doption value="about">{{ $t('app.about') }}</a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 最小化 -->
                    <a-button class="menu-item" :disabled="!optionShow.min"
                              @click="toMin">
                        <template #icon>
                            <icon-minus/>
                        </template>
                    </a-button>
                    <!-- 最大化 -->
                    <a-button class="menu-item" :disabled="!optionShow.max"
                              @click="toMax">
                        <template #icon>
                            <icon-copy/>
                        </template>
                    </a-button>
                    <!-- 关闭 -->
                    <a-button class="menu-item" :disabled="!optionShow.close"
                              @click="toClose">
                        <template #icon>
                            <icon-close/>
                        </template>
                    </a-button>
                </div>
            </header>
            <!-- 左侧菜单 -->
            <div id="main">
                <div id="navigation" :style="{width: collapsed ? '50px' : '184px'}">
                    <a-menu :collapsed="collapsed" v-model:selected-keys="selectedKeys" breakpoint="x1">
                        <a-menu-item :key="PageNameEnum.HOME">
                            <template #icon>
                                <icon-dashboard/>
                            </template>
                            {{ $t('menu.home') }}
                        </a-menu-item>
                        <a-menu-item :key="PageNameEnum.DATA_BROWSER">
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
                        <a-menu-item :key="PageNameEnum.SETTING">
                            <template #icon>
                                <icon-settings/>
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
            <!-- 保存或新增URL弹窗 -->
            <save-or-update-url/>
            <index-manage/>
            <a-modal v-model:visible="updateDialog" :title="$t('app.versionUpdate')"
                     close-on-click-modal append-to-body draggable lock-scroll>
                <version-update v-if="updateDialog"/>
            </a-modal>
            <a-modal v-model:visible="newDialog" :title="$t('app.welcome')" style="height: 90vh;"
                     close-on-click-modal append-to-body draggable lock-scroll top="5vh">
                <a-scrollbar height="calc(80vh - 54px)">
                    <setting-about v-if="newDialog"/>
                </a-scrollbar>
            </a-modal>
            <a-modal v-model:visible="feedbackDialog" :title="$t('app.feedback')" top="25vh"
                     :close-on-click-modal="false" append-to-body draggable lock-scroll>
                <feedback-module v-if="feedbackDialog"/>
            </a-modal>
        </a-config-provider>
    </a-spin>
</template>

<script lang="ts">
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useSettingStore from "@/store/SettingStore";
// 引入框架
import {defineAsyncComponent, defineComponent} from 'vue';
import {mapState} from "pinia";
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-cn';
// 模块
import Info from '@/module/info/index.vue';
// 页面
import Home from '@/page/Home/index.vue';
import DataBrowse from '@/page/DataBrowse/index.vue';
import BaseSearch from '@/page/BaseSearch/index.vue';
import SeniorSearch from '@/page/SeniorSearch/index.vue';
import Setting from '@/page/Setting/index.vue';
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
    toggleDark,
    usePageJumpEvent,
    useUrlEditEvent,
    useUrlSelectEvent,
    versionManage,
    windowStrategyContext
} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import useLoadingStore from "@/store/LoadingStore";

export default defineComponent({
    components: {
        // 页面
        Home, DataBrowse, BaseSearch, SeniorSearch, Setting,
        // 组件
        Info,
        SettingAbout: defineAsyncComponent(() => import("@/page/Setting/components/About.vue")),
        VersionUpdate: defineAsyncComponent(() => import("@/module/VersionUpdate/index.vue")),
        FeedbackModule: defineAsyncComponent(() => import("@/module/Feedback/index.vue")),
        SaveOrUpdateUrl: defineAsyncComponent(() => import("@/module/SaveOrUpdateUrl/index.vue")),
        IndexManage: defineAsyncComponent(() => import('@/module/IndexManage/index.vue')),
    },
    data: () => {
        return {
            urlId: undefined as number | undefined,
            locale: zhCn,
            isDark,
            Constant,
            updateDialog: false,
            newDialog: false,
            feedbackDialog: false,
            collapsed: false,
            selectedKeys: new Array<PageNameEnum>(),
            optionShow: {
                min: true,
                max: true,
                close: true
            },
            urlSelectLoading: true,
            PageNameEnum,
            // 图标
        };
    },
    computed: {
        ...mapState(useUrlStore, ['urls', 'url']),
        ...mapState(useIndexStore, ['name', 'active_shards', 'total_shards', 'status']),
        ...mapState(useSettingStore, ['instance']),
        ...mapState(useLoadingStore, ['loading', 'text']),
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
    },
    created() {
        applicationLaunch.register(async () => {
            this.urlSelectLoading = false;
            // 刷新索引列表
            useUrlStore().reset(() => {
                // utools第一次进入事件
                let code = sessionStorage.getItem('action');
                if (code && code !== 'application') {
                    this.selectUrl(parseInt(code));
                }
                // 删除sessionStorage
                sessionStorage.removeItem('action');
            });
            // 未完全退出事件
            useUrlSelectEvent.on(urlId => this.selectUrl(urlId === 0 ? '' : urlId));

            // 窗口显示获取
            this.optionShow = windowStrategyContext.getStrategy().show();

            // 版本更新处理
            switch (versionManage.checkUpdate()) {
                case 1:
                    this.newDialog = true;
                    break;
                case 2:
                    this.updateDialog = true;
                    break;
            }
            await versionManage.execUpdate();

            this.selectedKeys = [useSettingStore().getDefaultPage];

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
        // 字体判断
        if (Constant.platform === 'edge') {
            // 设置全局字体大小
            document.body.style.fontSize = '20px';
        }
        this.selectMenu(useSettingStore().getDefaultPage);
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
            emitter.emit(MessageEventEnum.PAGE_ACTIVE, index);
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
                case 'feedback':
                    this.feedbackDialog = true;
                    break;
            }
        },
        toMin: () => windowStrategyContext.getStrategy().min(),
        toMax: () => windowStrategyContext.getStrategy().max(),
        toClose: () => windowStrategyContext.getStrategy().close()
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
