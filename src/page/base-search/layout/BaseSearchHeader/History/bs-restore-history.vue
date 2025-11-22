<template>
  <div class="bs-history">
    <div class="bs-history-toolbar">
      <a-input v-model="name" placeholder="名称" style="width: 60%;" allow-clear/>
      <a-switch v-model="onlyCurrent" style="margin-left: 12px;" type="round">
        <template #checked>当前链接</template>
        <template #unchecked>全部</template>
      </a-switch>
    </div>
    <div class="bs-history-body">
      <a-table :data="histories" class="data" style="height: 100%;">
        <template #columns>
          <a-table-column data-index="name" title="名字"></a-table-column>
          <a-table-column data-index="index" title="索引">
            <template #cell="{ record }">
              <a-link type="primary" target="_blank">{{ record.index }}</a-link>
              <div class="url-copy" @click="execCopy(record.index)">复制</div>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="200" fixed="right">
            <template #cell="{ record }">
              <a-button type="primary" status="success" size="small" @click="load(record)">
                加载
              </a-button>
              <a-popconfirm content="确认删除此条记录？" ok-text="删除" cancel-text="取消"
                            @ok="removeById(record.id)"
                            width="200px">
                <a-button type="primary" status="danger" size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts">
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";
import MessageUtil from "@/utils/MessageUtil";
import {baseSearchLoadHistory} from "@/store/components/BaseSearchStore";
import {copyText} from "@/utils/BrowserUtil";

export default defineComponent({
  name: 'bsh-history',
  emits: ['close'],
  data: () => ({
    histories: new Array<BaseSearchHistory>(),
    name: '',
    onlyCurrent: true,
  }),
  methods: {
    execCopy(url: string) {
      copyText(url);
      MessageUtil.success("已成功复制到剪切板");
    },
    load(history: BaseSearchHistory) {
      baseSearchLoadHistory(history);
      this.$emit('close');
    },
    removeById(id: number) {
      console.log(id);
    },
  }
});
</script>
<style scoped lang="less">
.bs-history {
  .bs-history-body {
    margin-top: 7px;
  }
}
</style>
