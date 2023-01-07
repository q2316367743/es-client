<template>
    <el-config-provider :locale="locale">
        <!-- 左侧菜单 -->
        <div id="navigation" :class="fullScreen ? 'full-screen' : ''">
            <div class="logo">
                <div v-if="!fullScreen">ES-client</div>
                <div style="padding-top: 3px;cursor:pointer;" @click="fullScreenSwitch">
                    <el-icon :size="20">
                        <expand v-if="fullScreen"/>
                        <fold v-else/>
                    </el-icon>
                </div>
            </div>
            <div class="nav-list" :class="active === PageNameEnum.HOME ? 'active' : ''"
                 @click="selectMenu(PageNameEnum.HOME)">
                <span v-if="fullScreen"><el-icon><data-line/></el-icon></span>
                <span v-else>{{ $t('app.menu.home') }}</span>
            </div>
            <div class="nav-list" :class="active === PageNameEnum.DATA_BROWSER ? 'active' : ''"
                 @click="selectMenu(PageNameEnum.DATA_BROWSER)">
                <span v-if="fullScreen"><el-icon><Tickets/></el-icon></span>
                <span v-else>{{ $t('app.menu.data_browse') }}</span>
            </div>
            <div class="nav-list" :class="active === PageNameEnum.BASE_SEARCH ? 'active' : ''"
                 @click="selectMenu(PageNameEnum.BASE_SEARCH)">
                <span v-if="fullScreen"><el-icon><search/></el-icon></span>
                <span v-else>{{ $t('app.menu.base_search') }}</span>
            </div>
            <div class="nav-list" :class="active === PageNameEnum.SENIOR_SEARCH ? 'active' : ''"
                 @click="selectMenu(PageNameEnum.SENIOR_SEARCH)">
                <span v-if="fullScreen"><el-icon><Filter/></el-icon></span>
                <span v-else>{{ $t('app.menu.senior_search') }}</span>
            </div>
            <div class="nav-list" :class="active === PageNameEnum.SETTING ? 'active' : ''"
                 @click="selectMenu( PageNameEnum.SETTING)">
                <span v-if="fullScreen"><el-icon><setting-icon/></el-icon></span>
                <span v-else>{{ $t('app.menu.setting') }}</span>
            </div>
            <div class="dark" v-if="fullScreen">
                <div class="nav-list" @click="darkChange">
                    <i class="vxe-icon-moon" v-if="isDark"></i>
                    <i class="vxe-icon-sunny" v-else></i>
                </div>
            </div>
            <div class="version" v-else>
                <el-dropdown @command="versionCommand">
                    <el-link>v{{ Constant.version }}</el-link>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="feedback">意见反馈</el-dropdown-item>
                            <el-dropdown-item command="log">更新日志</el-dropdown-item>
                            <el-dropdown-item command="about">关于</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <!-- 顶部-->
        <div id="index" :class="fullScreen ? 'full-screen' : ''">
            <!-- 索引服务器选择 -->
            <el-select v-model="urlId" :placeholder="$t('app.link_placeholder')" style="padding-top: 9px;"
                       clearable @change="selectUrl">
                <el-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id">
                </el-option>
                <el-option :label="$t('app.add')" value="add"></el-option>
            </el-select>
            <!-- 刷新按钮 -->
            <el-button @click="refresh">{{ $t('app.refresh') }}</el-button>
        </div>
        <!-- 索引标题 -->
        <div id="title" :class="fullScreen ? 'full-screen' : ''" v-if="name !== ''">
            <!-- 服务器名称 -->
            <div class="cluster-name">{{ name }}</div>
            <!-- 服务器状态 -->
            <div class="server-status">{{ $t('app.cluster_health') }}: {{ status }}
                ({{ active_shards }} of {{ total_shards }})
            </div>
        </div>
        <div id="menu" :class="fullScreen ? 'full-screen' : ''">
            <!-- 主题切换 -->
            <div class="menu-item" @click="darkChange">
                <el-icon :size="24">
                    <moon-icon v-if="isDark"/>
                    <sun-icon v-else/>
                </el-icon>
            </div>
            <!-- 多语言切换 -->
            <el-dropdown @command="languageCommand" trigger="click">
                <div class="menu-item">
                    <el-icon :size="24">
                        <translate></translate>
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="zh">中文</el-dropdown-item>
                        <el-dropdown-item command="en">English</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 各种信息弹框 -->
            <div class="menu-item">
                <info></info>
            </div>
        </div>
        <!-- 内容-->
        <div id="main" :class="fullScreen ? 'full-screen' : ''">
            <home v-show="active === PageNameEnum.HOME"></home>
            <data-browse v-show="active === PageNameEnum.DATA_BROWSER"></data-browse>
            <base-search v-show="active === PageNameEnum.BASE_SEARCH"></base-search>
            <senior-search v-show="active === PageNameEnum.SENIOR_SEARCH"></senior-search>
            <setting v-show="active === PageNameEnum.SETTING"></setting>
        </div>
        <!-- 保存或新增URL弹窗 -->
        <save-or-update-url v-model="urlDialog"></save-or-update-url>
        <el-dialog v-model="updateDialog" title="版本更新"
                   close-on-click-modal append-to-body draggable lock-scroll>
            <version-update/>
        </el-dialog>
        <el-dialog v-model="newDialog" title="点击左下角版本可以查看关于、更新记录以及进行建议反馈" style="height: 90vh;"
                   close-on-click-modal append-to-body draggable lock-scroll top="5vh">
            <el-scrollbar height="calc(80vh - 54px)">
                <setting-about/>
            </el-scrollbar>
        </el-dialog>
        <el-dialog v-model="feedbackDialog" title="问题反馈" top="25vh"
                   :close-on-click-modal="false" append-to-body draggable lock-scroll>
            <feedback-module/>
        </el-dialog>
    </el-config-provider>
</template>

<script lang="ts">
// 引入状态管理
import useUrlStore from "@/store/UrlStore";
import useIndexStore from '@/store/IndexStore';
import useSettingStore from "@/store/SettingStore";
// 引入框架
import {defineComponent} from 'vue';
import {mapState} from "pinia";
import {
    Coin,
    DataBoard,
    DataLine,
    Expand,
    Filter,
    Fold,
    HomeFilled,
    Operation,
    Search,
    Setting as SettingIcon,
    Tickets
} from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
// 引入页面组件
import JsonDialog from "@/components/JsonDialog.vue";
import Translate from "@/icon/Translate.vue";
import SaveOrUpdateUrl from '@/module/SaveOrUpdateUrl/index.vue';
// 模块
import Info from '@/module/info/index.vue';
import VersionUpdate from "@/module/VersionUpdate/index.vue";
import FeedbackModule from "@/module/Feedback/index.vue";
// 页面
import Home from "./page/Home/index.vue";
import BaseSearch from "@/page/BaseSearch/index.vue";
import SeniorSearch from '@/page/SeniorSearch/index.vue';
import Setting from '@/page/Setting/index.vue'
import DataBrowse from '@/page/DataBrowse/index.vue';
import SettingAbout from "@/page/Setting/components/About.vue";
// 插件
import emitter from '@/plugins/mitt';
// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
// 常量
import Constant from '@/global/Constant'
// 引入自定义图标
import MoonIcon from "@/icon/MoonIcon.vue";
import SunIcon from "@/icon/SunIcon.vue";
import {isDark, toggleDark, usePageJumpEvent, versionManage} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";

export default defineComponent({
    components: {
        SettingAbout,
        SunIcon, VersionUpdate, FeedbackModule,
        MoonIcon,
        Info, Setting, Home, BaseSearch, SeniorSearch, Filter,
        Fold, Expand, HomeFilled, Search, Operation, Tickets,
        Coin, DataBoard, JsonDialog, Translate, DataBrowse, SaveOrUpdateUrl, SettingIcon, DataLine
    },
    data: () => {
        return {
            active: PageNameEnum.HOME,
            urlId: undefined as number | undefined,
            urlDialog: false,
            locale: zhCn,
            isDark,
            Constant,
            fullScreen: false,
            updateDialog: false,
            newDialog: false,
            feedbackDialog: false,
            PageNameEnum
        };
    },
    computed: {
        ...mapState(useUrlStore, ['urls', 'url']),
        ...mapState(useIndexStore, ['name', 'active_shards', 'total_shards', 'status'])
    },
    watch: {
        url() {
            this.urlId = this.url?.id!;
        }
    },
    created() {
        useUrlStore().reset();
        let language = useSettingStore().getLanguage;
        if (language === 'zh') {
            this.locale = zhCn;
        } else if (language === 'en') {
            this.locale = en;
        }
        this.$nextTick(() => {
            switch (versionManage.checkUpdate()) {
                case 1:
                    this.newDialog = true;
                    break;
                case 2:
                    this.updateDialog = true;
                    break;
            }
            versionManage.execUpdate();
        });
        usePageJumpEvent.on((page: string) => {
            this.selectMenu(page);
        })
    },
    methods: {
        async selectUrl(value: string | number) {
            if (value === 'add') {
                // 新增，打开新增面板
                this.urlId = undefined;
                this.urlDialog = true;
                return;
            }
            emitter.emit(MessageEventEnum.URL_UPDATE);
            // 先进性索引刷新
            // 选择索引
            await useUrlStore().choose(value as number);
            // 索引刷新
            await useIndexStore().reset();

            // 当刷新完成之后，在发送消息
            // 选择一个有效的链接
            if (typeof value === 'number') {
                emitter.emit(MessageEventEnum.INDEX_CONNECT);
                // 选择链接
                if (useSettingStore().getAutoFullScreen) {
                    this.fullScreen = true;
                }
            } else {
                emitter.emit(MessageEventEnum.INDEX_CLEAN);
            }
        },
        async refresh() {
            await useIndexStore().reset();
            emitter.emit(MessageEventEnum.INDEX_REFRESH)
        },
        selectMenu(index: string) {
            // 切换active
            this.active = index as PageNameEnum;
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
        fullScreenSwitch() {
            this.fullScreen = !this.fullScreen;
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
