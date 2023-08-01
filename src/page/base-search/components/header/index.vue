<template>
    <div class="base-search-header">
        <div class="left">
            <!-- 索引选择 -->
            <a-select v-model="index" style="width: 360px;" allow-search allow-clear
                      :placeholder="$t('baseSearch.placeholder.selectIndex')">
                <a-option v-for="index in indices" :key="index.label" :label="index.label"
                          :value="index.value"/>
            </a-select>
            <!-- 搜索 -->
            <a-button type="primary" status="success" @click="search()" :disabled="index === ''"
                      title="搜索">
                <template #icon>
                    <icon-search/>
                </template>
            </a-button>
            <!-- 索引管理 -->
            <a-button type="primary" :disabled="index === ''" @click="openIndexManage()" title="管理">
                <template #icon>
                    <icon-info/>
                </template>
            </a-button>
        </div>
        <div class="right">
            <bsh-manage/>
            <!-- 设置 -->
            <base-search-setting/>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import useIndexStore from "@/store/IndexStore";
import {SelectOptionData} from "@arco-design/web-vue";
import BshManage from "@/page/base-search/components/History/index.vue";
import BaseSearchSetting from "@/page/base-search/components/setting/index.vue";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

export default defineComponent({
    name: 'base-search-header',
    components: {BaseSearchSetting, BshManage},
    data: () => ({
        index: ''
    }),
    watch: {
        index(newValue) {
            useBaseSearchStore().setCurrentIndex(newValue);
        },
        'current.index'(newValue) {
            this.index = newValue;
        }
    },
    computed: {
        ...mapState(useBaseSearchStore, ['current']),
        ...mapState(useIndexStore, {
            indices: (state): SelectOptionData[] => {
                let options = new Array<SelectOptionData>();
                let names = new Set<string>();
                let indices = state.indices;
                indices.forEach(e => {
                    // 索引
                    options.push({
                        label: e.name,
                        value: e.name,
                        index: e.name
                    });
                    // 别名
                    e.alias.forEach(a => {
                        if (!names.has(a)) {
                            options.push({
                                label: a,
                                value: a
                            })
                            names.add(a);
                        }
                    })
                });
                return options.sort((a, b) => {
                    return a.label!.localeCompare(b.label!, "zh-CN");
                });
            }
        }),
    },
    methods: {
        search() {
            useBaseSearchStore().search()
        },
        openIndexManage() {
            useBaseSearchStore().openIndexManage()
        }
    }
});
</script>
<style scoped lang="less">
.base-search-header {
    display: flex;
    justify-content: space-between;
}
</style>
