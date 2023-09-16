<template>
    <a-spin :loading="loading" tip="数据查询中">
        <div class="senior-search">
            <!-- 左面查询条件 -->
            <a-split class="senior-main" min="42px" :max="0.9" default-size="400px">
                <template #first>
                    <senior-search-editor/>
                </template>
                <template #second>
                    <senior-search-display/>
                </template>
            </a-split>
            <senior-search-filter />
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import './index.less';
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
// 布局组件
import SeniorSearchEditor from '@/page/senior-search/layout/senior-search-editor/index.vue';
import SeniorSearchDisplay from '@/page/senior-search/layout/senior-search-display/index.vue';
import SeniorSearchFilter from '@/page/senior-search/layout/senior-search-filter/index.vue';

const loading = computed(() => useSeniorSearchStore().loading);


</script>

<style lang="less"></style>
