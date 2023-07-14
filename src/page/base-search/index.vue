<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')" class="base-spin">
        <div class="base-search">
            <!-- 主要显示区域 -->
            <div class="base-search-main full-screen">
                <!-- 顶部菜单栏 -->
                <base-search-header @open-history-dialog="historyDialog = true"/>
                <!-- 核心查询区 -->
                <div class="base-display" ref="baseDisplay">
                    <!-- 查询条件 -->
                    <div class="base-condition" ref="baseCondition">
                        <a-form :model="current" layout="vertical" label-width="80px"
                                style="overflow-x: auto;overflow-y: hidden;">
                            <!-- 条件 -->
                            <a-form-item :label="$t('baseSearch.form.condition')">
                                <field-condition-container/>
                            </a-form-item>
                            <!-- 排序 -->
                            <a-form-item :label="$t('baseSearch.form.order')">
                                <field-order-container/>
                            </a-form-item>
                            <div class="base-condition-pagination">
                                <a-pagination :total="current.total" :current="current.page"
                                              :page-size="current.size" show-total @change="pageChange"/>
                                <a-input-number v-model="current.size" style="width: 70px"/>
                            </div>
                        </a-form>
                    </div>
                    <!-- 查询结果 -->
                    <div class="base-content hljs" ref="baseContent">
                        <base-search-data-view ref="baseSearchDataView"/>
                    </div>
                    <a-back-top target-container=".base-display"/>
                </div>
                <a-back-top target-container=".arco-scrollbar-container" v-show="showTop"/>
                <div class="base-search-condition-sentence">
                    <show-query-condition />
                    <a-button type="text" @click="jumpToSeniorSearch">
                        {{ $t('common.action.jumpToSeniorSearch') }}
                    </a-button>
                    <a-button type="text" @click="execCopy">
                        {{ $t('common.action.copy') }}
                    </a-button>
                </div>
            </div>
        </div>
    </a-spin>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";

// 自定义组件
import TabMenu from "@/components/TabMenu/index.vue";
import JsonView from "@/components/JsonView/index.vue";

import emitter from '@/plugins/mitt';

// 全局存储
import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";
import useBaseTempRecordStore from "@/store/BaseTempRecordStore";

// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

// 核心算法
import QueryConditionBuild from './algorithm/QueryConditionBuild';

// 内部组件
import FieldOrderContainer from "@/page/base-search/components/filed-order/container.vue";
import FieldConditionContainer from "@/page/base-search/components/field-condition/container.vue";
import BshManage from "./components/History/index.vue";
import BaseSearchDataView from "./components/data-view/index.vue";
import BaseSearchHeader from './components/header/index.vue';
import BaseSearchSetting from './components/setting/index.vue';

// 使用的工具类
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {
    applicationLaunch,
    useBaseSearchEvent,
    useIndexManageEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import DocumentApi from "@/api/DocumentApi";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import ShowQueryCondition from "@/page/base-search/components/tool/ShowQueryCondition.vue";


export default defineComponent({
    name: 'base-search',
    components: {
        ShowQueryCondition,
        BaseSearchDataView,
        BshManage,
        JsonView,
        FieldConditionContainer,
        FieldOrderContainer,
        TabMenu,
        BaseSearchHeader,
        BaseSearchSetting
    },
    data: () => ({
        historyDialog: false,
        showTop: true,

    }),
    computed: {
        ...mapState(useSettingStore, ['showTab', 'pageSize', 'defaultViewer']),
        ...mapState(useIndexStore, {
            indexAliasMap: (state): Map<string, string> => {
                let aliasIndexMap = new Map<string, string>();
                state.indices.forEach(index => {
                    aliasIndexMap.set(index.name, index.name);
                    [index.name, ...index.alias].forEach(alias => aliasIndexMap.set(alias, index.name));
                });
                return aliasIndexMap;
            }
        }),
        ...mapState(useBaseSearchStore, ['loading', 'current'])
    },
    created() {
        emitter.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置条件
            this.clear(true);
        });
        emitter.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.showTop = (index === PageNameEnum.BASE_SEARCH)
        });
        useBaseSearchEvent.on(event => {
            // 跳转到基础搜索
            this.clear(true);
            useBaseSearchStore().setCurrentCondition(event.conditions);
            useBaseSearchStore().setCurrentOrders(event.orders);
            useBaseSearchStore().setCurrentIndex(event.index);
            if (event.execute) {
                useBaseSearchStore().search();
            }
        });
        applicationLaunch.register(() => {
            return Promise.resolve()
        });
    },
    methods: {
        search() {
            if (this.current.index.length === 0) {
                MessageBoxUtil.alert(this.$t('baseSearch.placeholder.selectIndex'), null);
                return;
            }
            this.loading = true;
            try {
                DocumentApi(this.current.index)._search(
                        QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders)
                ).then((response) => {
                    // 结果
                    this.current.result = response as Record<string, any>;
                    // 解析总数
                    if (response.hits) {
                        if (parseInt(response.hits.total)) {
                            this.current.total = parseInt(response.hits.total)
                        } else if (parseInt(response.hits.total.value)) {
                            this.current.total = parseInt(response.hits.total.value);
                        } else {
                            this.current.total = 0;
                        }
                    } else {
                        this.current.total = 0;
                    }
                    // 增加到历史
                    useBaseTempRecordStore().addTempRecord({
                        id: new Date().getTime(),
                        index: this.current.index,
                        conditions: this.current.conditions,
                        orders: this.current.orders
                    })
                }).catch((e) => {
                    this.current.result = e.response.data;
                }).finally(() => {
                    this.loading = false;
                });
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
                this.loading = false;
            }
        },
        clear(clearIndex: boolean = false) {
            useBaseSearchStore().clear(clearIndex);
        },
        jumpToSeniorSearch() {
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            try {
                useSeniorSearchEvent.emit({
                    link: `/${this.current.index}/_search`,
                    method: 'POST',
                    params: JSON.stringify(
                            QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders),
                            null,
                            4)
                });
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
            }
        },
        openIndexManage() {
            if (this.current.index === '') {
                MessageUtil.error('请先选择索引');
                return;
            }
            let index = this.indexAliasMap.get(this.current.index);
            if (index) {
                useIndexManageEvent.emit(index);
            } else {
                MessageUtil.warning(`索引【${this.current.index}】未找到`)
            }
        },
        execCopy() {
            (this.$refs['baseSearchDataView'] as any).execCopy()
        },
        pageChange(page: number) {
            useBaseSearchStore().setCurrentPage(page);
        }
    }
});
</script>

<style lang="less">
@import url(./index.less);
</style>
