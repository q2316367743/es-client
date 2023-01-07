<template>
    <div class="senior-search">
        <!-- 左侧查询条件 -->
        <div class="el-card is-never-shadow" style="min-height: 550px">
            <!-- 上半部分 -->
            <div class="el-card__header" style="display: flex;justify-content: space-between;">
                <div style="display: flex;">
                    <el-select v-model="method" :placeholder="$t('senior_search.please_select')"
                               style="min-width: 100px;">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                    <el-autocomplete v-model="link" style="min-width: 100px;width: 300px;margin: 0 6px;"
                                     :fetch-suggestions="fetchSuggestions" @keyup.enter.native="search"
                                     @select="handleSelect"
                                     :placeholder="$t('senior_search.please_enter_a_link')" clearable>
                        <template #default="{ item }">
                            <div class="value">{{ item }}</div>
                        </template>
                    </el-autocomplete>
                    <el-button type="primary" @click="search">{{
                            link.indexOf('search') > -1 ?
                                $t('senior_search.search') : $t('senior_search.execute')
                        }}
                    </el-button>
                    <el-button type="success" @click="formatDocument">{{ $t('senior_search.format') }}</el-button>
                </div>
                <el-select v-model="view">
                    <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                    <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                    <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
                </el-select>
            </div>
            <!-- 下半部分 -->
            <div class="senior-main">
                <!-- 左面查询条件 -->
                <div class="side">
                    <!-- 请求参数 -->
                    <div class="param" :style="method === 'GET' ? 'overflow: auto;padding-left: 20px;' : ''">
                        <div class="get" v-show="method === 'GET'">
                            <el-button type="primary" @click="addGetParam">{{ $t('senior_search.add') }}</el-button>
                            <el-button @click="truncateGetParam">{{ $t('senior_search.clear') }}</el-button>
                            <div class="item" v-for="(param, index) in get_params" :key="index">
                                <el-input v-model="param.key" :placeholder="$t('senior_search.please_enter_key')">
                                </el-input>
                                <div style="text-align: center;">=</div>
                                <el-input v-model="param.value" :placeholder="$t('senior_search.please_enter_value')">
                                </el-input>
                                <div></div>
                                <el-button type="danger" @click="removeGetParam(param.id)">{{
                                        $t('senior_search.remove')
                                    }}
                                </el-button>
                            </div>
                        </div>
                        <codemirror
                            v-model="params"
                            placeholder="请在这里输入查询条件"
                            :style="{ height: '100%' }"
                            :autofocus="true"
                            :indent-with-tab="true"
                            :tabSize="4"
                            :extensions="extensions"
                        />
                    </div>
                </div>
                <!-- 中间分隔栏 -->
                <div class="senior-bar">
                </div>
                <!-- 右面展示内容 -->
                <div class="senior-content">
                    <el-scrollbar>
                        <data-view :view="view" :result="result"/>
                    </el-scrollbar>
                    <el-backtop :right="40" :bottom="60" target=".senior-content .el-scrollbar__wrap"
                                v-show="show_top"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {Codemirror} from 'vue-codemirror';
import {ElMessage} from "element-plus";
import {json} from '@codemirror/lang-json';

import mitt from '@/plugins/mitt';

import {httpStrategyContext, useSeniorSearchEvent} from "@/global/BeanFactory";

import {validateTip} from '@/utils/GlobalUtil';

import LinkProcessor from "./LinkProcessor";
import Param from '@/view/Param'
import getParamBuild from "@/build/GetParamBuild";
import useSettingStore from "@/store/SettingStore";
import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import DataView from "@/components/DataView/index.vue";
import SeniorSearchParam from "@/domain/SeniorSearchParam";
import PageNameEnum from "@/enumeration/PageNameEnum";


export default defineComponent({
    name: 'SeniorSearch',
    data: () => ({
        link: '',
        method: 'POST' as Method,
        params: '{}',
        result: {},
        // 语法提示
        suggestions: [],
        // GET请求参数
        get_params: new Array<Param>(),
        // 相关数据
        view: useSettingStore().getDefaultViewer,
        show_top: true,
        extensions: [json()] as Array<any>
    }),
    components: {DataView, Codemirror},
    computed: {
        ...mapState(useSettingStore, ['instance']),
    },
    watch: {
        link(newValue) {
            if (newValue === '') {
                this.result = {};
            }
        },
        default_viewer() {
            this.view = useSettingStore().getDefaultViewer
        }
    },
    created() {
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置条件
            this.link = '';
            this.method = 'POST';
            this.params = '{}';
            this.result = {};
            this.suggestions = [];
            // GET请求参数
            this.get_params = new Array<Param>();
        });
        mitt.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.show_top = (index === PageNameEnum.SENIOR_SEARCH)
        });
        useSeniorSearchEvent.on((param: SeniorSearchParam) => {
            this.result = {};
            this.link = param.url;
            this.method = param.method as Method;
            this.params = param.param;
            if (param.execute) {
                this.search();
            }
        })
    },
    // 获取最大宽度
    methods: {
        async search() {
            if (await validateTip(this.method, this.link)) {
                if (this.method === 'GET') {
                    httpStrategyContext.getStrategy().es<any>({
                        url: this.link,
                        method: this.method,
                        params: getParamBuild(this.get_params)
                    }).then((response) => {
                        this.result = response;
                    });
                } else {
                    let data = {} as any;
                    if (this.params != '') {
                        try {
                            data = JSON.parse(this.params);
                        } catch (e: any) {
                            console.error(e);
                            // 不必强行校验json格式
                            data = this.params;
                        }
                    }
                    if (this.link.indexOf('_doc') > -1 && this.params == '') {
                        // 如果是新增文档，但是没有参数，不进行查询
                        this.result = {};
                        return;
                    }
                    httpStrategyContext.getStrategy().es<any>({
                        url: this.link,
                        method: this.method,
                        data: data
                    }).then((response) => {
                        this.result = response;
                    }).catch((e) => {
                        this.result = e.response.data
                    })
                }
            }
        },
        fetchSuggestions(queryString: string, cb: (links: string[]) => void) {
            cb(LinkProcessor(queryString, this.method));
        },
        handleSelect(item: any) {
            this.link = item;
        },
        addGetParam() {
            this.get_params.push({
                id: new Date().getTime(),
                key: '',
                value: ''
            });
        },
        removeGetParam(id: number) {
            this.get_params = this.get_params.filter(e => e.id !== id);
        },
        truncateGetParam() {
            this.get_params = new Array<Param>();
        },
        formatDocument() {
            try {
                this.params = JSON.stringify(JSON.parse(this.params), null, 4);
            } catch (e) {
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'warning',
                    message: '格式化失败，' + e
                })
            }
        },
    },
});
</script>

<style lang="less">
.senior-search {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .el-card {
        height: 100%;

        .el-card__body {
            position: absolute;
            top: 70px;
            left: 10px;
            bottom: 10px;
            right: 10px;
        }
    }

    .senior-main {
        position: absolute;
        top: 69px;
        left: 0;
        right: 0;
        bottom: 0;

        .side {
            position: absolute;
            top: 5px;
            left: 5px;
            bottom: 0;
            width: 500px;

            .link {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 32px;
                display: flex;
            }

            .param {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 10px;

                .get {
                    width: 466px;

                    .item {
                        display: grid;
                        grid-template-rows: 1fr;
                        grid-template-columns: 0.5fr 26px 1fr 12px auto;
                        margin-top: 12px;
                    }
                }

                .post {
                    padding-top: 5px;
                }
            }
        }

        .senior-bar {
            position: absolute;
            top: 0;
            left: 510px;
            bottom: 0;
            width: 9px;
            border-left: var(--el-card-border-color) solid 1px;
        }

        .senior-button {
            position: absolute;
            width: 13px;
            height: 13px;
            border-radius: 13px;
            line-height: 13px;
            background-color: #ffffff;
            font-size: 8px;
            border-left: var(--el-card-border-color) solid 1px;
            cursor: pointer;
        }

        .senior-content {
            position: absolute;
            top: 5px;
            bottom: 5px;
            right: 5px;
            left: 515px;
            overflow: auto;
        }
    }
}
</style>