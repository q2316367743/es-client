<template>
    <vxe-pulldown destroy-on-close v-model="show" class="data-browse-pull-down">
        <div class="item" style="display: flex;" @click="showIndex">
            <div v-if="!index" style="user-select: none;">未选择索引</div>
            <div v-else style="user-select: none;">{{ index.name }}</div>
            <icon-up :size="20" style="margin: 2px;" v-if="show"/>
            <icon-down :size="20" style="margin: 2px;" v-else/>
        </div>
        <template #dropdown>
            <div class="data-browse-pull-down-panel">
                <a-empty v-if="indices.length === 0" description="请选择链接"/>
                <div class="data-browse-pull-down-index" v-else>
                    <a-input v-model="indexFilter" class="data-browse-pull-down-search"
                             ref="dataBrowsePullDownSearch" clearable/>
                    <a-scrollbar style="height: 358px" class="data-browse-pull-down-data">
                        <div>
                            <div v-for="item in indicesShow" class="data-browse-list-item"
                                 :class="item === index ? 'data-browse-list-item-this' : ''"
                                 @click="indexChange(item)">
                                <span>{{ item.name }}</span>
                                <span v-if="item.alias && item.alias.length > 0">
                                            <a-tag v-for="alias in item.alias">{{ alias }}</a-tag>
                                        </span>
                            </div>
                        </div>
                    </a-scrollbar>
                </div>
            </div>
        </template>
    </vxe-pulldown>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import IndexView from "@/view/index/IndexView";
import {mapState} from "pinia";
import useIndexStore from "@/store/IndexStore";
import {stringContain} from "@/utils/SearchUtil";

export default defineComponent({
    name: 'db-index-select',
    emit: ['indexChange'],
    data: () => ({
        show: false,
        index: undefined as IndexView | undefined,
        indexFilter: ''
    }),
    computed: {
        ...mapState(useIndexStore, ['indices']),
        indicesShow(): Array<IndexView> {
            if (this.indices.length === 0) {
                return new Array<IndexView>();
            }
            // 此处是索引排序
            return this.indices
                .filter(e => this.indexFilter === '' || stringContain(e.name, this.indexFilter))
                .sort((e1, e2) => {
                    return e1.name.localeCompare(e2.name, 'zh');
                })
        },
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
        indexChange(index: IndexView) {
            this.index = index;
            this.show = false;
            this.$emit('indexChange', index);
        }
    }
});
</script>
<style lang="less">
// 下拉列表
.data-browse-pull-down {
    .vxe-pulldown--panel {
        left: -170px;
        box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    }
}

.data-browse-pull-down-panel {
    width: 400px;
    height: 400px;
    background-color: var(--container-color);

    .data-browse-pull-down-index {
        width: 400px;
        height: 400px;

        .data-browse-pull-down-search {
            width: 390px;
            padding-left: 10px;
        }

        .data-browse-pull-down-data {
            height: 358px;
            width: 400px;
            margin-top: 5px;
            overflow: auto;
        }
    }

    .data-browse-list-item {
        width: 400px;
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid var(--hover-color);
        cursor: pointer;
        overflow: hidden;
        padding-left: 16px;

        &:hover {
            background-color: var(--hover-color);
        }
    }

    .data-browse-list-item-this {
        color: var(--active-color);
        background-color: var(--hover-color);
    }
}
</style>