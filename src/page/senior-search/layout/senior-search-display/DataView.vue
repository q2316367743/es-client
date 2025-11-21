<template>
  <div class="senior-search-data-view hljs">
    <!-- 标签 -->
    <div class="tabs">
      <div class="tab" :class="itemActive === -1 ? 'active' : ''" @click="itemActive = -1">
        <a-tooltip content="固定">
          <icon-subscribe-add @click.stop="fixAdd()"/>
        </a-tooltip>
        <span class="ssd-v-title">结果</span>
      </div>
      <div class="tab fix" v-for="(item, index) in items" :class="itemActive === index ? 'active' : ''"
           @click="itemActive = index">
        <a-tooltip content="取消后将会关闭">
          <icon-subscribe @click.stop="fixDelete(index)"/>
        </a-tooltip>
        <span class="ssd-v-title">结果{{ item.title }}</span>
      </div>
    </div>
    <!-- 内容 -->
    <div class="base-scroll" :class="jsonWrap ? 'json-wrap' : ''">
      <!-- 固定的标签 -->
      <div class="fix-scroll" v-for="(item, index) in items" v-show="itemActive === index">
        <table-viewer v-if="item.view === ViewTypeEnum.TABLE" :value="item.data"/>
        <monaco-view v-else/>
      </div>
      <!-- 当前的标签 -->
      <div class="current-scroll" v-show="itemActive === -1">
        <table-viewer v-if="view === ViewTypeEnum.TABLE" :value="data"/>
        <monaco-view v-else :value="data"/>
      </div>
    </div>
    <a-button type="text" link class="json-view-copy" v-show="view !== ViewTypeEnum.TABLE" @click="execCopy()">复制
    </a-button>
  </div>
</template>
<script lang="ts">
import {computed, defineComponent} from "vue";
import {mapState} from "pinia";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";

// 工具
import Optional from "@/utils/Optional";
// 枚举
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableViewer from "@/components/view/TableViewer/index.vue";
import MessageUtil from "@/utils/MessageUtil";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {useWindowSize} from "@vueuse/core";
import BaseView from "@/components/view/BaseView/index.vue";
import JsonView from "@/components/view/JsonView/index.vue";
import JsonTreeView from "@/components/view/JsonTreeView/index.vue";
import MonacoView from "@/components/view/MonacoView/index.vue";
import {formatJsonString} from "@/algorithm/file";

/**
 * 每一项
 */
interface Item {

  /**
   * 标题
   */
  title: string;

  /**
   * 视图
   */
  view: ViewTypeEnum;

  /**
   * 数据
   */
  data: any;


}

export default defineComponent({
  name: 'senior-search-data-view',
  components: {MonacoView, JsonTreeView, JsonView, BaseView, MonacoEditor, TableViewer},
  props: {
    view: {
      type: Number,
      default: () => ViewTypeEnum.JSON
    },
    data: String,
  },
  data: () => ({
    wrapper: {} as any,
    copyable: {copyText: "复制", copiedText: "复制成功", timeout: 2000},
    Optional,
    ViewTypeEnum,
    items: new Array<Item>(),
    index: 0,
    // 活动的标签页
    itemActive: -1
  }),
  computed: {
    ...mapState(useGlobalSettingStore, ['jsonFontSize', 'jsonWrap'])
  },
  setup() {
    const size = useWindowSize();
    const height = computed(() => (size.height.value - 120) + 'px');
    return {
      height
    }
  },
  methods: {
    execCopy() {
      if (!this.data) {
        return;
      }
      utools.copyText(formatJsonString(this.data));
      MessageUtil.success("已成功复制到剪切板");
    },
    fixAdd() {
      this.index += 1;
      this.items.push({
        title: this.index + '',
        view: this.view,
        data: typeof this.data === 'object' ? this.data : {},
      });
    },
    fixDelete(index: number) {
      this.items.splice(index, 1);
      if (index === this.itemActive) {
        this.itemActive = -1;
      }
    }
  }
});
</script>
<style lang="less">
.senior-search-data-view {
  height: 100%;
  width: 100%;
  position: relative;

  .tabs {
    position: absolute;
    top: 3px;
    left: 6px;
    right: 6px;
    height: 26px;
    display: flex;
    border-bottom: var(--color-neutral-3);

    .tab {
      margin: 0 5px;
      cursor: pointer;
      padding: 6px 8px;

      &.active {
        background-color: var(--color-neutral-4);

        &:hover {
          background-color: var(--color-neutral-4);
        }
      }

      &:hover {
        background-color: var(--color-neutral-2);
      }

      &.fix {
        .arco-icon {
          color: rgb(var(--arcoblue-6));
        }
      }

      .arco-icon {
        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }

      .ssd-v-title {
        margin-left: 4px;
      }
    }
  }

  .base-scroll {
    position: absolute;
    top: 30px;
    left: 6px;
    right: 6px;
    bottom: 4px;

    &.json-wrap {
      .CompCssDJsonViewTree {
        .wjv-line {
          flex-flow: wrap;
        }
      }

      pre.hljs {
        white-space: pre-wrap;
        /* css-3 */
        white-space: -moz-pre-wrap;
        /* Mozilla, since 1999 */
        white-space: -o-pre-wrap;
        /* Opera 7 */
        word-wrap: break-word;
        /* Internet Explorer 5.5+ */
        word-break: break-all;
      }
    }

    .fix-scroll {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .arco-scrollbar {
        position: absolute;
        top: 4px;
        left: 6px;
        right: 6px;
        bottom: 4px;

        .scrollbar {
          overflow: auto;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

        }
      }
    }

    .current-scroll {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

    }

    .json-scroll {
      .arco-scrollbar {
        position: absolute;
        top: 4px;
        left: 6px;
        right: 6px;
        bottom: 4px;

        .scrollbar {
          overflow: auto;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

        }
      }
    }
  }


  .json-view-copy {
    position: absolute;
    top: 0;
    right: 15px;
  }
}
</style>
