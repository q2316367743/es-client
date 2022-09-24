<template>
    <el-config-provider :locale="locale">
        <!-- 左侧菜单 -->
        <div class="menu">
            <div class="logo">ES-client</div>
            <el-menu :default-active="active" style="height: 100%" @select="select_menu">
                <el-menu-item index="home">
                    <el-icon>
                        <home-filled/>
                    </el-icon>
                    <template #title>{{ $t('app.menu.home') }}</template>
                </el-menu-item>
                <el-menu-item index="data browse">
                    <el-icon>
                        <coin/>
                    </el-icon>
                    <template #title>{{ $t('app.menu.data_browse') }}</template>
                </el-menu-item>
                <el-menu-item index="base search">
                    <el-icon>
                        <search/>
                    </el-icon>
                    <template #title>{{ $t('app.menu.base_search') }}</template>
                </el-menu-item>
                <el-menu-item index="senior search">
                    <el-icon>
                        <data-board/>
                    </el-icon>
                    <template #title>{{ $t('app.menu.senior_search') }}</template>
                </el-menu-item>
                <el-menu-item index="setting">
                    <el-icon>
                        <operation/>
                    </el-icon>
                    <template #title>{{ $t('app.menu.setting') }}</template>
                </el-menu-item>
            </el-menu>
            <div class="author">
                <div style="margin-top: 5px">
                    <el-link @click="about_dialog = true">v1.3.0</el-link>
                </div>
            </div>
        </div>
        <!-- 内容-->
        <div class="main">
            <!-- 顶部-->
            <div class="top">
                <!-- 左侧 -->
                <div class="app-option">
                    <!-- 索引服务器选择 -->
                    <el-select v-model="url_id" :placeholder="$t('app.link_placeholder')" style="padding-top: 9px;"
                               clearable @change="select_url">
                        <el-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.id">
                        </el-option>
                        <el-option :label="$t('app.add')" value="add"></el-option>
                    </el-select>
                    <!-- 刷新按钮 -->
                    <el-button @click="refresh">{{ $t('app.refresh') }}</el-button>
                    <!-- 服务器名称 -->
                    <div style="font-weight: bold;margin-left: 20px;font-size: 16px;">{{ name }}</div>
                    <!-- 服务器状态 -->
                    <div style="margin-left: 10px;" v-if="name !== ''">{{ $t('app.cluster_health') }}: {{ status }}
                        ({{ active_shards }} of {{ total_shards }})
                    </div>
                </div>
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
            <div class="content">
                <home v-show="active === 'home'"></home>
                <data-browse v-show="active === 'data browse'"></data-browse>
                <base-search v-show="active === 'base search'"></base-search>
                <senior-search v-show="active === 'senior search'"></senior-search>
                <sql-search v-show="active === 'sql search'"></sql-search>
                <setting v-show="active === 'setting'"></setting>
            </div>
        </div>
        <el-dialog :title="$t('app.about')" v-model="about_dialog" width="70%" append-to-body
                   custom-class="es-dialog" :close-on-click-modal="false" top="10vh">
            <about></about>
        </el-dialog>
        <el-dialog :title="$t('setting.link.add') + $t('setting.link.url')" v-model="url_add_dialog" width="600px">
            <el-form :model="url_add_data" label-width="100px" ref="urlForm" :rules="url_rules">
                <el-form-item :label="$t('setting.link.name')" prop="name">
                    <el-input v-model="url_add_data.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('setting.link.url')" prop="value">
                    <el-input v-model="url_add_data.value" :placeholder="$t('setting.link.url_placeholder')">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('setting.link.sequence')" prop="sequence">
                    <el-input-number v-model="url_add_data.sequence" controls-position="right" size="large"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="test">{{ $t('setting.link.test') }}</el-button>
                <el-button type="primary" @click="url_submit">{{ $t('setting.link.add') }}</el-button>
            </template>
        </el-dialog>
        <json-dialog v-model="test_dialog" :json="test_data" :title="$t('setting.link.result')" open></json-dialog>
    </el-config-provider>
</template>

<script lang="ts">
// 引入状态管理
import {useUrlStore} from "@/store/UrlStore";
import {useIndexStore} from '@/store/IndexStore';
import {useSettingStore} from "@/store/SettingStore";
// 引入框架
import type {ElForm} from 'element-plus'
import {ElMessage} from 'element-plus'
import {defineComponent} from 'vue';
import {mapState} from "pinia";
import {Coin, DataBoard, Expand, Fold, HomeFilled, Operation, Search} from '@element-plus/icons-vue';
import axios from 'axios';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
// 引入页面组件
import Info from '@/components/Info.vue';
import JsonDialog from "@/components/JsonDialog.vue";
import Translate from "@/components/Translate.vue";
// 页面
import About from "@/page/About/index.vue";
import Home from "./page/Home/index.vue";
import BaseSearch from "@/page/BaseSearch/index.vue";
import SeniorSearch from '@/page/SeniorSearch/index.vue';
import SqlSearch from "@/page/sql_search/index.vue";
import Setting from '@/page/Setting/index.vue'
import DataBrowse from '@/page/DataBrowse/index.vue';
// 其他
import Url from "@/entity/Url";
import url_dao from "@/dao/UrlDao";
import mitt from '@/plugins/mitt';
import emitter from '@/plugins/mitt';
import MessageEventEnum from "./enumeration/MessageEventEnum";

export default defineComponent({
    components: {
        Info, About, Setting, Home, BaseSearch, SeniorSearch,
        SqlSearch, Fold, Expand, HomeFilled, Search, Operation,
        Coin, DataBoard, JsonDialog, Translate, DataBrowse
    },
    data: () => {
        return {
            active: "home",
            url_id: undefined as number | undefined,
            about_dialog: false,
            url_add_dialog: false,
            url_add_data: {
                name: '',
                value: 'http://',
                sequence: 0,
            } as Url,
            url_rules: {
                name: [
                    {
                        required: true,
                        message: '请输入链接名',
                        trigger: 'blur',
                    }
                ],
                value: [
                    {
                        required: true,
                        message: '请输入链接',
                        trigger: 'blur',
                    }
                ],
                sequence: [
                    {
                        required: true,
                        message: '请输入排序',
                        trigger: 'blur',
                    }
                ]
            },
            test_dialog: false,
            test_data: {} as any,
            locale: zhCn
        };
    },
    computed: {
        ...mapState(useUrlStore, ['urls', 'url']),
        ...mapState(useIndexStore, ['name', 'active_shards', 'total_shards', 'status'])
    },
    watch: {
        url() {
            this.url_id = this.url?.id!;
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
        async select_url(value: string | number) {
            console.log(typeof value, value)
            emitter.emit('update_url');
            if (value === 'add') {
                // 新增，打开新增面板
                this.url_id = undefined;
                this.url_add_dialog = true;
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
        select_menu(index: string) {
            // 切换active
            this.active = index;
            mitt.emit(MessageEventEnum.PAGE_ACTIVE, index);
        },
        url_submit() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    // 新增
                    url_dao.insert({
                        name: this.url_add_data.name,
                        value: this.url_add_data.value,
                        sequence: this.url_add_data.sequence
                    }, (id) => {
                        useUrlStore().reset(() => {
                            // 刷新索引列表
                            // 选择索引
                            this.select_url(id);
                            ElMessage.success('新增成功');
                        });
                    });
                    this.url_add_dialog = false;
                    // 重置数据
                    this.url_add_data = {
                        name: '',
                        value: 'http://',
                        sequence: 0,
                    }
                }
            });
        },
        test() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    axios({
                        baseURL: this.url_add_data.value,
                        url: '/',
                        method: 'GET',
                    }).then((response) => {
                        this.test_dialog = true;
                        this.test_data = response.data;
                    }).catch((e) => {
                        console.error(e);
                        ElMessage.error('连接失败');
                    });
                }
            })
        },
        languageCommand(command: string) {
            useSettingStore().setLanguage(command);
            this.$i18n.locale = command;
            if (command === 'zh') {
                this.locale = zhCn;
            } else if (command === 'en') {
                this.locale = en;
            }
        }
    },
});
</script>

<style lang="less">
</style>
