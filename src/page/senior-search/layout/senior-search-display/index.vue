<template>
    <div class="senior-search-display">
        <div class="view">
            <!-- 结果集渲染 -->
            <senior-search-data-view v-show="displayActive === 'result'" :view="view" :data="show"/>
            <!-- 请求记录 -->
            <display-record v-show="displayActive === 'record'"/>
            <!-- 历史记录 -->
            <senior-search-history v-show="displayActive === 'history'"/>
        </div>
        <div class="tabs">
            <a-button type="text" @click="fullscreen = !fullscreen">
                <template #icon>
                    <icon-fullscreen-exit v-if="fullscreen"/>
                    <icon-fullscreen v-else/>
                </template>
            </a-button>
            <div class="tab" :class="displayActive === 'result' ? 'active' : ''" @click="displayActive = 'result'">
                结果
            </div>
            <div class="tab" :class="displayActive === 'record' ? 'active' : ''" @click="displayActive = 'record'">
                请求记录
            </div>
            <div class="tab" :class="displayActive === 'history' ? 'active' : ''" @click="displayActive = 'history'">
                历史记录
            </div>
        </div>
        <a-back-top target-container=".senior-content .el-scrollbar__wrap"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
// 组件
import DisplayRecord from "@/page/senior-search/layout/senior-search-display/display-record.vue";
import SeniorSearchDataView from '@/page/senior-search/layout/senior-search-display/DataView.vue'
import SeniorSearchHistory from '@/page/senior-search/layout/senior-search-display/History.vue';

const props = defineProps({
    fullscreen: Boolean
});
const emits = defineEmits(['update:fullscreen']);

const displayActive = ref('result');
const fullscreen = ref(false);

const result = computed(() => useSeniorSearchStore().result);
const show = computed(() => useSeniorSearchStore().show);
const view = computed(() => useSeniorSearchStore().view);

watch(() => fullscreen.value, value => emits('update:fullscreen', value));
watch(() => props.fullscreen, value => fullscreen.value = value);

</script>
<style scoped lang="less">
.senior-search-display {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 32px;
    overflow: hidden;

    .view {
        position: relative;
        padding: 0 4px;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .tabs {
        width: 32px;
        display: block;

        .tab {
            writing-mode: vertical-lr;
            width: 32px;
            margin: 5px 0;
            cursor: pointer;
            padding: 8px 6px;

            &.active {
                background-color: var(--color-neutral-2);
            }

            &:hover {
                background-color: var(--color-neutral-2);
            }
        }
    }
}
</style>
