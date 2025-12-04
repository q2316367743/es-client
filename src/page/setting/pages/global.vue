<template>
  <div class="setting-global">
    <a-scrollbar style="overflow: auto;height: calc(100vh - 47px);">
      <a-form :model="instance" layout="vertical" >
        <div class="toc">
          <a-anchor :change-hash="false" scroll-container=".setting .arco-scrollbar-container">
            <a-anchor-link href="#new">
              新建索引
            </a-anchor-link>
            <a-anchor-link href="#global-search">
              全局索引查询条件
            </a-anchor-link>
            <a-anchor-link href="#time">
              时间相关设置
            </a-anchor-link>
            <a-anchor-link href="#display">
              显示设置
            </a-anchor-link>
            <a-anchor-link href="#other">
              其他设置
            </a-anchor-link>
          </a-anchor>
        </div>

        <a-divider id="new">新建索引</a-divider>
        <a-form-item label="默认分片数" id="defaultShard">
          <a-input-number controls-position="right" v-model="instance.defaultShard"></a-input-number>
        </a-form-item>
        <a-form-item label="默认副本数" id="defaultReplica">
          <a-input-number controls-position="right" v-model="instance.defaultReplica"></a-input-number>
        </a-form-item>


        <a-divider id="global-search">
          全局索引查询条件（修改后请
          <span class="like-red">刷新</span>
          索引）
        </a-divider>
        <a-form-item label="状态" id="homeSearchState">
          <a-radio-group v-model="instance.homeSearchState">
            <a-radio :value="0">不设置</a-radio>
            <a-radio :value="1">打开</a-radio>
            <a-radio :value="2">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item id="homeExcludeIndices" class="w-full">
          <template #label>
            <span>排除指定索引</span>
            <a-tooltip content="支持正则表达式" placement="top" effect="light">
              <icon-question-circle style="margin-left: 5px;"/>
            </a-tooltip>
          </template>
          <a-input-tag v-model="instance.homeExcludeIndices" allow-clear/>
        </a-form-item>
        <a-form-item id="homeIncludeIndices" class="w-full">
          <template #label>
            <span>显示指定索引</span>
            <a-tooltip content="支持正则表达式" placement="top" effect="light">
              <icon-question-circle style="margin-left: 5px;"/>
            </a-tooltip>
          </template>
          <a-input-tag v-model="instance.homeIncludeIndices" allow-clear style=""/>
        </a-form-item>
        <a-divider id="time">track_total_hits设置</a-divider>
        <a-alert theme="info" title="track_total_hits介绍">
          <p>
            track_total_hits 是
            Elasticsearch（ES）中用于控制搜索请求是否<b>精确计算并返回匹配文档总数</b>的参数。它在 ES
            7.0 版本中引入，主要背景是 Lucene 8 的优化更新（如 WAND 算法），旨在提升查询性能。
          </p>
          <ul>
            <li>true: 精确计算所有匹配文档的总数，性能开销大</li>
            <li>false: 不计算总数，性能最佳</li>
            <li>自定义: 整数（如 100000） 精确计算到该数量为止，超过则返回近似值</li>
          </ul>
        </a-alert>
        <a-form-item
          label-align="top"
          label="track_total_hits模式"
          name="trackTotalHitsMode"
          help="默认为true，当版本低于v7则不会生效"
        >
          <a-radio-group v-model="instance.trackTotalHitsMode" default-value="true">
            <a-radio :value="'true'">true</a-radio>
            <a-radio :value="'false'">false</a-radio>
            <a-radio :value="'custom'">自定义</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="instance.trackTotalHitsMode === 'custom'"
          label-align="top"
          label="track_total_hits值"
          name="trackTotalHitsValue"
        >
          <a-input-number
            v-model="instance.trackTotalHitsValue"
            controls-position="right"
            :min="0"
            :step="1000"
            class="w-240px"
          />
        </a-form-item>


        <a-divider id="time">时间相关设置</a-divider>
        <a-form-item label="超时时间" id="timeout">
          <a-input-number controls-position="right" v-model="instance.timeout" :min="0" :step="1000"
                          placeholder="超时时间">
            <template #suffix>ms</template>
          </a-input-number>
        </a-form-item>
        <a-form-item label="通知关闭时间" id="notificationTime">
          <a-input-number controls-position="right" v-model="instance.notificationTime" :min="0" :step="1000"
                          placeholder="单位（ms）">
            <template #suffix>ms</template>
          </a-input-number>
        </a-form-item>


        <a-divider id="display">显示设置</a-divider>
        <a-form-item label="默认分页大小" id="pageSize">
          <a-input-number controls-position="right" v-model="instance.pageSize"></a-input-number>
        </a-form-item>
        <a-form-item label="基础查询 - 默认视图" id="baseDefaultViewer">
          <a-radio-group v-model="instance.baseDefaultViewer">
            <a-radio label="表格视图" :value="ViewTypeEnum.TABLE">表格视图</a-radio>
            <a-radio label="编辑器视图" :value="ViewTypeEnum.EDITOR">编辑器视图</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="高级查询 - 默认视图" id="seniorDefaultViewer">
          <a-radio-group v-model="instance.seniorDefaultViewer">
            <a-radio label="表格视图" :value="ViewTypeEnum.TABLE">表格视图</a-radio>
            <a-radio label="编辑器视图" :value="ViewTypeEnum.EDITOR">编辑器视图</a-radio>
          </a-radio-group>
        </a-form-item>


        <a-divider id="other">其他设置</a-divider>
        <a-form-item id="lastUrl">
          <template #label>
            <span>保存上次选择的连接</span>
            <a-tooltip content="保存后，下一次打开es-client自动选中该链接" placement="top" effect="light">
              <icon-question-circle style="margin-left: 5px;"/>
            </a-tooltip>
          </template>
          <a-switch v-model="instance.lastUrl" :checked-value="true" :unchecked-value="false" type="round">
            <template #checked>保存</template>
            <template #unchecked>忽略</template>
          </a-switch>
        </a-form-item>

      </a-form>
    </a-scrollbar>
    <div class="extend">
      <ActiveExtend />
    </div>
  </div>
</template>
<script lang="ts">
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import JsonTheme from "@/data/JsonTheme";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";
import {getDefaultGlobalSetting, GlobalSetting} from "@/entity/setting/GlobalSetting";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default defineComponent({
  name: 'setting-base',
  computed: {
    ViewTypeEnum() {
      return ViewTypeEnum
    }
  },
  data: () => ({
    instance: getDefaultGlobalSetting(),
    PageNameEnum,
    JsonTheme,
    TableHeaderModeEnum,
  }),
  created() {
    this.instance = useGlobalSettingStore().globalSetting;
  },
  watch: {
    instance: {
      handler(newValue: GlobalSetting) {
        useGlobalSettingStore().setGlobalSetting(newValue);
      },
      deep: true
    }
  },
  methods: {}
});
</script>
<style lang="less">
.home-exclude-index {
  margin-left: 5px;

  &:first-child {
    margin-left: 0;
  }
}

.home-exclude-item {
  margin-left: 5px;
}

.like-red {
  color: rgb(var(--orange-6));
}

.setting-global {
  margin-top: 7px;
  height: calc(100vh - 47px);

  .toc {
    position: fixed;
    top: 108px;
    right: 24px;
    max-height: calc(100vh - 176px);
    overflow: auto;
    background-color: var(--color-neutral-2);
    border: 1px solid var(--color-neutral-3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    z-index: 2;
  }

  .arco-form-item-wrapper-col {
    width: 350px;
  }

  .w-full {

    .arco-form-item-wrapper-col {
      width: 100%;
    }
  }
}
.extend {
  position: absolute;
  right: 16px;
  bottom: 0;
}
</style>
