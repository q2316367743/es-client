<template>
    <div class="senior-search">
        <!-- 左侧查询条件 -->
        <div class="el-card is-never-shadow" style="min-height: 550px">
            <!-- 上半部分 -->
            <div class="el-card__header" style="display: flex;justify-content: space-between;">
                <div style="display: flex;">
                    <el-select v-model="method" :placeholder="$t('senior_search.please_select')"
                               style="min-width: 100px;">
                        <el-option label="HEAD" value="HEAD"></el-option>
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
                    <el-button @click="historyDrawer = true">历史</el-button>
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
                                v-show="showTop"/>
                </div>
            </div>
        </div>
        <el-drawer v-model="historyDrawer" size="1000px" title="历史记录" append-to-body>
            <history-manage @load="loadToCurrent"/>
        </el-drawer>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {Codemirror} from 'vue-codemirror';
import {ElMessage, ElNotification} from "element-plus";
import {json} from '@codemirror/lang-json';
import './index.less';

import mitt from '@/plugins/mitt';

import {httpStrategyContext, useSeniorSearchEvent} from "@/global/BeanFactory";

import LinkProcessor from "./LinkProcessor";
import useSettingStore from "@/store/SettingStore";
import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import DataView from "@/components/DataView/index.vue";
import SeniorSearchParam from "@/domain/SeniorSearchParam";
import PageNameEnum from "@/enumeration/PageNameEnum";
import HistoryManage from "@/module/HistoryManage/index.vue";
import HistoryEntity from "@/entity/HistoryEntity";
import useTempRecordStore from "@/store/TempRecordStore";
import useUrlStore from "@/store/UrlStore";
import emitter from "@/plugins/mitt";


export default defineComponent({
    name: 'SeniorSearch',
    data: () => ({
        link: '',
        method: 'POST' as Method,
        params: '{}',
        result: {},
        // 语法提示
        suggestions: [],
        // 相关数据
        view: useSettingStore().getDefaultViewer,
        showTop: true,
        extensions: [json()] as Array<any>,
        historyDrawer: false
    }),
    components: {HistoryManage, DataView, Codemirror},
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
        });
        mitt.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.showTop = (index === PageNameEnum.SENIOR_SEARCH)
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
            if (this.method === 'POST' && this.link.indexOf('_doc') > -1 && this.params == '') {
                // 如果是新增文档，但是没有参数，不进行查询
                this.result = {};
                ElNotification({
                    title: '警告',
                    type: 'warning',
                    message: '新增文档，但没有参数'
                })
                return;
            }
            httpStrategyContext.getStrategy().es<any>({
                url: this.link,
                method: this.method,
                data: data
            }).then((response) => {
                this.result = response;
                // 正常响应，加入历史记录
                let url = useUrlStore().url;
                if (url) {
                    useTempRecordStore().addTempRecord({
                        id: new Date().getTime(),
                        urlId: url.id!,
                        link: this.link,
                        method: this.method,
                        params: this.params
                    });
                    emitter.emit(MessageEventEnum.TEMP_RECORD_UPDATE);
                }
            }).catch((e) => {
                this.result = e.response.data
            })
        },
        fetchSuggestions(queryString: string, cb: (links: string[]) => void) {
            cb(LinkProcessor(queryString, this.method));
        },
        handleSelect(item: any) {
            this.link = item;
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
        loadToCurrent(history: HistoryEntity) {
            this.historyDrawer = false;
            this.$nextTick(() => {
                this.link = history.link;
                this.method = history.method;
                this.params = history.params;
            })
        }
    },
});
</script>

<style lang="less">

</style>