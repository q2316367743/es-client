<template>
    <div class="home">
        <!-- 上面的搜索条件 -->
        <div class="home-option">
            <a-input-group>
                <!-- 输入框 -->
                <a-input v-model="keyword" :placeholder="$t('home.placeholder.index')"
                         style="width: 45vw;height: 32px;" allow-clear></a-input>
                <a-trigger trigger="click">
                    <a-button type="secondary">
                        <template #icon>
                            <icon-more/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-descriptions class="home-query-status">
                            <a-descriptions-item label="状态">
                                <a-radio-group v-model="status" type="button">
                                    <a-radio :value="Status.NONE">忽略</a-radio>
                                    <a-radio :value="Status.OPEN">开启</a-radio>
                                    <a-radio :value="Status.CLOSE">关闭</a-radio>
                                </a-radio-group>
                            </a-descriptions-item>
                        </a-descriptions>
                    </template>
                </a-trigger>
                <a-select v-model="order" placeholder="索引排序" style="width: 120px;margin-left: 7px;">
                    <a-option :value="OrderType.NAME_ASC">名称正序</a-option>
                    <a-option :value="OrderType.NAME_DESC">名称倒序</a-option>
                    <a-option :value="OrderType.SIZE_ASC">大小正序</a-option>
                    <a-option :value="OrderType.SIZE_DESC">大小倒序</a-option>
                    <a-option :value="OrderType.DOCS_ASC">文档正序</a-option>
                    <a-option :value="OrderType.DOCS_DESC">文档倒序</a-option>
                </a-select>
            </a-input-group>
            <!-- 新增索引 -->
            <home-index-add/>
        </div>
        <!-- 索引容器 -->
        <div class="home-container" ref="homeContainer">
            <a-list class="home-index-items" :data="items" :virtual-list-props="virtualListProps"
                    :scrollbar="true"
                    :bordered="false" :split="false">
                <template #item="{ item }">
                    <a-list-item :key="item.name">
                        <index-item :index="item" @open-dialog="indexOpenDialog"/>
                    </a-list-item>
                </template>
                <template #empty>
                    <a-empty v-if="items.length === 0" description="空空如也" style="margin-top: 20%"/>
                </template>
            </a-list>
            <a-back-top target-container=".home-container .arco-scrollbar-container"/>
        </div>
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

import {useWindowSize} from "@vueuse/core";
import {useFuse} from "@vueuse/integrations/useFuse";
import {OrderType, Status, useHomeStore} from "@/store/components/HomeStore";
import IndexView from "@/view/index/IndexView";


const size = useWindowSize();

const keyword = useHomeStore().keyword;
const order = useHomeStore().order;
const status = useHomeStore().status;
// 信息弹框
const indexItem = ref({
    dialog: false,
    title: '',
    data: {} as any,
});


const virtualListProps = computed(() => ({
    height: size.height.value - 40 - 15 - 42
}))
const indices = computed(() => {
    let indices = useIndexStore().indices;
    // 状态
    if (status.value !== Status.NONE) {
        if (status.value === Status.OPEN) {
            indices = indices.filter(index => index.state === 'open');
        } else if (status.value === Status.CLOSE) {
            indices = indices.filter(index => index.state === 'close');
        }
    }
    // 排序
    return handleOrder(indices);
});


function handleOrder(records: Array<IndexView>): Array<IndexView> {
    return records
        .sort((a, b) => {
            if (order.value === OrderType.NAME_ASC) {
                return a.name.localeCompare(b.name, "zh-CN");
            } else if (order.value === OrderType.NAME_DESC) {
                return b.name.localeCompare(a.name, "zh-CN");
            } else if (order.value === OrderType.SIZE_ASC) {
                return a.original_size - b.original_size;
            } else if (order.value === OrderType.SIZE_DESC) {
                return b.original_size - a.original_size;
            } else if (order.value === OrderType.DOCS_ASC) {
                return a.doc_count - b.doc_count;
            } else if (order.value === OrderType.DOCS_DESC) {
                return b.doc_count - a.doc_count;
            }
            return 0;
        })
}

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

</script>

<style lang="less">
@import url(./index.less);
</style>
