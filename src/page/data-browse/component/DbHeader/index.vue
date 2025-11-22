<template>
  <div class="option">
    <!-- 左侧条件 -->
    <a-button-group class="left">
      <page-help/>
      <div class="sep"></div>
      <db-simple-item :disable="type === ''" tip="刷新" @click="executeQuery(false)">
        <icon-refresh/>
      </db-simple-item>
      <div class="sep"></div>
      <db-simple-item tip="新增" @click="recordAdd">
        <icon-plus/>
      </db-simple-item>
      <db-simple-item :disable="selectedKeys.length === 0" tip="删除" @click="recordReduce">
        <icon-minus/>
      </db-simple-item>
      <db-simple-item :disable="selectedKeys.length !== 1"
                      tip="更新"
                      @click="recordEdit">
        <icon-edit/>
      </db-simple-item>
    </a-button-group>
    <!-- 右侧条件 -->
    <a-button-group class="right">
      <!-- 选择索引 -->
      <db-index-select/>
      <!-- 打印 -->
      <db-simple-item :disable="!name" tip="打印" @click="openExportDialog">
        <icon-printer/>
      </db-simple-item>
      <!-- 索引结构 -->
      <db-simple-item :disable="type !== 'index'" tip="索引结构" @click="openMappingDrawer">
        <icon-nav/>
      </db-simple-item>
      <!-- 跳转到基础查询 -->
      <db-simple-item :disable="type === ''" tip="跳转到 基础查询" @click="jumpToBaseSearchWrapper">
        <icon-search/>
      </db-simple-item>
      <!-- 跳转到高级查询 -->
      <db-simple-item :disable="type === ''" tip="跳转到 高级查询" @click="jumpToSeniorSearchWrapper">
        <icon-filter/>
      </db-simple-item>
      <!-- 筛选 -->
      <db-table-header/>
      <!-- 操作 -->
      <a-dropdown trigger="click">
        <a-button type="text" size="mini">
          <template #icon>
            <icon-more-vertical/>
          </template>
        </a-button>
        <template #content>
          <a-doption @click="openHelp()">帮助</a-doption>
          <a-doption @click="openDbSetting()">设置</a-doption>
        </template>
      </a-dropdown>
    </a-button-group>
  </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useRouter} from "vue-router";
import Constant from "@/global/Constant";
import {showDataExportDrawer} from "@/components/DataExport";
import {map} from "@/utils/ArrayUtil";
import MessageUtil from "@/utils/MessageUtil";
import PageNameEnum from "@/enumeration/PageNameEnum";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import DataBuild from "@/page/data-browse/build/DataBuild";
import {execAdd, execUpdate} from "@/page/data-browse/component/DbHeader/func";
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";
import {openDbSetting} from "@/page/data-browse/component/DbHeader/DbSetting";
import {jumpToBaseSearch, jumpToSeniorSearch, useDbResultRecords} from "@/page/data-browse/store/DbResultStore";
import PageHelp from "@/page/data-browse/component/DbHeader/components/PageHelp.vue";
import DbIndexSelect from "@/page/data-browse/component/DbHeader/components/DbIndexSelect.vue";
import DbSimpleItem from "@/page/data-browse/component/DbHeader/components/DbSimpleItem.vue";
import DbTableHeader from "@/page/data-browse/component/DbHeader/components/DbTableHeader.vue";
import {openUrl} from "@/utils/BrowserUtil";

const router = useRouter();

const index = computed(() => useDataBrowseStore().index);
const name = computed(() => useDataBrowseStore().name);
const type = computed(() => useDataBrowseStore().type);
const selectedKeys = computed(() => useDataBrowseStore().selectedKeys);
const indexName = computed(() => index.value ? index.value.name : '')

const recordReduce = (deleteRowIndies?: Array<string>) => useDataBrowseStore().reduce(deleteRowIndies);
const executeQuery = (renderHeader?: boolean) => useDataBrowseStore().executeQuery(renderHeader);
const openMappingDrawer = () => useDataBrowseStore().openMappingDrawer();
const jumpToBaseSearchWrapper = () => jumpToBaseSearch(() => router.push(PageNameEnum.BASE_SEARCH));
const jumpToSeniorSearchWrapper = () => {
  jumpToSeniorSearch(() => router.push(PageNameEnum.SENIOR_SEARCH));
}

function recordEdit(_id?: string) {
  if (!index.value) {
    MessageUtil.error('请选择索引');
    return;
  }
  let record;
  const recordMap = map(useDbResultRecords.value, '_id');
  if (selectedKeys.value.length !== 1) {
    if (_id) {
      record = recordMap.get(_id);
      if (!record) {
        return;
      }
    } else {
      return;
    }
  } else {
    record = selectedKeys.value[0];
  }
  execUpdate(indexName.value, record['_id'], record['_source'])
    .then(({id, data}) => useDataBrowseStore().update(id, data)
      .then(() => MessageUtil.success("更新成功"))
      .catch(e => MessageUtil.error("更新失败", e)));
}

function recordAdd() {
  if (!index.value) {
    return;
  }
  execAdd(indexName.value, DataBuild(index.value.mapping))
    .then(data => useDataBrowseStore().add(data))
}

function openExportDialog() {
  // 选择了索引
  if (!name.value) {
    MessageUtil.error('请选择索引');
    return;
  }
  // 有记录
  if (useDbResultRecords.value.length === 0) {
    MessageUtil.warning('数据为空');
    return;
  }
  // 显示导出对话框
  showDataExportDrawer({
    name: useDataBrowseStore().name,
    index: useDataBrowseStore().name,
    search: useDbConditionStore().buildSearchQuery()
  })
}

const openHelp = () => openUrl(Constant.doc.dataBrowse);
</script>
<style scoped>

</style>
