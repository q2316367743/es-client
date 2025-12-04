<template>
  <div class="base-search-data-view hljs" :style="{height: height}">
    <TableViewer v-if="baseDefaultViewer === ViewTypeEnum.TABLE" :value="current.result" :index="current.index"/>
    <monaco-view v-else :value="current.result" :height="height"/>
  </div>
</template>
<script lang="ts" setup>
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {current} from "@/store/components/BaseSearchStore";
import MonacoView from "@/components/view/MonacoView/index.vue";

const size = useWindowSize();

const baseDefaultViewer = computed(() => useGlobalSettingStore().baseDefaultViewer);
const height = computed(() => (size.height.value - 120) + 'px');
</script>
<style lang="less">
.base-search-data-view {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  position: relative;
  border-left: 1px solid var(--color-border-2);
  border-right: 1px solid var(--color-border-2);
  border-top: 1px solid var(--color-border-2);
  overflow-x: auto;
  overflow-y: hidden;

  &.json-wrap {
    .CompCssDJsonViewTree {
      .wjv-line {
        flex-flow: wrap;
      }
    }

    pre.hljs {
      white-space: pre-wrap; /* css-3 */
      white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
      white-space: -o-pre-wrap; /* Opera 7 */
      word-wrap: break-word; /* Internet Explorer 5.5+ */
      word-break: break-all;
    }
  }

  .json-view-copy {
    position: absolute;
    top: 0;
    right: 15px;
  }

  &.table-viewer-show {
    height: calc(100vh - 108px);
    overflow: hidden;
    padding: 0;
    border: 0;
  }
}
</style>
