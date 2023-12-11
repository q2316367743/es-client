<template>
    <a-spin :loading="loading" :tip="$t('common.loading.search')" class="base-spin">
        <div class="base-search">
            <!-- 主要显示区域 -->
            <div class="base-search-main full-screen">
                <!-- 顶部菜单栏 -->
                <base-search-header/>
                <!-- 核心查询区 -->
                <base-search-display/>
                <a-back-top target-container=".arco-scrollbar-container"/>
            </div>
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
// 全局存储
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
// 内部组件
import BaseSearchHeader from './components/header/index.vue';
import BaseSearchDisplay from "./layout/display.vue";
import {statistics} from "@/global/BeanFactory";


const loading = computed(() => useBaseSearchStore().loading);
const current = computed(() => useBaseSearchStore().current);

const clear = () => useBaseSearchStore().clear(true);

statistics.access("功能统计", "基础搜索");

</script>

<style lang="less">
@import url(./index.less);
</style>
