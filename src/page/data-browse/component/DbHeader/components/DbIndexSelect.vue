<template>
    <a-trigger position="top" auto-fit-position :unmount-on-close="false" trigger="click" v-model:popup-visible="show"
               :popup-offset="2">
        <a-button type="text" size="mini" @click="showIndex()">
            <a-space>
                <icon-up style="margin: 5px;" v-if="show"/>
                <icon-down style="margin: 5px;" v-else/>
                <span v-if="name === ''" style="user-select: none;">未选择索引</span>
                <span v-else style="user-select: none;">{{ name }}</span>
            </a-space>
        </a-button>
        <template #content>
            <div class="data-browse-pull-down-panel">
                <a-empty v-if="indices.length === 0" description="请选择链接" style="padding-top: 150px"/>
                <div class="data-browse-pull-down-index" v-else>
                    <a-input v-model="keyword" class="data-browse-pull-down-search" ref="dataBrowsePullDownSearch"
                             allow-clear/>
                    <a-scrollbar style="height: 358px" class="data-browse-pull-down-data">
                        <div>
                            <div v-if="input" class="data-browse-list-item"
                                 :class="input.name === name ? 'data-browse-list-item-this' : ''"
                                 @click="indexChange(input?.name, input?.type)">
                                <span>{{ input.name }}</span>
                                <a-tag color="orange">自定义</a-tag>
                            </div>
                            <div v-for="item in items" class="data-browse-list-item"
                                 :class="item.name === name ? 'data-browse-list-item-this' : ''"
                                 @click="indexChange(item.name, item.type, item.index)">
                                <span>{{ item.name }}</span>
                                <a-tag color="blue" v-if="item.type === 'index'">索引</a-tag>
                                <a-tag color="green" v-else-if="item.type === 'alias'">别名</a-tag>
                            </div>
                        </div>
                    </a-scrollbar>
                </div>
            </div>
        </template>
    </a-trigger>
</template>
<script lang="ts" setup>
import IndexView from "@/view/index/IndexView";
import useIndexStore from "@/store/IndexStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {useFuse} from "@vueuse/integrations/useFuse";


interface Item {

    name: string;

    type: 'index' | 'alias' | 'custom';

    index?: IndexView | undefined;

}


const keyword = ref('');
const show = ref(false);
const dataBrowsePullDownSearch = ref<HTMLDivElement | null>(null);
const input = ref<Item>()

const name = computed(() => useDataBrowseStore().name);
const indices = computed<Array<Item>>(() => {
    let items = new Set<Item>();
    let names = new Set<string>();
    let indices = useIndexStore().indices;
    if (indices.length === 0) {
        return Array.from(items);
    }
    for (let index of indices) {
        // 索引不会重名
        items.add({
            name: index.name,
            type: 'index',
            index
        });
        if (index.alias) {
            for (let alias of index.alias) {
                // 别名可能重复
                if (!names.has(alias)) {
                    names.add(alias);
                    items.add({
                        name: alias,
                        type: 'alias',
                        index
                    });
                }
            }
        }
    }
    // 此处是索引排序
    return Array.from(items).sort((e1, e2) => {
        return e1.name.localeCompare(e2.name, 'zh');
    });
});
const {results} = useFuse(keyword, indices, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }]
    }
});
const items = computed(() => results.value.map(e => e.item));

watch(keyword,  value =>  {
    if (value === '') {
        input.value = undefined;
        return;
    }
    if (indices.value.some(e => e.name.includes(value))) {
        // 存在索引包含关键字
        input.value = undefined;
        return;
    }
    input.value =  {
        name: value,
        type: 'custom'
    }
})


function showIndex() {
    show.value = !show.value;
    if (show.value) {
        // 聚焦
        nextTick(() => {
            if (dataBrowsePullDownSearch.value) {
                dataBrowsePullDownSearch.value.focus();
            }
            nextTick(() => {
                let element = document.querySelector('.data-browse-list-item-this');
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth'
                    })
                }
            })
        });
    }
}

function indexChange(name: string, type: string, index?: IndexView) {
    show.value = false;
    useDataBrowseStore().indexChange({
        name,
        type,
        index
    })
}


</script>
<style lang="less">
// 下拉列表

.data-browse-pull-down-panel {
    width: 400px;
    height: 400px;
    background-color: var(--color-bg-1);
    border-radius: 5px;
    box-shadow: 0 0 6px var(--color-border-2);

    .data-browse-pull-down-index {
        width: 400px;
        height: 400px;

        .data-browse-pull-down-search {
            width: 390px;
            margin-left: 5px;
        }

        .data-browse-pull-down-data {
            height: 358px;
            width: 400px;
            margin-top: 5px;
            overflow: auto;
            color: var(--color-text-1)
        }
    }

    .data-browse-list-item {
        width: 400px;
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid var(--color-border-2);
        cursor: pointer;
        overflow: hidden;
        padding-left: 16px;

        &:hover {
            background-color: var(--color-border-2);
        }

        .arco-tag {
            margin: 8px 4px;
        }
    }

    .data-browse-list-item-this {
        color: rgb(var(--arcoblue-6));
        background-color: var(--color-border-2);
    }
}
</style>
