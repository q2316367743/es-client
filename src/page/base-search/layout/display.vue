<template>
    <!-- 核心查询区 -->
    <div class="base-display">
        <!-- 查询条件 -->
        <div class="base-condition" ref="baseCondition">
            <a-form :model="current" layout="vertical" label-width="80px"
                    style="overflow-x: auto;overflow-y: hidden;">
                <!-- 条件 -->
                <a-form-item label="条件">
                    <field-condition-container/>
                </a-form-item>
                <!-- 排序 -->
                <a-form-item label="排序">
                    <field-order-container/>
                </a-form-item>
                <div class="base-condition-pagination">
                    <a-pagination :total="current.total" :current="current.page" @change="pageChange($event)"
                                  :page-size="current.size" show-total show-jumper/>
                    <a-input-number :default-value="current.size" style="width: 70px;margin-left: 10px;"
                                    @change="sizeChange($event)"/>
                </div>
            </a-form>
        </div>
        <!-- 查询结果 -->
        <div class="base-content">
            <base-search-data-view/>
        </div>
        <a-back-top target-container=".base-display"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import BaseSearchDataView from "@/page/base-search/components/data-view/index.vue";
import FieldOrderContainer from "@/page/base-search/components/filed-order/container.vue";
import FieldConditionContainer from "@/page/base-search/components/field-condition/container.vue";
import {mapState} from "pinia";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

export default defineComponent({
    name: 'base-search-display',
    components: {FieldConditionContainer, FieldOrderContainer, BaseSearchDataView},
    data: () => ({}),
    computed: {
        ...mapState(useBaseSearchStore, ['current'])
    },
    methods: {
        pageChange(page: number) {
            useBaseSearchStore().setCurrentPage(page);
        },
        sizeChange(size: number) {
            useBaseSearchStore().setCurrentSize(size);
        }
    }
});
</script>
<style scoped>

</style>
