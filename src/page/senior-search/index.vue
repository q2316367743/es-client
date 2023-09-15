<template>
    <a-spin :loading="loading" tip="数据查询中">
        <div class="senior-search">
            <!-- 左面查询条件 -->
            <a-split class="senior-main" min="42px" :max="0.9" default-size="400px">
                <template #first>
                    <ss-editor/>
                </template>
                <template #second>
                    <ss-display/>
                </template>
            </a-split>
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import './index.less';
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

import SsEditor from '@/page/senior-search/components/ss-editor/index.vue';
import SsDisplay from '@/page/senior-search/components/ss-display/index.vue';

const loading = computed(() => useSeniorSearchStore().loading);


</script>

<style lang="less"></style>
