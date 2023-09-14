<template>
    <div class="home">
        <!-- 上面的搜索条件 -->
        <div class="home-option">
            <div style="display: flex">
                <!-- 输入框 -->
                <a-input v-model="keyword" :placeholder="$t('home.placeholder.index')"
                         style="width: 250px;height: 32px;" allow-clear></a-input>
            </div>
            <a-button type="primary" style="margin-left: 10px" @click="indexAddDialog = true" :disabled="!url">
                {{ $t('common.operation.new') }}
            </a-button>
        </div>
        <!-- 索引容器 -->
        <div class="home-container" ref="homeContainer">
            <a-list class="home-index-items" :data="items" :virtual-list-props="virtualListProps"
                    :scrollbar="true"
                    :bordered="false" :split="false">
                <template #item="{ item }">
                    <a-list-item :key="item.name">
                        <index-item :index="item" @open-dialog="indexOpenDialog" @open-manage="indexOpenManage"/>
                    </a-list-item>
                </template>
                <template #empty>
                    <a-empty v-if="items.length === 0" description="空空如也" style="margin-top: 20%"/>
                </template>
            </a-list>
            <a-back-top target-container=".home-container .arco-scrollbar-container"/>
        </div>
        <!-- 新增索引 -->
        <home-index-add v-model="indexAddDialog"/>
        <!-- 数据展示 -->
        <json-dialog :title="indexItem.title" :json="indexItem.data" :open="true" v-model:value="indexItem.dialog"/>
    </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';

import useIndexStore from '@/store/IndexStore';

import IndexItem from "./components/index-item.vue";
import JsonDialog from "@/components/json-dialog/index.vue";
import HomeIndexAdd from './components/index-add.vue';

import {useIndexManageEvent} from "@/global/BeanFactory";
import {useSessionStorage, useWindowSize} from "@vueuse/core";
import {useFuse} from "@vueuse/integrations/useFuse";
import useUrlStore from "@/store/UrlStore";

const size = useWindowSize();


const keyword = useSessionStorage('home-search-keyword', '');
const indexItem = ref({
    dialog: false,
    title: '',
    data: {} as any,
});
const indexAddDialog = ref(false)

const virtualListProps = computed(() => ({
    height: size.height.value - 40 - 15 - 42
}))
const indices = computed(() => useIndexStore().indices
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN")));
const url = computed(() => useUrlStore().url);

const {results} = useFuse(keyword, indices, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }, {
            name: 'alias'
        }]
    }
});

const items = computed(() => {
    return results.value.map(result => result.item)
})


function indexOpenDialog(title: string, content: any) {
    indexItem.value = {
        dialog: true,
        title,
        data: content,
    }
}

function indexOpenManage(name: string) {
    useIndexManageEvent.emit(name);
}

</script>

<style lang="less">
@import url(./index.less);
</style>
