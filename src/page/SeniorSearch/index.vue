<template>
    <a-spin :loading="loading" tip="数据查询中">
        <div class="senior-search">
            <tab-menu v-model="searchId" :search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                      v-if="instance.showTab" class="senior-search-tab"
                      @option-tab="optionTab"/>
            <!-- 下半部分 -->
            <!-- 左面查询条件 -->
            <a-split class="senior-main" min="42px" :style="{top: instance.showTab ? '40px' : '0'}" default-size="400px">
                <template #first>
                    <div class="side">
                        <div class="option">
                            <a-tooltip :content="$t('common.operation.save')" position="right">
                                <a-button type="text" status="success" @click="save">
                                    <template #icon>
                                        <icon-save :size="18"/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip :content="$t('common.operation.format')" position="right">
                                <a-button type="text" status="normal" @click="formatDocument">
                                    <template #icon>
                                        <format-icon/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip :content="viewTip" position="right">
                                <a-button type="text" status="normal" @click="view = (view === 2) ? 3 : 2">
                                    <template #icon>
                                        <icon-code-block :size="18" v-if="view === 2"/>
                                        <icon-nav :size="18" v-else-if="view === 3"/>
                                        <view-icon :size="18" v-else/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="编辑器设置" position="right">
                                <a-button type="text" status="normal" @click="settingDialog = true">
                                    <template #icon>
                                        <icon-settings :size="18"/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="帮助" position="right">
                                <a-button type="text" status="normal" @click="openHelp">
                                    <template #icon>
                                        <icon-question-circle :size="18"/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </div>
                        <rest-client-editor ref="restClientEditor" v-model="current.body" class="editor"
                                            @execute="execute"/>
                    </div>
                </template>
                <template #second>
                    <div class="senior-display">
                        <a-tabs v-model:active-key="displayActive" class="senior-display-tabs">
                            <a-tab-pane title="结果" key="result"/>
                            <a-tab-pane title="请求记录" key="search"/>
                            <a-tab-pane title="历史记录" key="history"/>
                        </a-tabs>
                        <div class="senior-display-content">
                            <!-- 结果集渲染 -->
                            <data-view v-show="displayActive === 'result'" :view="view" :result="current.result"/>
                            <!-- 请求记录 -->
                            <senior-search-record v-show="displayActive === 'search'"/>
                            <!-- 历史记录 -->
                            <senior-search-history v-show="displayActive === 'history'"/>
                        </div>
                    </div>
                    <a-back-top target-container=".senior-content .el-scrollbar__wrap" v-show="showTop"/>
                </template>
            </a-split>
        </div>
        <a-modal v-model:visible="settingDialog" title="编辑器设置" draggable unmount-on-close render-to-body
                 width="600px" :footer="false">
            <senior-search-setting @close="settingDialog = false"/>
        </a-modal>
    </a-spin>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
import {mapState} from "pinia";

import './index.less';
import {SeniorSearchItem, SeniorSearchItemBody} from './domain/SeniorSearchItem';

import mitt from '@/plugins/mitt';
import emitter from '@/plugins/mitt';

import useUrlStore from "@/store/UrlStore";
import useSettingStore from "@/store/SettingStore";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import {
    applicationLaunch,
    httpStrategyContext,
    isDark,
    nativeStrategyContext,
    seniorSearchHistoryService,
    useSeniorSearchEvent
} from "@/global/BeanFactory";

// 事件
import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";

// 组件
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import DataView from "@/components/DataView/index.vue";

import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";

import {requestBuild} from "@/page/SeniorSearch/build/RequestBuild";
import formatBuild from "@/page/SeniorSearch/build/FormatBuild";

// 图标
import RunIcon from "@/icon/RunIcon.vue";
import SaveIcon from "@/icon/SaveIcon.vue";
import FormatIcon from "@/icon/FormatIcon.vue";
import ViewIcon from "@/icon/ViewIcon.vue";
import TagIcon from "@/icon/TagIcon.vue";
import JsonIcon from "@/icon/JsonIcon.vue";
import TableIcon from "@/icon/TableIcon.vue";
import NotificationUtil from "@/utils/NotificationUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: 'SeniorSearch',
    components: {
        TableIcon, JsonIcon, TagIcon, ViewIcon, FormatIcon, SaveIcon, RunIcon,
        RestClientEditor: defineAsyncComponent(() => import('@/module/RestClientEditor/index.vue')),
        SeniorSearchRecord: defineAsyncComponent(() => import('@/page/SeniorSearch/component/Search.vue')),
        SeniorSearchHistory: defineAsyncComponent(() => import('@/page/SeniorSearch/component/History.vue')),
        SeniorSearchSetting: defineAsyncComponent(() => import('@/page/SeniorSearch/component/Setting.vue')),
        TabMenu, DataView,
    },
    data: () => {
        let searchMap = new Map<number, SeniorSearchItem>();
        let searchId = new Date().getTime();
        let searchItem = {
            header: {
                id: searchId,
                name: '高级查询'
            },
            body: {
                body: '',
                result: {}
            }
        };
        searchMap.set(searchId, searchItem);
        return {
            // 展示数据
            current: searchItem.body as SeniorSearchItemBody,
            // 查询map
            searchMap,
            // 当前显示的ID
            searchId,
            // 语法提示
            suggestions: [],
            // 相关数据
            view: 2,
            showTop: true,
            isDark,
            displayActive: 'result',
            loading: false,
            settingDialog: false
        }
    },
    computed: {
        ...mapState(useSettingStore, ['instance']),
        ...mapState(useUrlStore, ['url']),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        },
        viewTip() {
            switch (this.view) {
                case 2:
                    return '切换至表格视图';
                case 3:
                    return '切换至JSON视图';
                default:
                    return '视图切换';
            }
        }
    },
    watch: {
        link(newValue) {
            if (newValue === '') {
                this.current.result = {};
            }
        },
        searchId(newValue: number) {
            let searchItem = this.searchMap.get(newValue);
            if (!searchItem) {
                let searchId = new Date().getTime();
                searchItem = {
                    header: {
                        id: searchId,
                        name: '高级查询'
                    },
                    body: {
                        body: '',
                        result: {}
                    } as SeniorSearchItemBody
                }
                this.searchMap.set(searchId, searchItem);
            }
            this.current = searchItem.body;
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
                // 隐藏标签页，插入到当前标签页
                this.current.body += (this.current.body !== '' ? '\n\n' : '') + searchItem.body.body;
            }


        });

        applicationLaunch.register(() => {
            this.view = useSettingStore().getDefaultViewer;
            return Promise.resolve();
        });

    },
    // 获取最大宽度
    methods: {
        search() {
            this.execute();
        },
        execute(lineNumber?: number) {
            if (!this.url) {
                return;
            }
            let restClientEditor = this.$refs.restClientEditor as any;
            let request = requestBuild(restClientEditor.getInstance(), lineNumber);
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
                data: data
            }).then((response) => {
                this.current.result = response;
            }).catch((e) => {
                this.current.result = e.response.data
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
                this.clearAfter();
            } else if (action === 'remove') {
                this.searchMap.delete(targetName);
                if (this.searchMap.size === 0) {
                    this.clearAfter();
                } else {
                    this.searchId = this.searchMap.keys().next().value
                }
            }
        },
        optionTab(command: string) {
            let strings = command.split('|');
            let option = strings[0];
            let id = parseInt(strings[1]);
            switch (option) {
                case 'close-one':
                    this.searchMap.delete(id);
                    if (this.searchId === id) {
                        if (this.searchMap.size > 0) {
                            this.searchId = this.searchMap.keys().next().value
                        }
                    }
                    break;
                case 'close-other':
                    // 移除其他
                    Array.from(this.searchMap.keys()).forEach(e => {
                        if (e !== id) {
                            this.searchMap.delete(e);
                        }
                    })
                    this.searchId = id;
                    break;
                case 'close-all':
                    this.searchMap.clear();
                    break;
                case 'rename':
                    MessageBoxUtil.prompt("请输入新的标签名字", "修改标签名", {
                        confirmButtonText: '修改',
                        cancelButtonText: '取消',
                        inputValue: strings[2],
                        inputPattern: /.+/,
                        inputErrorMessage: '必须输入标签名'
                    }).then((value) => {
                        let searchItem = this.searchMap.get(id);
                        if (searchItem) {
                            searchItem.header.name = value;
                        }
                    }).catch(() => {
                    });
                    break;
                case 'save-history':
                    this.saveHistory(id);
                    break;
                case 'update-history':
                    this.updateHistory(id, strings[2]);
                    break;
            }
            // 全部关闭了
            if (this.searchMap.size === 0) {
                this.clearAfter();
            }
        },
        saveHistory(id: number) {
            let searchItem = this.searchMap.get(id);
            if (!searchItem) {
                MessageUtil.error('标签未找到');
                return;
            }
            MessageBoxUtil.prompt('请输入记录名字', '新增记录', {
                confirmButtonText: '新增',
                cancelButtonText: '取消',
                inputValue: isNaN(parseInt(searchItem.header.name)) ? searchItem.header.name : '',
                inputPattern: /\S+/,
                inputErrorMessage: '请输入有效字符'
            })
                .then(value => {
                    if (!searchItem) {
                        MessageUtil.error('标签未找到');
                        return;
                    }
                    seniorSearchHistoryService.save({
                        urlId: Optional.ofNullable(useUrlStore().id).orElse(0),
                        name: value,
                        body: searchItem.body.body,
                    })
                        .then(id => {
                            // 发送消息
                            MessageUtil.success('新增成功');
                            // 发送事件
                            emitter.emit(MessageEventEnum.SENIOR_HISTORY_UPDATE);
                            // 修改标签
                            if (searchItem) {
                                searchItem.header.relationId = id;
                                searchItem.header.name = value;
                            }
                        })
                        .catch(e => MessageUtil.error('新增失败', e));
                }).catch(() => console.log('取消新增'));
        },
        updateHistory(id: number, name: string) {
            let searchItem2 = this.searchMap.get(id);
            if (!searchItem2) {
                MessageUtil.error('标签未找到');
                return;
            }
            let relationId = parseInt(name);
            seniorSearchHistoryService.update({
                id: relationId,
                name: searchItem2.header.name,
                body: searchItem2.body.body,
            })
                .then(() => MessageUtil.success('更新成功', () => emitter.emit(MessageEventEnum.SENIOR_HISTORY_UPDATE)))
                .catch(e => {
                    MessageUtil.error('更新失败', e);
                    this.saveHistory(id);
                });
        },
        save() {
            let searchItem = this.searchMap.get(this.searchId);
            if (!searchItem) {
                MessageUtil.error('系统异常，标签获取错误');
                return;
            }
            if (searchItem.header.relationId) {
                // 更新
                this.optionTab(`update-history|${searchItem.header.id}|${searchItem.header.relationId}`);
            } else {
                // 新增
                this.optionTab(`save-history|${searchItem.header.id}`);
            }
        },
        clearAfter() {
            let searchId = new Date().getTime();
            let searchItem = {
                header: {
                    id: searchId,
                    name: '高级查询'
                },
                body: {
                    body: '',
                    result: {}
                }
            } as SeniorSearchItem;
            this.searchMap.set(searchId, searchItem);
            this.searchId = searchId;
        },
        openHelp() {
            nativeStrategyContext.getStrategy().openLink('https://www.yuque.com/baozhiyige-tewwf/ygxv4r/ya0xyiidxty4lois');
        }
    },
});
</script>

<style lang="less">

</style>