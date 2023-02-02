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
                    <el-select v-model="current.method" :placeholder="$t('seniorSearch.placeholder.select')"
                               style="min-width: 100px;">
                        <el-option label="HEAD" value="HEAD"></el-option>
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                    <el-autocomplete v-model="current.link" style="min-width: 100px;width: 300px;margin: 0 6px;"
                                     :fetch-suggestions="fetchSuggestions" @keyup.enter.native="search"
                                     @select="handleSelect"
                                     :placeholder="$t('seniorSearch.placeholder.link')" clearable>
                        <template #default="{ item }">
                            <div class="value">{{ item }}</div>
                        </template>
                    </el-autocomplete>
                    <el-button type="primary" @click="search">{{ searchBtn }}
                    </el-button>
                    <el-button type="success" @click="formatDocument">{{ $t('common.operation.format') }}</el-button>
                    <el-button @click="historyDrawer = true">{{ $t('common.operation.history') }}</el-button>
                </div>
                <div>
                    <el-select v-model="view">
                        <el-option :label="$t('common.keyword.jsonView')" :value="2"></el-option>
                        <el-option :label="$t('common.keyword.tableView')" :value="3"></el-option>
                    </el-select>
                    <el-button type="info" :icon="fullScreen" style="margin-left: 12px;" @click="showTabs = !showTabs"/>
                </div>
            </div>
            <!-- 下半部分 -->
            <div class="senior-main">
                <!-- 左面查询条件 -->
                <div class="side">
                    <rest-client-editor v-model="current.params"/>
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
import LinkProcessor from "./LinkProcessor";
import {SeniorSearchItem} from './SeniorSearchItem';

import mitt from '@/plugins/mitt';
import emitter from '@/plugins/mitt';

import useSeniorTempRecordStore from "@/store/SeniorTempRecordStore";
import useUrlStore from "@/store/UrlStore";
import useSettingStore from "@/store/SettingStore";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import {httpStrategyContext, seniorSearchHistoryService, useSeniorSearchEvent} from "@/global/BeanFactory";

import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import DataView from "@/components/DataView/index.vue";
import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";
import Optional from "@/utils/Optional";
import SeniorSearchHistoryManage from "@/page/SeniorSearch/component/index.vue";
import TabMenu from "@/components/TabMenu/index.vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import MessageUtil from "@/utils/MessageUtil";

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
                link: '',
                method: 'POST',
                params: '{}',
                result: {}
            }
        });
        return {
            // 展示数据
            current: {
                link: '',
                method: 'POST' as Method,
                params: '{}',
                result: {} as any,
            },
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
        TabMenu, SeniorSearchHistoryManage, DataView},
    computed: {
        ...mapState(useSettingStore, ['instance']),
        searchItemHeaders(): Array<TabMenuItem> {
            return Array.from(this.searchMap.values()).map(e => e.header);
        },
        searchBtn() {
            if (this.current.link) {
                return this.current.link.indexOf('search') > -1 ? this.$t('common.operation.search') : this.$t('common.operation.execute')
            }
            return this.$t('common.operation.search');
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
                        link: '',
                        method: 'POST',
                        params: '{}',
                        result: {}
                    }
                }
                this.searchMap.set(searchId, searchItem);
            }
            this.current.link = searchItem.body.link;
            this.current.method = searchItem.body.method;
            this.current.params = searchItem.body.params;
            this.current.result = searchItem.body.result;
        },
        current: {
            handler() {
                let searchItem = this.searchMap.get(this.searchId);
                if (searchItem) {
                    searchItem.body.link = this.current.link;
                    searchItem.body.method = this.current.method;
                    searchItem.body.params = this.current.params;
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
                    link: param.link,
                    method: param.method,
                    params: param.params,
                    result: {}
                }
            } as SeniorSearchItem;
            this.searchMap.set(searchId, searchItem);
            this.searchId = searchId;

            // 只能预先赋值
            this.current.link = searchItem.body.link;
            this.current.method = searchItem.body.method;
            this.current.params = searchItem.body.params;
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
            if (!this.current.link || this.current.link === '') {
                MessageUtil.success('请输入链接');
                return;
            }
            let data = {} as any;
            if (this.current.params != '') {
                try {
                    data = JSON.parse(this.current.params);
                } catch (e: any) {
                    console.error(e);
                    // 不必强行校验json格式
                    data = this.current.params;
                }
            }
            if (this.current.method === 'POST' && this.current.link.indexOf('_doc') > -1 && this.current.params == '') {
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
                url: this.current.link,
                method: this.current.method,
                data: data
            }).then((response) => {
                this.current.result = response;
                // 正常响应，加入历史记录
                let url = useUrlStore().url;
                if (url) {
                    useSeniorTempRecordStore().addTempRecord({
                        urlId: url.id!,
                        link: this.current.link,
                        method: this.current.method,
                        params: this.current.params
                    });
                    emitter.emit(MessageEventEnum.TEMP_RECORD_UPDATE);
                }
            }).catch((e) => {
                this.current.result = e.response.data
            })
        },
        fetchSuggestions(queryString: string, cb: (links: string[]) => void) {
            cb(LinkProcessor(queryString, this.current.method));
        },
        handleSelect(item: any) {
            this.current.link = item;
        },
        formatDocument() {
            try {
                this.current.params = JSON.stringify(JSON.parse(this.current.params), null, 4);
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
                        link: searchItem.body.link,
                        method: searchItem.body.method,
                        params: searchItem.body.params,
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
                        link: searchItem2.body.link,
                        method: searchItem2.body.method,
                        params: searchItem2.body.params,
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
                    link: '',
                    method: 'POST',
                    params: '{}',
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