<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')" class="base-spin">
        <div class="base-search">
            <!-- 主要显示区域 -->
            <div class="base-search-main full-screen">
                <!-- 顶部菜单栏 -->
                <base-search-header @open-history-dialog="historyDialog = true"/>
                <!-- 核心查询区 -->
                <base-search-display/>
                <a-back-top target-container=".arco-scrollbar-container" v-show="showTop"/>
                <!-- 快捷工具 -->
                <base-search-sentence/>
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
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

// 枚举
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

// 内部组件
import FieldOrderContainer from "@/page/base-search/components/filed-order/container.vue";
import FieldConditionContainer from "@/page/base-search/components/field-condition/container.vue";
import BshManage from "./components/History/index.vue";
import BaseSearchDataView from "./components/data-view/index.vue";
import BaseSearchHeader from './components/header/index.vue';
import BaseSearchSetting from './components/setting/index.vue';
import BaseSearchSentence from "./layout/sentence.vue";
import ShowQueryCondition from "./components/tool/ShowQueryCondition.vue";
import BaseSearchDisplay from "./layout/display.vue";

// 使用的工具类
import { useBaseSearchEvent} from "@/global/BeanFactory";


export default defineComponent({
    name: 'base-search',
    components: {
        BaseSearchDisplay,
        BaseSearchSentence,
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
        ...mapState(useBaseSearchStore, ['loading', 'current'])
    },
    created() {
        emitter.on(MessageEventEnum.URL_UPDATE, () => this.clear());
        emitter.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.showTop = (index === PageNameEnum.BASE_SEARCH)
        });
        useBaseSearchEvent.on(event => {
            // 跳转到基础搜索
            this.clear();
            useBaseSearchStore().setCurrentCondition(event.conditions);
            useBaseSearchStore().setCurrentOrders(event.orders);
            useBaseSearchStore().setCurrentIndex(event.index);
            if (event.execute) {
                useBaseSearchStore().search();
            }
        });
    },
    methods: {
        clear() {
            useBaseSearchStore().clear(true);
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
