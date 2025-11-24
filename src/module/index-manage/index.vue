<template>
  <a-drawer :title="index" class="index-manage-drawer" v-model:visible="drawer" :width="600" render-to-body
            unmount-on-close popup-container="#main">
    <div class="index-manage">
      <a-tabs v-model:active-key="active" class="tab">
        <a-tab-pane title="总览" key="1"/>
        <a-tab-pane title="设置" key="2"/>
        <a-tab-pane title="映射" key="3"/>
        <a-tab-pane title="统计信息" key="4"/>
      </a-tabs>
      <a-spin :loading="loading" tip="加载中">
        <div class="content">
          <a-alert v-if="active === '3'" title="Mapping 看得头疼？" style="margin-bottom: 8px;">
            <span>🌳</span>
            <AppLink event="查看mapping"/>
            <span>用树形表格清晰展示 Mapping 结构，一目了然！</span>
          </a-alert>
          <monaco-view :value="pretty" v-show="jsonViewShow" read-only :height="active === '3' ? 'calc(100vh - 268px)' : 'calc(100vh - 176px)'"/>
          <index-manage-summary ref="indexManageSummary" v-show="!jsonViewShow" :index="index"
                                :state="state"/>
        </div>
      </a-spin>
    </div>
    <template #footer>
      <a-dropdown trigger="click" @select="indexManage">
        <a-button type="primary">
          管理
          <icon-up/>
        </a-button>
        <template #content>
          <a-doption value="open" v-if="state === 'close'">打开索引</a-doption>
          <a-doption value="close" v-else-if="state === 'open'">关闭索引</a-doption>
          <a-doption disabled value="merge">强制合并索引</a-doption>
          <a-doption value="refresh">刷新索引</a-doption>
          <a-doption value="clear">清除索引缓存</a-doption>
          <a-doption value="flush">flush索引</a-doption>
          <a-doption disabled value="freeze">冻结索引</a-doption>
          <a-doption value="remove">删除索引</a-doption>
          <a-doption disabled value="lifecycle">增加生命周期</a-doption>
        </template>
      </a-dropdown>
    </template>
  </a-drawer>
</template>
<script lang="ts">
import JsonView from "@/components/view/JsonView/index.vue";
import {contains} from "@/utils/ArrayUtil";
import IndexApi from "@/components/es/IndexApi";
import Assert from "@/utils/Assert";
import IndexManageSummary from "@/module/index-manage/summary.vue";
import MessageUtil from "@/utils/MessageUtil";
import useIndexStore from "@/store/IndexStore";
import Optional from "@/utils/Optional";
import {mapState} from "pinia";
import {useIndexManageEvent} from "@/global/BeanFactory";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import IndexMapping from "@/components/IndexMapping/index.vue";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";
import {formatJsonString} from "@/algorithm/file";

export default defineComponent({
  name: 'index-manage',
  emits: ['update:modelValue'],
  components: {MonacoEditor, IndexMapping, IndexManageSummary, JsonView},
  data: () => ({
    drawer: false,
    active: '1',
    data: '',
    loading: false,
    index: ''
  }),
  watch: {
    active(newValue: string) {
      this.assignJson(newValue);
    },
    index() {
      this.$nextTick(() => {
        this.assignJson(this.active);
      })
    }
  },
  computed: {
    jsonViewShow() {
      return contains(['2', '3', '4'], this.active);
    },
    ...mapState(useIndexStore, ['indicesMap']),
    state(): 'open' | 'close' | '' {
      let indexView = useIndexStore().indicesMap.get(this.index);
      return Optional.ofNullable(indexView).map(e => e.state).orElse('');
    },
    pretty() {
      return formatJsonString(this.data);
    }
  },
  created() {
    useIndexManageEvent.on(index => {
      this.drawer = true;
      this.index = index;
    })
  },
  methods: {
    assignJson(newValue: string) {
      switch (newValue) {
        case '2':
          this.setting();
          break;
        case '3':
          this.mapping();
          break;
        case '4':
          this.stats();
          break;
      }
    },
    setting() {
      Assert.notNull(this.index, "索引名称不存在");
      this.loading = true;
      IndexApi(this.index)._settings().then(result => {
        this.data = stringifyJsonWithBigIntSupport(result[this.index]);
      }).catch(e => {
        MessageUtil.error('索引设置查询错误', e);
        this.data = '{}';
      }).finally(() => {
        this.loading = false;
      })
    },
    mapping() {
      Assert.notNull(this.index, "索引名称不存在");
      this.loading = true;
      IndexApi(this.index)._mappings().then(result => {
        this.data = stringifyJsonWithBigIntSupport(result[this.index!]);
      }).catch(e => {
        MessageUtil.error('索引映射查询错误', e);
        this.data = '{}';
      }).finally(() => {
        this.loading = false;
      })
    },
    stats() {
      Assert.notNull(this.index, "索引名称不存在");
      this.loading = true;
      IndexApi(this.index)._stats().then(result => {
        this.data = stringifyJsonWithBigIntSupport(result);
      }).catch(e => {
        MessageUtil.error('索引状态查询错误', e);
        this.data = '{}';
      }).finally(() => {
        this.loading = false;
      })
    },
    indexManage(command: any) {
      this.execCommand(command).then(() => {
        // 1. 发送索引更新事件
        useIndexStore().reset();
        // 3. 更新本组件
        this.assignJson(this.active);
      }).catch(e => console.error(e));
    },
    execCommand(command: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        switch (command) {
          case 'open':
            IndexApi(this.index)._open()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('打开索引错误', e, () => reject(e)));
            break;
          case 'close':
            IndexApi(this.index)._close()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('关闭索引错误', e, () => reject(e)));
            break;
          case 'merge':
            break;
          case 'refresh':
            IndexApi(this.index)._refresh()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('刷新索引失败', e, () => reject(e)));
            break;
          case 'clear':
            IndexApi(this.index)._cacheClear()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('清理缓存失败', e, () => reject(e)));
            break;
          case 'flush':
            IndexApi(this.index)._flush()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('flush刷新失败', e, () => reject(e)));
            break;
          case 'freeze':
            break;
          case 'remove':
            MessageBoxUtil.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }).then(() => IndexApi(this.index).delete()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('索引删除错误', e, () => reject(e))));
            break;
          case 'lifecycle':
            break;
        }
      })
    }
  }
});
</script>
<style lang="less">
.index-manage-drawer {
  .index-manage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .tab {
      position: absolute;
      top: 5px;
      left: 20px;
      right: 20px;
    }

    .content {
      position: absolute;
      top: 54px;
      left: 20px;
      right: 20px;
      bottom: 0;
      overflow: auto;
    }

  }

  .arco-drawer-footer {
    text-align: left !important;
  }
}
</style>
