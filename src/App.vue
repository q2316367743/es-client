<template>
    <link :href="`./highlight.js/styles/${jsonTheme}.css`" type="text/css" rel="stylesheet">
    <el-config-provider :locale="locale">
        <header id="header">
            <div class="left">
                <div class="logo">{{ $t('app.name') }}</div>
                <div class="full-screen" @click="toggleFullScreen">
                    <el-icon :size="20">
                        <expand v-if="fullScreen"/>
                        <fold v-else/>
                    </el-icon>
                </div>
                <!-- 索引服务器选择 -->
                <el-select v-model="urlId" :placeholder="$t('app.linkPlaceholder')"
                           clearable @change="selectUrl" class="url-select">
                    <el-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id"/>
                    <el-option :label="$t('common.operation.add')" value="add"/>
                </el-select>
                <!-- 刷新按钮 -->
                <el-button class="refresh" @click="refresh">{{ $t('common.operation.refresh') }}</el-button>
            </div>
            <div class="right">
                <!-- 各种信息弹框 -->
                <div class="menu-item">
                    <info/>
                </div>
                <!-- 主题切换 -->
                <el-button class="menu-item" text link @click="darkChange">
                    <el-icon :size="24">
                        <moon-icon v-if="isDark"/>
                        <sun-icon v-else/>
                    </el-icon>
                </el-button>
                <!-- 多语言切换 -->
                <el-dropdown @command="languageCommand" trigger="click">
                    <el-button class="menu-item" text link>
                        <el-icon :size="20">
                            <translate/>
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="zhCn">中文</el-dropdown-item>
                            <el-dropdown-item command="enUs">English</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <!-- 最小化 -->
                <el-button class="menu-item" text link :icon="minusIcon" @click="toMin"/>
                <!-- 最大化 -->
                <el-button class="menu-item" text link :icon="fullScreenIcon" @click="toMax"/>
                <!-- 关闭 -->
                <el-button class="menu-item" text link :icon="closeIcon" @click="toClose"/>
            </div>
        </header>
        <!-- 左侧菜单 -->
        <div id="main">
            <div id="navigation" :class="fullScreen ? 'full-screen' : ''">
                <div class="nav-list" :class="active === PageNameEnum.HOME ? 'active' : ''"
                     @click="selectMenu(PageNameEnum.HOME)">
                    <span v-if="fullScreen"><el-icon><data-line/></el-icon></span>
                    <span v-else>{{ $t('menu.home') }}</span>
                </div>
                <div class="nav-list" :class="active === PageNameEnum.DATA_BROWSER ? 'active' : ''"
                     @click="selectMenu(PageNameEnum.DATA_BROWSER)">
                    <span v-if="fullScreen"><el-icon><Tickets/></el-icon></span>
                    <span v-else>{{ $t('menu.dataBrowser') }}</span>
                </div>
                <div class="nav-list" :class="active === PageNameEnum.BASE_SEARCH ? 'active' : ''"
                     @click="selectMenu(PageNameEnum.BASE_SEARCH)">
                    <span v-if="fullScreen"><el-icon><search/></el-icon></span>
                    <span v-else>{{ $t('menu.baseSearch') }}</span>
                </div>
                <div class="nav-list" :class="active === PageNameEnum.SENIOR_SEARCH ? 'active' : ''"
                     @click="selectMenu(PageNameEnum.SENIOR_SEARCH)">
                    <span v-if="fullScreen"><el-icon><Filter/></el-icon></span>
                    <span v-else>{{ $t('menu.seniorSearch') }}</span>
                </div>
                <div class="nav-list" :class="active === PageNameEnum.SETTING ? 'active' : ''"
                     @click="selectMenu( PageNameEnum.SETTING)">
                    <span v-if="fullScreen"><el-icon><setting-icon/></el-icon></span>
                    <span v-else>{{ $t('menu.setting') }}</span>
                </div>
                <div class="version">
                    <el-dropdown @command="versionCommand">
                        <el-link>v{{ Constant.version }}</el-link>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="feedback">{{ $t('app.feedback') }}</el-dropdown-item>
                                <el-dropdown-item command="log">{{ $t('app.updateRecord') }}</el-dropdown-item>
                                <el-dropdown-item command="about">{{ $t('app.about') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <!-- 内容-->
            <div id="container" :class="fullScreen ? 'full-screen' : ''">
                <home v-show="active === PageNameEnum.HOME"></home>
                <data-browse v-show="active === PageNameEnum.DATA_BROWSER"></data-browse>
                <base-search v-show="active === PageNameEnum.BASE_SEARCH"></base-search>
                <senior-search v-show="active === PageNameEnum.SENIOR_SEARCH"></senior-search>
                <setting v-show="active === PageNameEnum.SETTING"></setting>
            </div>
        </div>
        <!-- 保存或新增URL弹窗 -->
        <save-or-update-url/>
        <index-manage/>
        <el-dialog v-model="updateDialog" :title="$t('app.versionUpdate')"
                   close-on-click-modal append-to-body draggable lock-scroll>
            <version-update v-if="updateDialog"/>
        </el-dialog>
        <el-dialog v-model="newDialog" :title="$t('app.welcome')" style="height: 90vh;"
                   close-on-click-modal append-to-body draggable lock-scroll top="5vh">
            <el-scrollbar height="calc(80vh - 54px)">
                <setting-about v-if="newDialog"/>
            </el-scrollbar>
        </el-dialog>
        <el-dialog v-model="feedbackDialog" :title="$t('app.feedback')" top="25vh"
                   :close-on-click-modal="false" append-to-body draggable lock-scroll>
            <feedback-module v-if="feedbackDialog"/>
        </el-dialog>
    </el-config-provider>
</template>

<script lang="ts">
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useSettingStore from "@/store/SettingStore";
// 引入框架
import {defineAsyncComponent, defineComponent, markRaw} from 'vue';
import {mapState} from "pinia";
import {
    Close,
    Coin,
    DataBoard,
    DataLine,
    Expand,
    Filter,
    Fold,
    FullScreen,
    HomeFilled,
    Minus,
    Operation,
    Search,
    Setting as SettingIcon,
    Tickets
} from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import {ElNotification} from "element-plus";
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
// 引入自定义图标
import MoonIcon from "@/icon/MoonIcon.vue";
import SunIcon from "@/icon/SunIcon.vue";
import Translate from "@/icon/Translate.vue";
// 工具类
import Optional from "@/utils/Optional";
import Assert from "@/utils/Assert";

import {
    applicationLaunch,
    isDark,
    toggleDark,
    useFullScreen,
    usePageJumpEvent,
    useUrlEditEvent,
    useUrlSelectEvent,
    versionManage, windowStrategyContext
} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";

let showHeightNotification = true;
let showWidthNotification = true;

const MIN_WIDTH = 1000;
const MIN_HEIGHT = 800;

export default defineComponent({
    components: {
        // 自定义图标
        SunIcon, MoonIcon, Translate,
        // element-plus图标
        Fold, Expand, HomeFilled, Search, Operation, Tickets,
        Coin, DataBoard, Filter, SettingIcon, DataLine,
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
            active: PageNameEnum.HOME,
            urlId: undefined as number | undefined,
            locale: zhCn,
            isDark,
            Constant,
            fullScreen: useFullScreen.fullScreen,
            updateDialog: false,
            newDialog: false,
            feedbackDialog: false,
            PageNameEnum,
            // 图标
            minusIcon: markRaw(Minus),
            fullScreenIcon: markRaw(FullScreen),
            closeIcon: markRaw(Close),
            translateIcon: markRaw(Translate)
        };
    },
    computed: {
        ...mapState(useUrlStore, ['urls', 'url']),
        ...mapState(useIndexStore, ['name', 'active_shards', 'total_shards', 'status']),
        ...mapState(useSettingStore, ['instance']),
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
        applicationLaunch.register(async (setText) => {
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

            // 版本更新处理
            switch (versionManage.checkUpdate()) {
                case 1:
                    this.newDialog = true;
                    break;
                case 2:
                    this.updateDialog = true;
                    break;
            }
            await versionManage.execUpdate(setText);
        });

        // 国际化
        let language = useSettingStore().getLanguage;
        if (language === 'zh') {
            this.locale = zhCn;
        } else if (language === 'en') {
            this.locale = en;
        }

        // 执行页面跳转事件
        usePageJumpEvent.on((page: PageNameEnum) => {
            this.selectMenu(page);
        });

        if (Constant.storage !== 'utools') {
            // 检测窗口大小
            this.windowWarningNotification();
            // 窗口调整大小事件
            window.addEventListener('resize', () => {
                this.windowWarningNotification();
            });
        }

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
        toggleFullScreen: useFullScreen.toggle,
        async selectUrl(value: string | number) {
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
                useFullScreen.setFullScreen(true);
            }

        },
        async refresh() {
            await useIndexStore().reset();
            emitter.emit(MessageEventEnum.URL_REFRESH)
        },
        selectMenu(index: PageNameEnum) {
            // 切换active
            this.active = index;
            emitter.emit(MessageEventEnum.PAGE_ACTIVE, index);
        },
        languageCommand(command: string) {
            useSettingStore().setLanguage(command);
            this.$i18n.locale = command;
            if (command === 'zh') {
                this.locale = zhCn;
            } else if (command === 'en') {
                this.locale = en;
            }
        },
        darkChange() {
            toggleDark();
            emitter.emit(MessageEventEnum.SYSTEM_THEME);
        },
        versionCommand(command: string) {
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
        windowWarningNotification() {
            // 窗口警告通知
            if (window.innerWidth < MIN_WIDTH && window.innerHeight < MIN_HEIGHT) {
                if (showWidthNotification && showHeightNotification) {
                    ElNotification({
                        title: this.$t('common.message.warning'),
                        type: 'warning',
                        message: this.$t('app.widthAndHeightMin')
                    });
                    showWidthNotification = false;
                    showHeightNotification = false;
                }
            }

            if (window.innerWidth < MIN_WIDTH) {
                if (showWidthNotification) {
                    ElNotification({
                        title: this.$t('common.message.warning'),
                        type: 'warning',
                        message: this.$t('app.widthMin')
                    });
                    showWidthNotification = false;
                }
            } else {
                showWidthNotification = true
            }
            if (window.innerHeight < MIN_HEIGHT) {
                if (showHeightNotification) {
                    ElNotification({
                        title: this.$t('common.message.warning'),
                        type: 'warning',
                        message: this.$t('app.heightMin')
                    });
                    showHeightNotification = false;
                }
            } else {
                showHeightNotification = true
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
