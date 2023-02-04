<template>
    <div class="senior-search">
        <transition name="el-zoom-in-top">
            <div class="senior-search-tabs" v-show="showTabs">
                <tab-menu v-model="searchId" v-model:search-item-headers="searchItemHeaders" @edit-tabs="editTabs"
                          @option-tab="optionTab"/>
            </div>
        </transition>
        <!-- 左侧查询条件 -->
        <div class="senior-search-card" :class="showTabs ? 'show-tabs' : ''">
            <!-- 上半部分 -->
            <div class="senior-search-card__header">
                <div style="display: flex;">
                    <el-button type="primary" @click="search" style="margin-left: 0;">执行</el-button>
                    <el-button type="success" @click="formatDocument">{{ $t('common.operation.format') }}</el-button>
                    <el-button @click="historyDrawer = true">{{ $t('common.operation.history') }}</el-button>
                </div>
                <div>
                    <el-select v-model="view" style="width: 110px;">
                        <el-option :label="$t('common.keyword.jsonView')" :value="2"></el-option>
                        <el-option :label="$t('common.keyword.tableView')" :value="3"></el-option>
                    </el-select>
                    <el-button type="info" :icon="fullScreen" style="margin-left: 8px;" @click="showTabs = !showTabs"/>
                </div>
            </div>
            <!-- 下半部分 -->
            <div class="senior-main">
                <!-- 左面查询条件 -->
                <div class="side">
                    <rest-client-editor ref="restClientEditor" v-model="current.body"/>
                </div>
                <div class="seq"/>
                <div class="senior-content">
                    <el-scrollbar>
                        <data-view :view="view" :result="current.result"/>
                    </el-scrollbar>
                    <el-backtop :right="40" :bottom="60" target=".senior-content .el-scrollbar__wrap"
                                v-show="showTop"/>
                </div>
            </div>
        </div>
        <senior-search-history-manage v-model="historyDrawer"/>
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

import useSeniorTempRecordStore from "@/store/SeniorTempRecordStore";
import useUrlStore from "@/store/UrlStore";
import useSettingStore from "@/store/SettingStore";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import {httpStrategyContext, seniorSearchHistoryService, useSeniorSearchEvent} from "@/global/BeanFactory";

import DataView from "@/components/DataView/index.vue";
import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";
import Optional from "@/utils/Optional";
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import MessageUtil from "@/utils/MessageUtil";
import {requestBuild} from "@/page/SeniorSearch/build/RequestBuild";
import formatBuild from "@/page/SeniorSearch/build/FormatBuild";

export default defineComponent({
    name: 'SeniorSearch',
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
            showTabs: useSettingStore().getShowTab,
            // 语法提示
            suggestions: [],
            // 相关数据
            view: useSettingStore().getDefaultViewer,
            showTop: true,
            historyDrawer: false
        }
    },
    components: {
        RestClientEditor: defineAsyncComponent(() => import('@/module/RestClientEditor/index.vue')),
        SeniorSearchHistoryManage: defineAsyncComponent(() => import('@/page/SeniorSearch/component/index.vue')),
        TabMenu, DataView
    },
    computed: {
        ...mapState(useSettingStore, ['instance']),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        },
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
            this.current.body = searchItem.body.body;
            this.current.result = searchItem.body.result;
        },
        current: {
            handler() {
                let searchItem = this.searchMap.get(this.searchId);
                if (searchItem) {
                    searchItem.body.body = this.current.body;
                    searchItem.body.result = this.current.result;
                }
            },
            deep: true
        }
    },
    created() {
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
                    body: `${param.method} ${param.link}\r\n${param.params}`,
                    result: {}
                }
            } as SeniorSearchItem;
            this.searchMap.set(searchId, searchItem);
            this.searchId = searchId;

            // 只能预先赋值
            this.current.body = searchItem.body.body;
            this.current.result = searchItem.body.result;

            // 搜索
            this.$nextTick(() => {
                if (param.execute) {
                    this.search();
                }
            });
        })
    },
    // 获取最大宽度
    methods: {
        async search() {
            let restClientEditor = this.$refs.restClientEditor as any;
            let request = requestBuild(restClientEditor.getInstance());
            if (!request) {
                MessageUtil.success('请求块无法识别');
                return;
            }
            if (request.link === '') {
                MessageUtil.success('链接未识别到');
                return;
            }
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
                // 正常响应，加入历史记录
                let url = useUrlStore().url;
                if (url) {
                    useSeniorTempRecordStore().addTempRecord({
                        urlId: url.id!,
                        body: this.current.body
                    });
                    emitter.emit(MessageEventEnum.TEMP_RECORD_UPDATE);
                }
            }).catch((e) => {
                this.current.result = e.response.data
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
                    seniorSearchHistoryService.save({
                        urlId: Optional.ofNullable(useUrlStore().id).orElse(0),
                        name: searchItem.header.name,
                        body: searchItem.body.body,
                    })
                        .then(() => MessageUtil.success('新增成功', () => emitter.emit(MessageEventEnum.SENIOR_HISTORY_UPDATE)))
                        .catch(e => MessageUtil.error('新增失败', e));
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
        }
    },
});
</script>

<style lang="less">

</style>