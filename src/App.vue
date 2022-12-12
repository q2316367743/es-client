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
            <div class="menu-list" :class="active === 'home' ? 'active' : ''" @click="selectMenu('home')">
                <span v-if="fullScreen"><el-icon><data-line/></el-icon></span>
                <span v-else>{{ $t('app.menu.home') }}</span>
            </div>
            <div class="menu-list" :class="active === 'data browse' ? 'active' : ''" @click="selectMenu('data browse')">
                <span v-if="fullScreen"><el-icon><Tickets/></el-icon></span>
                <span v-else>{{ $t('app.menu.data_browse') }}</span>
            </div>
            <div class="menu-list" :class="active === 'base search' ? 'active' : ''" @click="selectMenu('base search')">
                <span v-if="fullScreen"><el-icon><search/></el-icon></span>
                <span v-else>{{ $t('app.menu.base_search') }}</span>
            </div>
            <div class="menu-list" :class="active === 'senior search' ? 'active' : ''"
                 @click="selectMenu('senior search')">
                <span v-if="fullScreen"><el-icon><Filter/></el-icon></span>
                <span v-else>{{ $t('app.menu.senior_search') }}</span>
            </div>
            <div class="menu-list" :class="active === 'setting' ? 'active' : ''" @click="selectMenu('setting')">
                <span v-if="fullScreen"><el-icon><setting-icon/></el-icon></span>
                <span v-else>{{ $t('app.menu.setting') }}</span>
            </div>
            <div class="version">
                <div style="margin-top: 5px">
                    <el-link @click="aboutDialog = true">v{{ Constant.version }}</el-link>
                </div>
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
            <!-- 服务器名称 -->
            <div class="cluster-name">{{ name }}</div>
            <!-- 服务器状态 -->
            <div class="server-status" v-if="name !== ''">{{ $t('app.cluster_health') }}: {{ status }}
                ({{ active_shards }} of {{ total_shards }})
            </div>
        </div>
        <div id="menu" :class="fullScreen ? 'full-screen' : ''">
            <!-- 多语言切换 -->
            <el-dropdown @command="languageCommand">
                <translate style="padding-top: 18px;font-size: 16px;cursor: pointer"></translate>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="zh">中文</el-dropdown-item>
                        <el-dropdown-item command="en">English</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 各种信息弹框 -->
            <info></info>
        </div>
        <!-- 内容-->
        <div id="main" :class="fullScreen ? 'full-screen' : ''">
            <home v-show="active === 'home'"></home>
            <data-browse v-show="active === 'data browse'"></data-browse>
            <base-search v-show="active === 'base search'"></base-search>
            <senior-search v-show="active === 'senior search'"></senior-search>
            <setting v-show="active === 'setting'"></setting>
        </div>
        <!-- 关于弹窗 -->
        <el-dialog :title="$t('app.about')" v-model="aboutDialog" width="70%" append-to-body custom-class="es-dialog"
                   :close-on-click-modal="false" top="10vh" draggable>
            <about></about>
        </el-dialog>
        <!-- 保存或新增URL弹窗 -->
        <save-or-update-url v-model="urlDialog"></save-or-update-url>
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
import SaveOrUpdateUrl from '@/components/SaveOrUpdateUrl/index.vue';
// 模块
import Info from '@/module/info/index.vue';
// 页面
import About from "@/page/About/index.vue";
import Home from "./page/Home/index.vue";
import BaseSearch from "@/page/BaseSearch/index.vue";
import SeniorSearch from '@/page/SeniorSearch/index.vue';
import Setting from '@/page/Setting/index.vue'
import DataBrowse from '@/page/DataBrowse/index.vue';
// 插件
import emitter from '@/plugins/mitt';
// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
// 常量
import Constant from '@/global/Constant'

export default defineComponent({
    components: {
        Info, About, Setting, Home, BaseSearch, SeniorSearch, Filter,
        Fold, Expand, HomeFilled, Search, Operation, Tickets,
        Coin, DataBoard, JsonDialog, Translate, DataBrowse, SaveOrUpdateUrl, SettingIcon, DataLine
    },
    data: () => {
        return {
            active: "home",
            urlId: undefined as number | undefined,
            aboutDialog: false,
            urlDialog: false,
            locale: zhCn,
            Constant,
            fullScreen: false
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
    },
    methods: {
        async selectUrl(value: string | number) {
            emitter.emit('update_url');
            if (value === 'add') {
                // 新增，打开新增面板
                this.urlId = undefined;
                this.urlDialog = true;
                return;
            }
            // 先进性索引刷新
            // 选择索引
            await useUrlStore().choose(value as number);
            // 索引刷新
            await useIndexStore().reset();

            // 当刷新完成之后，在发送消息
            // 选择一个有效的链接
            if (typeof value === 'number') {
                emitter.emit(MessageEventEnum.INDEX_CONNECT)
            } else {
                emitter.emit(MessageEventEnum.INDEX_CLEAN)
            }
        },
        async refresh() {
            await useIndexStore().reset();
            emitter.emit(MessageEventEnum.INDEX_REFRESH)
        },
        selectMenu(index: string) {
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
        fullScreenSwitch() {
            this.fullScreen = !this.fullScreen;
        }
    },
});
</script>

<style lang="less">

</style>
