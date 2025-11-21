<template>
  <a-tooltip content="显示查询条件" position="bottom">
    <a-button type="dashed" @click="showBody()">
      <template #icon>
        <icon-search/>
      </template>
    </a-button>
  </a-tooltip>
  <a-tooltip content="跳转到高级查询" position="bottom">
    <a-button type="dashed" @click="jumpToSeniorSearch()">
      <template #icon>
        <icon-filter/>
      </template>
    </a-button>
  </a-tooltip>
  <a-tooltip content="复制到剪切板" position="bottom">
    <a-button type="dashed" @click="execCopy()">
      <template #icon>
        <icon-copy/>
      </template>
    </a-button>
  </a-tooltip>
  <a-tooltip v-if="Constant.isSupportPin" content="钉住" position="bottom">
    <a-button type="dashed" @click="pin()">
      <template #icon>
        <icon-subscribed/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script lang="ts" setup>
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import {current, getBaseSearchCondition} from "@/store/components/BaseSearchStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {jsonToHtml, showJson} from "@/utils/DialogUtil";
import {useRouter} from "vue-router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import Constant from "@/global/Constant";
import {BrowserWindowType, createDataBrowserWindow} from "@/plugins/native/browser-window";
import NotificationUtil from "@/utils/NotificationUtil";
import {statistics} from "@/global/BeanFactory";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";

const router = useRouter();


function jumpToSeniorSearch() {
  if (!current.value.index) {
    MessageUtil.warning("请选择索引再跳转。");
    return;
  }
  statistics.access("func_base_search", "跳转到基础查询");
  try {
    useSeniorSearchStore().loadEvent({
      link: `/${current.value.index}/_search`,
      method: 'POST',
      body: stringifyJsonWithBigIntSupport(
        QueryConditionBuild(current.value.conditions, current.value.page, current.value.size, current.value.orders))
    }, false);
    router.push(PageNameEnum.SENIOR_SEARCH);
  } catch (e) {
    MessageUtil.error('条件构造错误', e);
  }
}

function execCopy() {
  statistics.access("func_base_search", "复制查询条件");
  utools.copyText(stringifyJsonWithBigIntSupport(QueryConditionBuild(current.value.conditions, current.value.page, current.value.size, current.value.orders)));
  MessageUtil.success("已成功复制到剪切板");
}

function showBody() {
  statistics.access("func_base_search", "显示查询条件");
  try {
    showJson("查询条件", getBaseSearchCondition());
  } catch (e) {
    MessageUtil.error('条件构造错误', e);
  }
}

function pin() {
  statistics.access("func_base_search", "钉住");
  if (Constant.isSupportPin) {
    const {html, original} = jsonToHtml(current.value.result);
    createDataBrowserWindow(BrowserWindowType.JSON, html, original, {
      title: "查询结果",
      alwaysOnTop: true
    })
  } else {
    NotificationUtil.warning("目前只有utools支持json钉住，请使用utools版本");
  }
}

</script>
<style scoped>

</style>
