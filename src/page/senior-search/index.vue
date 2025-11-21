<template>
    <a-spin :loading="loading" tip="数据查询中">
        <div :class="{'senior-search': true,'disable-filter': !enableFilter}">
            <!-- 左面查询条件 -->
            <a-split class="senior-main" min="42px" :max="0.9" v-model:size="size" :disabled="disabled">
                <template #first>
                    <senior-search-editor/>
                </template>
                <template #second>
                    <senior-search-display v-model:fullscreen="fullscreen"/>
                </template>
            </a-split>
            <senior-search-filter/>
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useLocalStorage, useWindowSize} from "@vueuse/core";
import './index.less';
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {enableFilter, useSeniorFilterRecordStore} from "@/store/record/SeniorFilterRecordStore";
// 布局组件
import SeniorSearchEditor from '@/page/senior-search/layout/senior-search-editor/index.vue';
import SeniorSearchDisplay from '@/page/senior-search/layout/senior-search-display/index.vue';
import SeniorSearchFilter from '@/page/senior-search/layout/senior-search-filter/index.vue';

const windowSize = useWindowSize();

let history = '';

const size = useLocalStorage<string>('/key/senior-search/split-size', '400px');
const disabled = ref(false);
const fullscreen = ref(false);

const loading = computed(() => useSeniorSearchStore().loading);

watch(() => fullscreen.value, value => value ? enterFullscreen() : exitFullscreen());

watch(() => windowSize.width.value, value => {
    if (!fullscreen.value) {
        if (value - 150 < parseInt(size.value.replace('px', ''))) {
            size.value = '400px';
        }
    }
})

function enterFullscreen() {
    history = size.value;
    size.value = '40px';
    disabled.value = true;
}

function exitFullscreen() {
    size.value = history;
    disabled.value = false;
}

useSeniorFilterRecordStore().init();
useSeniorSearchStore().init();

</script>

<style lang="less"></style>
