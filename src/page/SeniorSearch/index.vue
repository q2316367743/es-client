<template>
    <a-spin :loading="loading" tip="数据查询中">
        <div class="senior-search">
            <tab-menu v-model="searchId" :search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                v-if="instance.showTab" class="senior-search-tab" @option-tab="optionTab" />
            <!-- 下半部分 -->
            <!-- 左面查询条件 -->
            <a-split class="senior-main" min="42px" :style="{ top: instance.showTab ? '40px' : '0' }" default-size="400px">
                <template #first>
                    <div class="side">
                        <div class="option">
                            <a-tooltip
                                :content="header.relationId ? $t('common.operation.update') : $t('common.operation.save')"
                                position="right">
                                <a-button type="text" :status="header.relationId ? 'danger' : 'success'" @click="save">
                                    <template #icon>
                                        <icon-save :size="18" />
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip :content="$t('common.operation.format')" position="right">
                                <a-button type="text" status="normal" @click="formatDocument">
                                    <template #icon>
                                        <icon-code />
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="清空" position="right">
                                <a-button type="text" status="normal" @click="clearBody">
                                    <template #icon>
                                        <format-icon />
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-dropdown position="bl" @select="(command: any) => view = command">
                                <a-button type="text" status="normal">
                                    <template #icon>
                                        <icon-code-block :size="18" v-if="view === 2" />
                                        <icon-nav :size="18" v-else-if="view === 3" />
                                        <view-icon :size="18" v-else />
                                    </template>
                                </a-button>
                                <template #content>
                                    <a-doption :value="ViewTypeEnum.JSON">JSON视图</a-doption>
                                    <a-doption :value="ViewTypeEnum.TABLE">表格视图</a-doption>
                                    <a-doption :value="ViewTypeEnum.JSON_TREE">JSON树视图</a-doption>
                                </template>
                            </a-dropdown>
                            <a-tooltip content="编辑器设置" position="right">
                                <a-button type="text" status="normal" @click="settingDialog = true">
                                    <template #icon>
                                        <icon-settings :size="18" />
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="帮助" position="right">
                                <a-button type="text" status="normal" @click="openHelp">
                                    <template #icon>
                                        <icon-question-circle :size="18" />
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </div>
                        <rest-client-editor ref="restClientEditor" v-model="current.body" class="editor"
                            @execute="execute" />
                    </div>
                </template>
                <template #second>
                    <div class="senior-display">
                        <a-tabs v-model:active-key="displayActive" class="senior-display-tabs">
                            <a-tab-pane title="结果" key="result" />
                            <a-tab-pane title="请求记录" key="search" />
                            <a-tab-pane title="历史记录" key="history" />
                        </a-tabs>
                        <div class="senior-display-content">
                            <!-- 结果集渲染 -->
                            <senior-search-data-view v-show="displayActive === 'result'" :view="view" :data="current.result" />
                            <!-- 请求记录 -->
                            <senior-search-record v-show="displayActive === 'search'" />
                            <!-- 历史记录 -->
                            <senior-search-history v-show="displayActive === 'history'" />
                        </div>
                    </div>
                    <a-back-top target-container=".senior-content .el-scrollbar__wrap" v-show="showTop" />
                </template>
            </a-split>
        </div>
        <a-modal v-model:visible="settingDialog" title="编辑器设置" draggable unmount-on-close render-to-body width="600px"
            :footer="false">
            <senior-search-setting @close="settingDialog = false" />
        </a-modal>
    </a-spin>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { mapState } from "pinia";

import './index.less';
import { SeniorSearchItem, SeniorSearchItemBody } from './domain/SeniorSearchItem';

import mitt from '@/plugins/mitt';

import useUrlStore from "@/store/UrlStore";
import useSettingStore from "@/store/SettingStore";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TabLoadModeEnum from "@/enumeration/TabLoadModeEnum";

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
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
// 工具类
import NotificationUtil from "@/utils/NotificationUtil";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";

import { requestBuild } from "@/page/SeniorSearch/build/RequestBuild";
import formatBuild from "@/page/SeniorSearch/build/FormatBuild";
import SeniorSearchDataView from "@/page/SeniorSearch/component/DataView/index.vue";

// 图标
import RunIcon from "@/icon/RunIcon.vue";
import SaveIcon from "@/icon/SaveIcon.vue";
import FormatIcon from "@/icon/FormatIcon.vue";
import ViewIcon from "@/icon/ViewIcon.vue";
import TagIcon from "@/icon/TagIcon.vue";
import JsonIcon from "@/icon/JsonIcon.vue";
import TableIcon from "@/icon/TableIcon.vue";
import SeniorTabComponent from "./component/SeniorTabComponent";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";


const seniorTabComponent = new SeniorTabComponent();

export default defineComponent({
    name: 'SeniorSearch',
    components: {
        TableIcon, JsonIcon, TagIcon, ViewIcon, FormatIcon, SaveIcon, RunIcon,
        RestClientEditor: defineAsyncComponent(() => import('@/module/RestClientEditor/index.vue')),
        SeniorSearchRecord: defineAsyncComponent(() => import('@/page/SeniorSearch/component/Search.vue')),
        SeniorSearchHistory: defineAsyncComponent(() => import('@/page/SeniorSearch/component/History.vue')),
        SeniorSearchSetting: defineAsyncComponent(() => import('@/page/SeniorSearch/component/Setting.vue')),
        TabMenu, SeniorSearchDataView,
    },
    data: () => {
        return {
            // 标签信息
            header: seniorTabComponent.header,
            // 展示数据
            current: seniorTabComponent.body,
            // 查询map
            searchMap: seniorTabComponent.searchMap,
            // 当前显示的ID
            searchId: seniorTabComponent.searchId,
            // 语法提示
            suggestions: [],
            // 相关数据
            view: 2,
            showTop: true,
            isDark,
            displayActive: 'result',
            loading: false,
            settingDialog: false,
            ViewTypeEnum
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
                this.current.result = {};
            }
        },
        searchId(newValue: number) {
            seniorTabComponent.choose(newValue);
        },
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
                body: {
                    body: param.body ? param.body : `${param.method} ${param.link}\r\n${param.params}`,
                    result: {}
                }
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
                    this.current.body += (this.current.body !== '' ? '\n\n' : '') + searchItem.body.body;
                }
            } else {
                // 头部
                this.header.name = searchItem.header.name;
                this.header.relationId = searchItem.header.relationId;
                // 隐藏标签页，插入到当前标签页
                if (useSettingStore().getTabLoadMode === TabLoadModeEnum.APPEND) {
                    this.current.body += (this.current.body !== '' ? '\n\n' : '') + searchItem.body.body;
                } else if (useSettingStore().getTabLoadMode === TabLoadModeEnum.COVER) {
                    this.current.body = searchItem.body.body;
                } else {
                    MessageUtil.error("标签载入模式错误")
                }
            }


        });

        applicationLaunch.register(() => {
            this.view = useSettingStore().getDefaultViewer;
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
            let request = requestBuild(restClientEditor.getInstance(), index);
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
            let data = {} as any;
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
                this.current.result = {};
                NotificationUtil.warning('新增文档，但没有参数', '警告');
                return;
            }
            httpStrategyContext.getStrategy().es<any>({
                url: request.link,
                method: request.method,
                data: data,
                hidden: true
            }).then((response) => {
                this.current.result = response;
            }).catch((e) => {
                this.current.result = e.data
                success = false
            }).finally(() => {
                this.displayActive = 'result';
                useSeniorSearchRecordStore().push({
                    method: request!.method,
                    link: request!.link!,
                    params: request!.params!,
                    success,
                    time: new Date().getTime() - now.getTime(),
                    date: now
                });
                this.loading = false;
            })
        },
        formatDocument() {
            try {
                let restClientEditor = this.$refs.restClientEditor as any;
                this.current.body = formatBuild(restClientEditor.getInstance());
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
        }
    },
});
</script>

<style lang="less"></style>