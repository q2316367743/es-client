<template>
    <div class="base-search-header">
        <div class="left">
            <!-- 索引选择 -->
            <a-select v-model="indexWrap" style="width: 260px;" allow-search allow-clear
                      :placeholder="$t('baseSearch.placeholder.selectIndex')">
                <a-option v-for="index in indices" :key="index.label" :label="index.label"
                          :value="index.value"/>
            </a-select>
            <!-- 搜索 -->
            <a-button type="primary" status="success" @click="$emit('search')" :disabled="indexWrap === ''"
                      title="搜索">
                <template #icon>
                    <icon-search/>
                </template>
            </a-button>
            <!-- 索引管理 -->
            <a-button type="primary" :disabled="indexWrap === ''" @click="$emit('open-index-manage')" title="管理">
                <template #icon>
                    <icon-info/>
                </template>
            </a-button>
        </div>
        <div class="right">
            <!-- 历史 -->
            <a-button type="primary" status="warning" @click="$emit('open-history-dialog')" title="历史">
                <template #icon>
                    <icon-history/>
                </template>
            </a-button>
            <!-- 设置 -->
            <a-button type="primary" title="设置">
                <template #icon>
                    <icon-settings/>
                </template>
            </a-button>
            <a-select v-model="viewWrap" style="margin-left: 8px;width: 140px;">
                <a-option label="基础视图" :value="ViewTypeEnum.BASE"/>
                <a-option :label="$t('common.keyword.jsonView')" :value="ViewTypeEnum.JSON"/>
                <a-option :label="$t('common.keyword.tableView')" :value="ViewTypeEnum.TABLE"/>
                <a-option label="JSON树视图" :value="ViewTypeEnum.JSON_TREE"/>
            </a-select>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {mapState} from "pinia";
import useIndexStore from "@/store/IndexStore";
import {SelectOptionData} from "@arco-design/web-vue";

export default defineComponent({
    name: 'base-search-header',
    emits: ['update:view', 'update:current-index', 'open-index-manage', 'open-history-dialog', 'search'],
    props: {
        view: Number,
        currentIndex: String
    },
    data: () => ({
        ViewTypeEnum,
        viewWrap: ViewTypeEnum.JSON_TREE,
        indexWrap: ''
    }),
    watch: {
        view(newValue) {
            this.viewWrap = newValue;
        },
        viewWrap(newValue) {
            this.$emit('update:view', newValue);
        },
        indexWrap(newValue) {
            this.$emit('update:current-index', newValue);
        },
        currentIndex(newValue) {
            this.indexWrap = newValue;
        }
    },
    computed: {
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
    }
});
</script>
<style scoped lang="less">
.base-search-header{
    display: flex;
    justify-content: space-between;
}
</style>
