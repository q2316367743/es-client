<template>
    <div class="senior-search" v-loading="loading" element-loading-text="数据查询中">
        <!-- 下半部分 -->
        <div class="senior-main">
            <!-- 左面查询条件 -->
            <div class="side" :style="{width: `${width}px`}">
                <tab-menu v-model="searchId" :search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                          v-show="showTabs"
                          @option-tab="optionTab"/>
                <div class="controller" :class="showTabs ? 'show-tabs' : ''">
                    <div class="option">
                        <ss-option-btn :tooltip="$t('common.operation.run')" :class-name="url ? 'run' : 'run disable'"
                                       @click="search">
                            <run-icon/>
                        </ss-option-btn>
                        <ss-option-btn :tooltip="$t('common.operation.save')" class-name="save"
                                       @click="save">
                            <save-icon/>
                        </ss-option-btn>
                        <ss-option-btn :tooltip="$t('common.operation.format')" class-name="format"
                                       @click="formatDocument">
                            <format-icon/>
                        </ss-option-btn>
                        <ss-option-btn :tooltip="viewTip" class-name="view" @click="view = (view === 2) ? 3 : 2">
                            <json-icon v-if="view === 2"/>
                            <table-icon v-else-if="view === 3"/>
                            <view-icon v-else/>
                        </ss-option-btn>
                        <ss-option-btn tooltip="标签栏" class-name="tab" @click="showTabs = !showTabs">
                            <tag-icon/>
                        </ss-option-btn>
                        <ss-option-btn tooltip="帮助" class-name="help" @click="openHelp">
                            <i class="vxe-icon-question-circle"/>
                        </ss-option-btn>
                    </div>
                    <rest-client-editor ref="restClientEditor" v-model="current.body" class="editor"
                                        :style="{width: `calc(100% - 24px)`, height: '100%'}"/>
                </div>
            </div>
            <div class="sep" ref="seniorSearchSep" :style="{left: `${width + 5}px`}"/>
            <div class="senior-content" :style="{left: `${width + 15}px`}">
                <el-tabs v-model="displayActive" class="senior-display-tabs">
                    <el-tab-pane label="结果" name="result"/>
                    <el-tab-pane label="请求记录" name="search"/>
                    <el-tab-pane label="历史记录" name="history"/>
                </el-tabs>
                <el-scrollbar class="senior-display-scroll">
                    <!-- 结果集渲染 -->
                    <data-view v-show="displayActive === 'result'" :view="view" :result="current.result"/>
                    <!-- 请求记录 -->
                    <senior-search-record v-show="displayActive === 'search'"/>
                    <!-- 历史记录 -->
                    <senior-search-history v-show="displayActive === 'history'"/>
                </el-scrollbar>
                <el-backtop :right="40" :bottom="60" target=".senior-content .el-scrollbar__wrap"
                            v-show="showTop"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent, markRaw} from "vue";
import {mapState} from "pinia";
import {ElMessageBox, ElNotification} from "element-plus";
import {FullScreen} from '@element-plus/icons-vue'

import './index.less';
import {SeniorSearchItem, SeniorSearchItemBody} from './domain/SeniorSearchItem';

import mitt from '@/plugins/mitt';
import emitter from '@/plugins/mitt';

import useUrlStore from "@/store/UrlStore";
import useSettingStore from "@/store/SettingStore";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";

import {
    applicationLaunch,
    httpStrategyContext,
    isDark,
    lodisStrategyContext,
    seniorSearchHistoryService,
    useFullScreen,
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
import SsOptionBtn from "@/page/SeniorSearch/component/OptionBtn.vue";

// 图标
import RunIcon from "@/icon/RunIcon.vue";
import SaveIcon from "@/icon/SaveIcon.vue";
import FormatIcon from "@/icon/FormatIcon.vue";
import ViewIcon from "@/icon/ViewIcon.vue";
import TagIcon from "@/icon/TagIcon.vue";
import JsonIcon from "@/icon/JsonIcon.vue";
import TableIcon from "@/icon/TableIcon.vue";

// 记录点击开始位置
let startX = 0;
let startWidth = 0;

const rightWidth = 570;
let minWidth = 120;
let maxWidth = 0;

export default defineComponent({
    name: 'SeniorSearch',
    components: {
        SsOptionBtn,
        TableIcon, JsonIcon, TagIcon, ViewIcon, FormatIcon, SaveIcon, RunIcon,
        RestClientEditor: defineAsyncComponent(() => import('@/module/RestClientEditor/index.vue')),
        SeniorSearchRecord: defineAsyncComponent(() => import('@/page/SeniorSearch/component/Search.vue')),
        SeniorSearchHistory: defineAsyncComponent(() => import('@/page/SeniorSearch/component/History.vue')),
        TabMenu, DataView,
    },
    data: () => {
        let searchMap = new Map<number, SeniorSearchItem>();
        let searchId = new Date().getTime();
        searchMap.set(searchId, {
            header: {
                id: searchId,
                name: '高级查询'
            },
            body: {
                body: '',
                result: {}
            }
        });
        return {
            // 展示数据
            current: {
                body: '',
                result: {} as any,
            } as SeniorSearchItemBody,
            // 图标
            fullScreen: markRaw(FullScreen),
            // 查询map
            searchMap,
            // 当前显示的ID
            searchId,
            showTabs: true,
            // 语法提示
            suggestions: [],
            // 相关数据
            view: 2,
            showTop: true,
            isDark,
            displayActive: 'result',
            width: 500,
            loading: false,
            fullScreenStore: useFullScreen.fullScreen
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
        fullScreenStore(newValue: boolean) {
            let seniorSearchWidth = window.innerWidth - (newValue ? 66 : 200);
            // 重新定义最大宽度
            maxWidth = seniorSearchWidth - rightWidth;
            let defaultWidth = Math.round(seniorSearchWidth * 0.3);
            // 重新定义当前宽度
            if (this.width < minWidth || this.width > maxWidth) {
                this.width = defaultWidth;
            }
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
                body: {
                    body: param.body ? param.body : `${param.method} ${param.link}\r\n${param.params}`,
                    result: {}
                }
            } as SeniorSearchItem;


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

            // 搜索
            this.$nextTick(() => {
                if (param.execute) {
                    this.search();
                }
            });
        });
        applicationLaunch.register(() => {
            this.showTabs = useSettingStore().getShowTab
            this.view = useSettingStore().getDefaultViewer;
            return Promise.resolve();
        });

        let seniorSearch = document.getElementById('main')! as HTMLDivElement;
        // 初始化大小
        let windowWidth = seniorSearch.offsetWidth;
        this.width = Math.round(windowWidth * 0.3);
        maxWidth = windowWidth - rightWidth;

        window.addEventListener('resize', () => {
            let offsetWidth = seniorSearch.offsetWidth;
            // 重新定义最大宽度
            maxWidth = offsetWidth - rightWidth;
            let defaultWidth = Math.round(offsetWidth * 0.3);
            // 重新定义当前宽度
            if (this.width < minWidth || this.width > maxWidth) {
                this.width = defaultWidth;
            }
        })


        applicationLaunch.register(() => {
            let width = Optional.ofNullable(lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SENIOR_SEARCH_WIDTH))
                .map(e => parseInt(e!))
                .orElse(0);
            if (width > minWidth && width < maxWidth) {
                this.width = width;
            }
            return Promise.resolve();
        });


        let seniorSearchSep = this.$refs.seniorSearchSep as HTMLDivElement;
        seniorSearchSep.addEventListener('mousedown', (e: MouseEvent) => {
            startX = e.clientX
            startWidth = this.width;
        });
        window.addEventListener('mousemove', (e: MouseEvent) => {
            if (startX > 0) {
                let width = startWidth + e.clientX - startX;
                if (width > minWidth && width < maxWidth) {
                    this.width = width;
                    lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.SENIOR_SEARCH_WIDTH, width + '');
                }
            }
        });
        window.addEventListener('mouseup', () => {
            startX = 0;
            startWidth = 0;
        })

    },
    // 获取最大宽度
    methods: {
        async search() {
            if (!this.url) {
                return;
            }
            let restClientEditor = this.$refs.restClientEditor as any;
            let request = requestBuild(restClientEditor.getInstance());
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
                ElNotification({
                    title: '警告',
                    type: 'warning',
                    message: '新增文档，但没有参数'
                })
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
                    ElMessageBox.prompt("请输入新的标签名字", "修改标签名", {
                        confirmButtonText: '修改',
                        cancelButtonText: '取消',
                        inputValue: strings[2],
                        inputPattern: /.+/,
                        inputErrorMessage: '必须输入标签名'
                    }).then(({value}) => {
                        let searchItem = this.searchMap.get(id);
                        if (searchItem) {
                            searchItem.header.name = value;
                        }
                    }).catch(() => {
                    });
                    break;
                case 'save-history':
                    let searchItem = this.searchMap.get(id);
                    if (!searchItem) {
                        MessageUtil.error('标签未找到');
                        return;
                    }
                    ElMessageBox.prompt('请输入记录名字', {
                        confirmButtonText: '新增',
                        cancelButtonText: '取消',
                        inputValue: isNaN(parseInt(searchItem.header.name)) ? searchItem.header.name : '',
                        inputPattern: /\S+/,
                        inputErrorMessage: '请输入有效字符'
                    })
                        .then(({value}) => {
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
                                    }
                                })
                                .catch(e => MessageUtil.error('新增失败', e));
                        }).catch(() => console.log('取消新增'));
                    break;
                case 'update-history':
                    let searchItem2 = this.searchMap.get(id);
                    if (!searchItem2) {
                        MessageUtil.error('标签未找到');
                        return;
                    }
                    let relationId = parseInt(strings[2]);
                    seniorSearchHistoryService.update({
                        id: relationId,
                        name: searchItem2.header.name,
                        body: searchItem2.body.body,
                    })
                        .then(() => MessageUtil.success('更新成功', () => emitter.emit(MessageEventEnum.SENIOR_HISTORY_UPDATE)))
                        .catch(e => MessageUtil.error('更新失败', e));
                    break;
            }
            // 全部关闭了
            if (this.searchMap.size === 0) {
                this.clearAfter();
            }
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
            window.open('https://www.yuque.com/baozhiyige-tewwf/ygxv4r/sbycouc0q47lu9mz');
        }
    },
});
</script>

<style lang="less">

</style>