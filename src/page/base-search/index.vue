<template>
    <a-spin :loading="loading" tip="查询中" class="base-spin">
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
import {computed} from "vue";
// 全局存储
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
// 内部组件
import BaseSearchHeader from './components/header/index.vue';
import BaseSearchDisplay from "./layout/BaseSearchDisplay.vue";


const loading = computed(() => useBaseSearchStore().loading);

</script>

<style lang="less">
@import url(./index.less);
</style>
