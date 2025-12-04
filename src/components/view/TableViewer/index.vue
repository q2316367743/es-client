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
import Sortable from 'sortablejs';

import MonacoView from "@/components/view/MonacoView/index.vue";
import MessageUtil from "@/utils/MessageUtil";
import {searchResultToTable} from "@/algorithm/format";
import {copyText} from "@/utils/BrowserUtil";
import {DataSearchColumnConfig} from "@/domain/core";

let sort: Sortable | undefined;

export default defineComponent({
  name: 'table-viewer',
  props: {
    value: {
      type: String,
      required: true
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
      if (!this.value) {
        this.showColumns = [];
        this.columns = [];
        this.records = [];
        return;
      }
      let {columns, records} = searchResultToTable(this.value);
      // 映射表头
      this.columns = columns;
      this.records = records;
      // 数据清空
      let x = 0;
      this.columns.map((e: any) => e.width).forEach((e: any) => x += (e || 0));
      this.scroll.x = `${x}px`;
      // 拖拽
      this.$nextTick(() => {
        this.addSortable();
      })
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
    addSortable() {
      let tableViewWrap = document.getElementById(this.id);
      if (sort) {
        sort.destroy();
      }
      const wrapperTr = tableViewWrap!.querySelector('.arco-table-tr')! as HTMLElement;
      sort = Sortable.create(wrapperTr, {
        draggable: '.arco-table-th',
        filter: '.table-view-fixed',
        swapThreshold: 1,
        animation: 150,
        delay: 0,
        onUpdate: (evt: any) => {
          const {newIndex, oldIndex} = evt;
          if (newIndex == oldIndex) {
            // 没有变位置，直接返回
            return;
          }
          // 表头修改
          const newItem = wrapperTr.children[newIndex];
          const oldItem = wrapperTr.children[oldIndex];

          // 先删除移动的节点
          wrapperTr.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            wrapperTr.insertBefore(newItem, oldItem)
          } else {
            wrapperTr.insertBefore(newItem, oldItem.nextSibling)
          }
          // 列变化
          this.$nextTick(() => {
            // 变化列
            const currRow = this.showColumns.splice(oldIndex - 2, 1)[0];
            this.showColumns.splice(newIndex - 2, 0, currRow);
          });
        }
      });
    }
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
