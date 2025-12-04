<template>
  <div class="table-viewer" :id="id">
    <div class="table-view-toolbar">
      <a-trigger trigger="click" :unmount-on-close="false" :popup-translate="[75, 3]">
        <a-button type="outline" size="small">
          <template #icon>
            <icon-select-all/>
          </template>
          {{ `${showColumns.length} / ${columns.length}` }}
        </a-button>
        <template #content>
          <div class="table-view-trigger">
            <a-list style="width: 250px">
              <template #header>
                <a-button type="primary" size="small" @click="resetColumn">重置</a-button>
              </template>
              <a-scrollbar style="height: 341px;overflow: auto;">
                <a-list-item v-for="(column, i) in columns" style="width: 250px;margin: 5px 3px;">
                  <a-checkbox v-model="columns[i].show">{{ column.title }}</a-checkbox>
                </a-list-item>
              </a-scrollbar>
            </a-list>
          </div>
        </template>
      </a-trigger>
    </div>
    <div class="table-view-wrap">
      <a-table :columns="showColumns" :data="records" :expandable="expandable" hoverable column-resizable
               scrollbar :scroll="scroll" :pagination="false" row-key="_id" :bordered="bordered"
               :draggable="draggable"/>
    </div>
  </div>
</template>
<script lang="ts">
import {TableBorder, TableColumnData, TableData, TableDraggable, TableExpandable} from "@arco-design/web-vue";

import MonacoView from "@/components/view/MonacoView/index.vue";
import MessageUtil from "@/utils/MessageUtil";
import {searchResultToTable} from "@/algorithm/format";
import {copyText} from "@/utils/BrowserUtil";
import {DataSearchColumnConfig} from "@/domain/core";


export default defineComponent({
  name: 'table-viewer',
  props: {
    value: {
      type: String,
      default: () => ""
    },
  },
  components: {MonacoView},
  data: () => {
    let now = new Date().getTime();
    return {
      // 渲染表头
      renderColumns: [] as Array<TableColumnData>,
      // 映射表头
      mappingColumns: [] as Array<TableColumnData>,
      records: [] as Array<TableData>,
      columns: [] as Array<DataSearchColumnConfig>,
      emptyText: '空空如也',

      oldIndex: '',

      id: 'table-view-' + now,

      // 配置
      expandable: {
        title: '源数据',
        width: 80,
        expandedRowRender: (record: TableData) => {
          return h(MonacoView, {
            value: record['_source'],
            height: '400px'
          });
        }
      } as TableExpandable,
      bordered: {wrapper: true, cell: true} as TableBorder,
      scroll: {
        x: '100%',
        y: '100%'
      },
      draggable: {
        type: 'handle'
      } as TableDraggable,

      allowUpdate: true,
    }
  },
  watch: {
    value() {
      this.render();
    }
  }, computed: {
    showColumns() {
      return this.columns.filter(c => c.show).map(c => ({
        dataIndex: c.field,
        title: c.title,
        width: c.width,
        fixed: c.fixed,
        ellipsis: true,
        resizable: true,
        sortable: true,
        align: 'left'
      }))
    }
  },
  mounted() {
    // 注册够渲染
    this.render();
  },
  methods: {
    render() {
      // 当变化时，进行渲染
      // 数据处理
      if (!this.value || !this.value.trim()) {
        this.columns = [];
        this.records = [];
        return;
      }
      console.log(this.value)
      let {columns, records} = searchResultToTable(this.value);
      // 映射表头
      this.columns = columns;
      this.records = records;
      // 数据清空
      let x = 0;
      this.columns.map((e: any) => e.width).forEach((e: any) => x += (e || 0));
      this.scroll.x = `${x}px`;
    },
    copy(value: any) {
      copyText(value);
      MessageUtil.success("已成功复制到剪切板");
    },
    resetColumn() {
      this.columns.forEach(c => {
        c.show = true;
      });
    },
  }
});
</script>
<style lang="less">
.table-viewer {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: var(--color-bg-2);

  .table-view-toolbar {
    margin: 2px;
    display: flex;

    .arco-btn {
      margin: 2px 0;
    }

    .arco-select {
      width: 180px;
      margin-left: 8px;
    }
  }

  .table-view-wrap {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.arco-table-container {
  height: 100%;
}

.table-view-trigger {
  width: 250px;
  height: 400px;
  background-color: var(--color-fill-2);
  border-radius: var(--border-radius-small);
  box-shadow: 0 0 12px var(--color-border-2);
  display: flex;

  .arco-list-header {
    text-align: center;
  }
}
</style>
