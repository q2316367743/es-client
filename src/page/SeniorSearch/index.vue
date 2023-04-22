<template>
    <a-spin :loading="loading" tip="数据查询中">
        <div class="senior-search">
            <!-- 左面查询条件 -->
            <a-split class="senior-main" min="42px" :max="0.9" default-size="400px">
                <template #first>
                    <div class="senior-search-side" :class="instance.showTab ? 'show-tab' : ''">
                        <tab-menu v-model="searchId" :search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                            v-if="instance.showTab" class="senior-search-tab" @option-tab="optionTab" />
                        <!-- 编辑器 -->
                        <div class="senior-search-editor">
                            <!-- 操作栏 -->
                            <senior-search-option :relation-id="header.relationId" :view="view" @save="save"
                                @format-document="formatDocument" @clear-body="clearBody"
                                @select="(command) => view = command" @setting="settingDialog = true"
                                @export-data="exportData">
                                <template #footer>
                                    <a-tooltip content="请求" position="right">
                                        <a-button :type="editor ? 'primary' : 'text'" status="normal"
                                            @click="editor = true">
                                            <template #icon>
                                                <icon-list :size="18" />
                                            </template>
                                        </a-button>
                                    </a-tooltip>
                                    <a-tooltip content="过滤" position="right">
                                        <a-button :type="editor ? 'text' : 'primary'" status="normal"
                                            @click="editor = false">
                                            <template #icon>
                                                <icon-bug :size="18" />
                                            </template>
                                        </a-button>
                                    </a-tooltip>
                                </template>
                            </senior-search-option>
                            <!-- rest客户端编辑器 -->
                            <rest-client-editor ref="restClientEditor" v-model="current" class="editor" @execute="execute"
                                v-show="editor" />
                            <div class="editor" v-show="!editor">
                                <!-- 过滤器 -->
                                <div class="js-option">
                                    <a-switch v-model="isEnableFilter">
                                        <template #checked>
                                            启用
                                        </template>
                                        <template #unchecked>
                                            禁用
                                        </template>
                                    </a-switch>
                                    <a-button type="primary" @click="execFilter">过滤</a-button>
                                </div>
                                <div class="js-editor-wrapper">
                                    <!-- 过滤编辑器 -->
                                    <codemirror v-model="filter" placeholder="$为结果对象" :style="{ height: '100%' }"
                                        class="js-editor" :autofocus="true" :indent-with-tab="true" :tabSize="4"
                                        :extensions="extensions" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #second>
                    <senior-search-display :view="view" :data="show" />
                </template>
            </a-split>
        </div>
        <a-modal v-model:visible="settingDialog" title="编辑器设置" draggable unmount-on-close render-to-body width="600px"
            :footer="false">
            <senior-search-setting @close="settingDialog = false" />
        </a-modal>
        <senior-search-export-dialog v-model="exportDialog" :result="result" />
    </a-spin>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { mapState } from "pinia";
import * as monaco from "monaco-editor";
import { Codemirror } from 'vue-codemirror';
import { javascript } from "@codemirror/lang-javascript";

import './index.less';
import { SeniorSearchItem } from './domain/SeniorSearchItem';

import mitt from '@/plugins/mitt';

import useUrlStore from "@/store/UrlStore";
import useSettingStore from "@/store/SettingStore";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";

// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TabLoadModeEnum from "@/enumeration/TabLoadModeEnum";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

import {
    applicationLaunch,
    httpStrategyContext,
    isDark,
    nativeStrategyContext,
    useSeniorSearchEvent
} from "@/global/BeanFactory";

// 事件
import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";

// 组件
import formatBuild from "@/page/SeniorSearch/build/FormatBuild";
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import SeniorTabComponent from "@/page/SeniorSearch/components/SeniorTabComponent";
// 工具类
import NotificationUtil from "@/utils/NotificationUtil";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";


import { Grammatical, grammaticalAnalysis } from "@/algorithm/grammaticalAnalysis";
import { jsonFormat } from "@/algorithm/jsonFormat";


const seniorTabComponent = new SeniorTabComponent();
let json = {} as any;

export default defineComponent({
    name: 'SeniorSearch',
    components: {
        SeniorSearchOption: defineAsyncComponent(() => import('@/page/SeniorSearch/components/Option.vue')),
        RestClientEditor: defineAsyncComponent(() => import('@/module/RestClientEditor/index.vue')),
        SeniorSearchSetting: defineAsyncComponent(() => import('@/page/SeniorSearch/components/Setting.vue')),
        SeniorSearchExportDialog: defineAsyncComponent(() => import('@/page/SeniorSearch/components/ExportDialog.vue')),
        SeniorSearchDisplay: defineAsyncComponent(() => import('@/page/SeniorSearch/components/Display/index.vue')),
        TabMenu, Codemirror
    },
    data: () => {
        return {
            // 查询map
            searchMap: seniorTabComponent.searchMap,
            // 当前显示的ID
            searchId: seniorTabComponent.searchId,
            // 标签信息
            header: seniorTabComponent.header,
            // 当前编辑器内容
            current: '',
            // 当前结果
            result: '',
            // 真正展示的
            show: '',
            isEnableFilter: false,
            filter: 'return $;',
            // 相关数据
            view: ViewTypeEnum.JSON,
            editor: true,
            showTop: true,
            isDark,
            displayActive: 'result',
            loading: false,
            settingDialog: false,
            exportDialog: false,
            ViewTypeEnum,
            extensions: [javascript()] as Array<any>
        }
    },
    computed: {
        ...mapState(useSettingStore, ['instance']),
        ...mapState(useUrlStore, ['url']),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        }
    },
    watch: {
        link(newValue) {
            if (newValue === '') {
                this.result = "{}";
                this.show = this.result;
            }
        },
        searchId(newValue: number) {
            let seniorSearchItem = seniorTabComponent.choose(newValue);
            this.current = seniorSearchItem.body;
        },
        current(newValue: string) {
            seniorTabComponent.sync(newValue, this.isEnableFilter, this.filter);
        },
        isEnableFilter(newValue: boolean) {
            seniorTabComponent.sync(this.current, newValue, this.filter);
        },
        filter(newValue: string) {
            seniorTabComponent.sync(this.current, this.isEnableFilter, newValue);
        }
    },
    mounted() {
        mitt.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.showTop = (index === PageNameEnum.SENIOR_SEARCH)
        });
        useSeniorSearchEvent.on((param: SeniorSearchJumpEvent) => {
            let searchId = new Date().getTime();
            let searchItem = {
                header: {
                    id: searchId,
                    name: Optional.ofNullable(param.name).orElse(searchId.toString()),
                    relationId: Optional.ofNullable(param.id).orElse(0)
                },
                body: param.body ? param.body : `${param.method || ''} ${param.link || ''}\r\n${param.params || ''}`
            } as SeniorSearchItem;

            // 显示标签页
            if (this.instance.showTab) {
                // 头部
                this.header = searchItem.header;
                // 判断是否当前标签页
                if (typeof param.current === 'undefined' || !param.current) {
                    // 新标签页
                    this.current = searchItem.body;
                    this.searchMap.set(searchId, searchItem);
                    this.searchId = searchId;
                } else {
                    // 当前标签页
                    this.current += (this.current !== '' ? '\n\n' : '') + searchItem.body;
                }
            } else {
                // 头部
                this.header.name = searchItem.header.name;
                this.header.relationId = searchItem.header.relationId;
                // 隐藏标签页，插入到当前标签页
                if (useSettingStore().getTabLoadMode === TabLoadModeEnum.APPEND) {
                    this.current += (this.current !== '' ? '\n\n' : '') + searchItem.body;
                } else if (useSettingStore().getTabLoadMode === TabLoadModeEnum.COVER) {
                    this.current = searchItem.body;
                } else {
                    MessageUtil.error("标签载入模式错误")
                }
            }
        });

        applicationLaunch.register(() => {
            this.view = useSettingStore().getDefaultViewer;
            // 是否启用过滤
            this.isEnableFilter = useSettingStore().getSeniorFilter;
            return Promise.resolve();
        });

    },
    // 获取最大宽度
    methods: {
        execute(index: number) {
            if (!this.url) {
                return;
            }
            let restClientEditor = this.$refs.restClientEditor as any;
            let request = this.requestBuild(restClientEditor.getInstance(), index);
            if (!request) {
                MessageUtil.error('请求块无法识别');
                return;
            }
            if (request.link === '') {
                MessageUtil.success('链接未识别到');
                return;
            }
            this.loading = true;
            let now = new Date();
            let success = true;
            let data = undefined as any;
            if (request.params != '') {
                try {
                    data = JSON.parse(request.params);
                } catch (e: any) {
                    console.error(e);
                    // 不必强行校验json格式
                    data = request.params;
                }
            }
            if (request.method === 'POST' && request.link.indexOf('_doc') > -1 && request.params == '') {
                // 如果是新增文档，但是没有参数，不进行查询
                this.result = "{}";
                this.show = "{}"
                NotificationUtil.warning('新增文档，但没有参数', '警告');
                return;
            }
            httpStrategyContext.getStrategy().es<string>({
                url: request.link,
                method: request.method,
                data: data,
                hidden: true,
                responseType: 'text'
            }).then((response) => {
                this.result = response;
                try {
                    json = JSON.parse(this.result);
                } catch (e) {
                    json = {};
                }
                this.execFilter();
            }).catch((e) => {
                this.result = e.data;
                this.show = this.result;
                success = false
            }).finally(() => {
                this.displayActive = 'result';
                useSeniorSearchRecordStore().push({
                    ...request!,
                    success,
                    time: new Date().getTime() - now.getTime(),
                    date: now
                });
                this.loading = false;
            })
        },
        execFilter() {
            if (this.isEnableFilter) {
                try {
                    // 使用过滤
                    let filterFunc = new Function('$', this.filter);
                    let resultJson = filterFunc(json);
                    if (typeof resultJson === 'object') {
                        this.show = jsonFormat(resultJson);
                    } else {
                        this.show = `${resultJson}`;
                    }
                } catch (e) {
                    MessageUtil.error("结果集不是JSON，无法过滤");
                    this.show = this.result;
                }
            } else {
                this.show = this.result;
            }
        },
        formatDocument() {
            try {
                let restClientEditor = this.$refs.restClientEditor as any;
                this.current = formatBuild(restClientEditor.getInstance());
            } catch (e: any) {
                MessageUtil.error('格式化失败', e);
            }
        },
        editTabs(targetName: number, action: 'remove' | 'add') {
            if (action === 'add') {
                seniorTabComponent.add();
            } else if (action === 'remove') {
                seniorTabComponent.remove(targetName);
            }
        },
        optionTab(command: string) {
            switch (command) {
                case 'close-one':
                    seniorTabComponent.close();
                    break;
                case 'close-other':
                    // 移除其他
                    seniorTabComponent.closeOther();
                    break;
                case 'close-all':
                    seniorTabComponent.closeAll();
                    break;
                case 'rename':
                    seniorTabComponent.rename();
                    break;
                case 'save':
                    seniorTabComponent.save();
                    break;
                case 'update':
                    seniorTabComponent.update();
                    break;
            }
        },
        save() {
            if (this.header.relationId) {
                seniorTabComponent.update();
            } else {
                seniorTabComponent.save();
            }
        },
        openHelp() {
            nativeStrategyContext.getStrategy().openLink('https://www.yuque.com/baozhiyige-tewwf/ygxv4r/ya0xyiidxty4lois');
        },
        clearBody() {
            seniorTabComponent.clear();
            this.current = '';
            this.result = "{}";
            this.show = this.result;
            this.filter = "return $;"
        },
        exportData() {
            if (this.result === '' || this.result === '{}') {
                MessageUtil.error('请先执行查询');
                return;
            }
            this.exportDialog = true;
        },
        requestBuild(instance: monaco.editor.IStandaloneCodeEditor, index: number): Grammatical | undefined {
            let value = instance.getValue();
            let position = instance.getPosition();
            if (!position) {
                return;
            }
            let list = grammaticalAnalysis(value);
            if (list.length === 0) {
                return;
            }
            return list[index];
        }
    },
});
</script>

<style lang="less"></style>