<template>
  <!-- 核心查询区 -->
  <div class="base-display">
    <!-- 查询条件 -->
    <div class="base-condition">
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
<script lang="ts" setup>
import {current} from "@/store/components/BaseSearchStore";
import BaseSearchDataView from "@/page/base-search/components/data-view/index.vue";
import FieldOrderContainer from "@/page/base-search/components/filed-order/container.vue";
import FieldConditionContainer from "@/page/base-search/components/field-condition/container.vue";

function pageChange(page: number) {
  current.value.page = page;
}

function sizeChange(size?: number) {
  if (typeof size !== 'undefined') {
    current.value.size = size;
  }
}

</script>
<style scoped>

</style>
