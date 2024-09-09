<template>
    <div class="ss-display-quick">
        <a-row :gutter="8">
            <a-col flex="auto">
                <a-input allow-clear v-model="keyword" placeholder="请输入记录名"/>
            </a-col>
            <a-col flex="60px">
                <a-button type="primary" @click="openQuickAdd()">新增</a-button>
            </a-col>
        </a-row>
        <a-list style="margin-top: 8px;" :max-height="maxHeight">
            <a-list-item v-for="request in requests" :key="request.id">
                <a-list-item-meta :title="request.name" :description="request.description"/>
                <a-space>
                    <a-button type="text" status="success" @click="loadQuickOpera(request.id)">
                        <template #icon>
                            <icon-double-left />
                        </template>
                        载入
                    </a-button>
                    <a-button type="text" @click="openQuickAdd(request.id)">编辑</a-button>
                    <a-popconfirm content="是否立即删除此记录？" @ok="openQuickDelete(request.id)">
                        <a-button type="text" status="danger">删除</a-button>
                    </a-popconfirm>
                </a-space>
            </a-list-item>
        </a-list>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useSeniorSearchRequestStore} from "@/store/history/SeniorSearchRequestStore";
import {
    loadQuickOpera,
    openQuickAdd,
    openQuickDelete
} from "@/page/senior-search/layout/senior-search-display/SsDisplayQuickOpera";
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize();

const keyword = ref('');
const requests = computed(() => useSeniorSearchRequestStore().requests);

const maxHeight = computed(() => Math.max(size.height.value - 95, 0));

</script>
<style scoped lang="less">
.ss-display-quick {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 8px 8px;
    overflow: auto;
}
</style>
