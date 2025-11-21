<template>
  <div class="base-search-header">
    <div class="left">
      <!-- 索引选择 -->
      <a-select v-model="current.index" style="width: 40vw;" allow-search allow-clear allow-create
                placeholder="请选择索引">
        <a-option v-for="index in indices" :key="index.label" :label="index.label"
                  :value="index.value"/>
      </a-select>
      <!-- 搜索 -->
      <a-button type="primary" status="success" @click="baseSearchExecute()" :disabled="current.index === ''"
                title="搜索">
        <template #icon>
          <icon-search/>
        </template>
      </a-button>
      <!-- 索引管理 -->
      <a-button type="primary" :disabled="current.index === ''" @click="openIndexManage()" title="索引信息">
        <template #icon>
          <icon-info/>
        </template>
      </a-button>
      <a-button type="outline" :disabled="current.index === ''" @click="printHandler()" title="打印">
        <template #icon>
          <icon-printer/>
        </template>
      </a-button>
    </div>
    <div class="right">
      <sentence/>
      <bsh-manage/>
      <!-- 设置 -->
      <base-search-setting/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {SelectOptionData} from "@arco-design/web-vue";
import {statistics} from "@/global/BeanFactory";
import {showDataExportDrawer} from "@/components/DataExport";
import BshManage from "@/page/base-search/layout/BaseSearchHeader/History/index.vue";
import Sentence from "@/page/base-search/layout/BaseSearchHeader/sentence.vue";
import BaseSearchSetting from "@/page/base-search/components/setting/index.vue";
import useIndexStore from "@/store/IndexStore";
import {baseSearchExecute, current, getBaseSearchCondition, openIndexManage} from "@/store/components/BaseSearchStore";


const indices = computed<Array<SelectOptionData>>(() => {
  let options = new Array<SelectOptionData>();
  let names = new Set<string>();
  let indices = useIndexStore().indices;
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
})

function printHandler() {
  statistics.access("func_base_search", "打印");
  showDataExportDrawer({
    name: current.value.index,
    index: current.value.index,
    search: getBaseSearchCondition()
  })
}

</script>
<style scoped lang="less">
.base-search-header {
  display: flex;
  justify-content: space-between;
}
</style>
