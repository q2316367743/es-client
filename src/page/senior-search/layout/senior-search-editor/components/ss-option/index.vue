<template>
  <div class="option">
    <div>
      <a-tooltip :content="allowEdit ? '更新' : '保存'" position="right">
        <a-button type="text" :status="allowEdit ? 'danger' : 'success'" @click="saveHistory()">
          <template #icon>
            <icon-save :size="18"/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="取消与历史记录的关联" v-if="allowEdit" position="right">
        <a-button type="text" status="danger" @click="clearHistory()">
          <template #icon>
            <icon-close/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="格式化" position="right">
        <a-button type="text" status="normal" @click="formatDocument()">
          <template #icon>
            <icon-code/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="清空" position="right">
        <a-button type="text" status="normal" @click="clearBody()">
          <template #icon>
            <format-icon/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="编辑器设置" position="right">
        <a-button type="text" status="normal" @click="useSeniorSearchSetting()">
          <template #icon>
            <icon-settings :size="18"/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="帮助" position="right">
        <a-button type="text" status="normal" @click="openHelp()">
          <template #icon>
            <icon-question-circle :size="18"/>
          </template>
        </a-button>
      </a-tooltip>
    </div>
    <div>
      <slot name="footer"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import FormatIcon from "@/icon/FormatIcon.vue";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {
  useSeniorSearchSetting
} from "@/page/senior-search/layout/senior-search-editor/components/ss-option/SeniorSearchSetting";
import {openUrl} from "@/utils/BrowserUtil";
import Constant from "@/global/Constant";

const allowEdit = computed(() => useSeniorSearchStore().id !== 0);

const openHelp = () => openUrl(Constant.doc.rest);
const formatDocument = () => useSeniorSearchStore().formatDocument();
const clearBody = () => useSeniorSearchStore().clearBody();
const saveHistory = () => useSeniorSearchStore().saveHistory();
const clearHistory = () => useSeniorSearchStore().clearHistory();

</script>
<style lang="less">
.senior-search {
  .option {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 32px;
    border-right: 1px solid var(--color-border-2);

    .arco-btn {
      margin-left: 0;
    }
  }
}
</style>
