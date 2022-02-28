<template>
    <div id="app">
        <!-- 左侧菜单 -->
        <div class="menu">
            <div class="logo">ES-client</div>
            <el-menu :default-active="active" style="height: 100%" @select="select_menu">
                <el-menu-item index="home">
                    <el-icon>
                        <home-filled />
                    </el-icon>
                    <template #title>{{ $t('app.menu.home') }}</template>
                </el-menu-item>
                <el-menu-item index="base_search">
                    <el-icon>
                        <search />
                    </el-icon>
                    <template #title>{{ $t('app.menu.base_search') }}</template>
                </el-menu-item>
                <el-menu-item index="senior_search">
                    <el-icon>
                        <data-board />
                    </el-icon>
                    <template #title>{{ $t('app.menu.senior_search') }}</template>
                </el-menu-item>
                <!-- <el-menu-item index="sql_search">
                    <el-icon>
                        <coin />
                    </el-icon>
                    <template #title>{{ $t('app.menu.sql_search') }}</template>
                </el-menu-item>-->
                <el-menu-item index="data_chart">
                    <el-icon>
                        <coin />
                    </el-icon>
                    <template #title>{{ $t('app.menu.data_chart') }}</template>
                </el-menu-item>
                <el-menu-item index="setting">
                    <el-icon>
                        <operation />
                    </el-icon>
                    <template #title>{{ $t('app.menu.setting') }}</template>
                </el-menu-item>
            </el-menu>
            <div class="author">
                <div style="margin-top: 5px">
                    <el-link @click="about_dialog = true">v0.6.0</el-link>
                </div>
            </div>
        </div>
        <!-- 内容-->
        <div class="main">
            <!-- 顶部-->
            <div class="top">
                <!-- 左侧 -->
                <div class="app-option">
                    <el-select
                        v-model="url"
                        :placeholder="$t('app.link_placeholder')"
                        style="padding-top: 9px;"
                        clearable
                        @change="select_url"
                    >
                        <el-option
                            v-for="url in urls"
                            :key="url.id"
                            :label="url.name"
                            :value="url.value"
                        ></el-option>
                        <el-option :label="$t('app.add')" value="add"></el-option>
                    </el-select>
                    <el-button @click="refresh">{{ $t('app.refresh') }}</el-button>
                    <div style="font-weight: bold">{{ name }}</div>
                    <div
                        style="margin-left: 20px;"
                        v-if="name !== ''"
                    >{{$t('app.cluster_health')}}: {{ status }} ({{ active_shards }} of {{ total_shards }})</div>
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
                <base-search v-show="active === 'base_search'"></base-search>
                <senior-search v-show="active === 'senior_search'"></senior-search>
                <sql-search v-show="active === 'sql_search'"></sql-search>
                <data-chart v-show="active === 'data_chart'"></data-chart>
                <setting v-show="active === 'setting'"></setting>
            </div>
        </div>
        <el-dialog
            :title="$t('app.about')"
            v-model="about_dialog"
            width="70%"
            append-to-body
            custom-class="es-dialog"
            :close-on-click-modal="false"
            top="10vh"
        >
            <about></about>
        </el-dialog>
        <el-dialog
            :title="$t('setting.link.add') + $t('setting.link.url')"
            v-model="url_add_dialog"
            width="600px"
        >
            <el-form :model="url_add_data" label-width="100px" ref="urlForm" :rules="url_rules">
                <el-form-item :label="$t('setting.link.name')" prop="name">
                    <el-input v-model="url_add_data.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('setting.link.url')" prop="value">
                    <el-input
                        v-model="url_add_data.value"
                        :placeholder="$t('setting.link.url_placeholder')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('setting.link.sequence')" prop="sequence">
                    <el-input-number
                        v-model="url_add_data.sequence"
                        controls-position="right"
                        size="large"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="test">{{ $t('setting.link.test') }}</el-button>
                <el-button type="primary" @click="url_submit">{{ $t('setting.link.add') }}</el-button>
            </template>
        </el-dialog>
        <json-dialog
            v-model="test_dialog"
            :json="test_data"
            :title="$t('setting.link.result')"
            open
        ></json-dialog>
    </div>
</template>

<script lang="ts">
import { useUrlStore } from "./store/UrlStore";
import { useIndexStore } from '@/store/IndexStore';
import { useSettingStore } from "@/store/SettingStore";
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
// 引入页面组件
import Info from '@/components/Info.vue';
import JsonDialog from "@/components/JsonDialog.vue";

// 页面
import About from "@/page/About/About.vue";
import Home from "./page/home/home.vue";
import BaseSearch from "@/page/BaseSearch/BaseSearch.vue";
import SeniorSearch from '@/page/SeniorSearch/SeniorSearch.vue';
import SqlSearch from "@/page/SqlSearch/SqlSearch.vue";
import DataChart from "@/page/DataChart/DataChart.vue";
import Setting from '@/page/Setting/Setting.vue'
import Translate from "@/components/Translate.vue";

import { defineComponent } from 'vue';
import { mapState } from "pinia";
import { Fold, Expand, HomeFilled, Search, Operation, Coin, DataBoard } from '@element-plus/icons-vue';
import Url from "./entity/Url";
import url_dao from "@/dao/UrlDao";
import axios from 'axios';

export default defineComponent({
    components: {
        Info, About, Setting, Home, BaseSearch, SeniorSearch,
        SqlSearch, DataChart, Fold, Expand, HomeFilled, Search, Operation,
        Coin, DataBoard, JsonDialog, Translate
    },
    data: () => {
        return {
            active: "home",
            url: "",
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
            test_data: {} as any
        };
    },
    computed: {
        ...mapState(useUrlStore, {
            'urls': 'urls',
            'url_store': 'url'
        }),
        ...mapState(useIndexStore, ['name', 'active_shards', 'total_shards', 'status'])
    },
    watch: {
        url_store() {
            this.url = this.url_store;
        }
    },
    created() {
        useUrlStore().reset();
    },
    methods: {
        select_url(value: string) {
            if (value === 'add') {
                // 新增，打开新增面板
                this.url = useUrlStore().current;
                this.url_add_dialog = true;
                return;
            }
            useUrlStore().choose(value);
            if (value !== '') {
                useIndexStore().reset();
            }
        },
        refresh() {
            useIndexStore().reset();
        },
        select_menu(index: string) {
            // 切换active
            this.active = index;
        },
        url_submit() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    let targetValue = this.url_add_data.value + "";
                    // 新增
                    url_dao.insert({
                        name: this.url_add_data.name,
                        value: this.url_add_data.value,
                        sequence: this.url_add_data.sequence
                    }, () => {
                        useUrlStore().choose(targetValue);
                        ElMessage.success('新增成功');
                        useUrlStore().reset();
                        useIndexStore().reset();
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
        }
    },
});
</script>

<style lang="less">
#app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .menu {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 200px;

        .logo {
            width: 100%;
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            height: 50px;
            line-height: 50px;
        }

        .author {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 20px;
            text-align: center;
            font-size: 14px;
            color: #3d3d3d;
        }
    }

    .main {
        position: absolute;
        top: 0;
        left: 200px;
        right: 0;
        bottom: 0;

        .top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50px;
            line-height: 50px;
            display: grid;
            grid-template-columns: 1fr 50px 115px;
            grid-template-rows: 50px;

            .app-option {
                display: flex;
                margin-left: 5px;

                .el-input {
                    margin-left: 5px;
                }

                .el-button {
                    margin-left: 14px;
                    margin-top: 9px;
                }

                .cluster-name {
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    margin-left: 10px;
                }
            }
        }

        .content {
            position: absolute;
            top: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
}
</style>
