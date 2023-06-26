<template>
    <a-trigger position="top" auto-fit-position :unmount-on-close="false" trigger="click" v-model:popup-visible="show"
        :popup-offset="2">
        <div class="item" style="display: flex;" @click="showIndex">
            <div v-if="index === ''" style="user-select: none;">未选择索引</div>
            <div v-else style="user-select: none;">{{ index }}</div>
            <icon-up style="margin: 5px;" v-if="show" />
            <icon-down style="margin: 5px;" v-else />
        </div>
        <template #content>
            <div class="data-browse-pull-down-panel">
                <a-empty v-if="indices.length === 0" description="请选择链接" />
                <div class="data-browse-pull-down-index" v-else>
                    <a-input v-model="indexFilter" class="data-browse-pull-down-search" ref="dataBrowsePullDownSearch"
                        clearable />
                    <a-scrollbar style="height: 358px" class="data-browse-pull-down-data">
                        <div>
                            <div v-for="item in indicesShow" class="data-browse-list-item"
                                :class="item.name === index ? 'data-browse-list-item-this' : ''"
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
<script lang="ts">
import { defineComponent } from "vue";
import IndexView from "@/view/index/IndexView";
import { mapState } from "pinia";
import useIndexStore from "@/store/IndexStore";
import { stringContain } from "@/utils/SearchUtil";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import mitt from "@/plugins/mitt";

interface Item {

    name: string;

    type: 'index' | 'alias';

    index?: IndexView | undefined;

}

export default defineComponent({
    name: 'db-index-select',
    emit: ['indexChange'],
    data: () => ({
        show: false,
        index: '',
        indexFilter: ''
    }),
    computed: {
        ...mapState(useIndexStore, ['indices']),
        indicesShow(): Array<Item> {
            let items = new Set<Item>();
            let names = new Set<string>();
            if (this.indices.length === 0) {
                return Array.from(items);
            }
            let indices = this.indices.filter(e => this.indexFilter === '' || stringContain(e.name, this.indexFilter));
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
                                type: 'alias'
                            });
                        }
                    }
                }
            }
            // 此处是索引排序
            return Array.from(items).sort((e1, e2) => {
                return e1.name.localeCompare(e2.name, 'zh');
            });
        },
    },
    created() {
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            this.index = '';
        });
    },
    methods: {
        showIndex() {
            this.show = !this.show;
            if (this.show) {
                // 聚焦
                this.$nextTick(() => {
                    let input = this.$refs['dataBrowsePullDownSearch'] as HTMLInputElement;
                    input.focus();
                    this.$nextTick(() => {
                        let element = document.querySelector('.data-browse-list-item-this');
                        if (element) {
                            element.scrollIntoView({
                                behavior: 'smooth'
                            })
                        }
                    })
                });
            }
        },
        indexChange(name: string, type: string, index?: IndexView) {
            this.index = name;
            this.show = false;
            this.$emit('indexChange', {
                name,
                type,
                index
            });
        }
    }
});
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