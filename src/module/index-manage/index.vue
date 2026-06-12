<template>
  <t-drawer
    :header="index"
    class="index-manage-drawer"
    v-model:visible="drawer"
    size="960px"
    destroy-on-close
  >
    <div class="index-manage">
      <t-tabs v-model="active" class="tab">
        <t-tab-panel :label="$t('module.index_manage.tab.overview')" value="1" />
        <t-tab-panel :label="$t('module.index_manage.tab.setting')" value="2" />
        <t-tab-panel :label="$t('module.index_manage.tab.mapping')" value="3" />
        <t-tab-panel :label="$t('module.index_manage.tab.stats')" value="4" />
      </t-tabs>
      <t-loading :loading="loading" :text="$t('common.loading')" class="h-full">
        <div class="content">
          <t-alert
            v-if="active === '3'"
            :title="$t('module.index_manage.mapping_help_title')"
            style="margin-bottom: 8px"
          >
            <span>🌳</span>
            <AppLink :event="$t('module.index_manage.view_mapping')" />
            <span>{{ $t('module.index_manage.mapping_help_content') }}</span>
          </t-alert>
          <monaco-view
            :value="pretty"
            v-show="jsonViewShow"
            read-only
            :height="active === '3' ? 'calc(100vh - 268px)' : 'calc(100vh - 176px)'"
          />
          <index-manage-summary
            v-if="drawer"
            ref="indexManageSummary"
            v-show="!jsonViewShow"
            :index="index"
            :state="state"
          />
        </div>
      </t-loading>
    </div>
    <template #footer>
      <t-dropdown trigger="click" @select="indexManage">
        <t-button theme="primary">
          {{ $t('action.manage') }}
          <template #suffix>
            <chevron-up-icon />
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item value="open" v-if="state === 'close'">{{
            $t('action.open_index')
          }}</t-dropdown-item>
          <t-dropdown-item value="close" v-else-if="state === 'open'">{{
            $t('action.close_index')
          }}</t-dropdown-item>
          <t-dropdown-item disabled value="merge">{{
            $t('action.force_merge_index')
          }}</t-dropdown-item>
          <t-dropdown-item value="refresh">{{ $t('action.refresh_index') }}</t-dropdown-item>
          <t-dropdown-item value="clear">{{ $t('action.clear_index_cache') }}</t-dropdown-item>
          <t-dropdown-item value="flush">{{ $t('action.flush_index') }}</t-dropdown-item>
          <t-dropdown-item disabled value="freeze">{{ $t('action.freeze_index') }}</t-dropdown-item>
          <t-dropdown-item value="remove">{{ $t('action.delete_index') }}</t-dropdown-item>
          <t-dropdown-item disabled value="lifecycle">{{
            $t('action.add_lifecycle')
          }}</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </template>
  </t-drawer>
</template>
<script lang="ts">
import { contains } from '@/utils/lang'
import IndexApi from '@/components/es/IndexApi'
import Assert from '@/utils/Assert'
import IndexManageSummary from '@/module/index-manage/summary.vue'
import MessageUtil from '@/utils/model/MessageUtil'
import { useIndexStore } from '@/store'
import Optional from '@/utils/Optional'
import { mapState } from 'pinia'
import { useIndexManageEvent } from '@/global/BeanFactory'
import MessageBoxUtil from '@/utils/model/MessageBoxUtil'
import MonacoEditor from '@/components/monaco-editor/index.vue'
import { formatJsonString, stringifyJsonWithBigIntSupport } from '$/util'
import { ChevronUpIcon } from 'tdesign-icons-vue-next'
import { t } from '@/i18n'

export default defineComponent({
  name: 'index-manage',
  emits: ['update:modelValue'],
  components: { ChevronUpIcon, MonacoEditor, IndexManageSummary },
  data: () => ({
    drawer: false,
    active: '1',
    data: '',
    loading: false,
    index: ''
  }),
  watch: {
    active(newValue: string) {
      this.assignJson(newValue)
    },
    index() {
      this.$nextTick(() => {
        this.assignJson(this.active)
      })
    }
  },
  computed: {
    jsonViewShow() {
      return contains(['2', '3', '4'], this.active)
    },
    ...mapState(useIndexStore, ['indicesMap']),
    state(): 'open' | 'close' | '' {
      let indexView = useIndexStore().indicesMap.get(this.index)
      return Optional.ofNullable(indexView)
        .map((e) => e.state)
        .orElse('')
    },
    pretty() {
      return formatJsonString(this.data)
    }
  },
  created() {
    useIndexManageEvent.on((index) => {
      this.drawer = true
      this.index = index
    })
  },
  methods: {
    assignJson(newValue: string) {
      switch (newValue) {
        case '2':
          this.setting()
          break
        case '3':
          this.mapping()
          break
        case '4':
          this.stats()
          break
      }
    },
    setting() {
      Assert.notNull(this.index, t('error.index_name_not_exist'))
      this.loading = true
      IndexApi(this.index)
        ._settings()
        .then((result) => {
          this.data = stringifyJsonWithBigIntSupport(result[this.index])
        })
        .catch((e) => {
          MessageUtil.error(t('error.query_setting_error'), e)
          this.data = '{}'
        })
        .finally(() => {
          this.loading = false
        })
    },
    mapping() {
      Assert.notNull(this.index, t('error.index_name_not_exist'))
      this.loading = true
      IndexApi(this.index)
        ._mappings()
        .then((result) => {
          this.data = stringifyJsonWithBigIntSupport(result[this.index!])
        })
        .catch((e) => {
          MessageUtil.error(t('error.query_mapping_error'), e)
          this.data = '{}'
        })
        .finally(() => {
          this.loading = false
        })
    },
    stats() {
      Assert.notNull(this.index, t('error.index_name_not_exist'))
      this.loading = true
      IndexApi(this.index)
        ._stats()
        .then((result) => {
          this.data = stringifyJsonWithBigIntSupport(result)
        })
        .catch((e) => {
          MessageUtil.error(t('error.query_stats_error'), e)
          this.data = '{}'
        })
        .finally(() => {
          this.loading = false
        })
    },
    indexManage(command: any) {
      this.execCommand(command)
        .then(() => {
          // 1. 发送索引更新事件
          useIndexStore().reset()
          // 3. 更新本组件
          this.assignJson(this.active)
        })
        .catch((e) => console.error(e))
    },
    execCommand(command: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        switch (command) {
          case 'open':
            IndexApi(this.index)
              ._open()
              .then((res) => MessageUtil.success(res, resolve))
              .catch((e) => MessageUtil.error(t('error.open_index_error'), e, () => reject(e)))
            break
          case 'close':
            IndexApi(this.index)
              ._close()
              .then((res) => MessageUtil.success(res, resolve))
              .catch((e) => MessageUtil.error(t('error.close_index_error'), e, () => reject(e)))
            break
          case 'merge':
            break
          case 'refresh':
            IndexApi(this.index)
              ._refresh()
              .then((res) => MessageUtil.success(res, resolve))
              .catch((e) => MessageUtil.error(t('error.refresh_index_error'), e, () => reject(e)))
            break
          case 'clear':
            IndexApi(this.index)
              ._cacheClear()
              .then((res) => MessageUtil.success(res, resolve))
              .catch((e) => MessageUtil.error(t('error.clear_cache_error'), e, () => reject(e)))
            break
          case 'flush':
            IndexApi(this.index)
              ._flush()
              .then((res) => MessageUtil.success(res, resolve))
              .catch((e) => MessageUtil.error(t('error.flush_error'), e, () => reject(e)))
            break
          case 'freeze':
            break
          case 'remove':
            MessageBoxUtil.confirm(t('message.confirm_delete_index'), t('common.tips'), {
              confirmButtonText: t('action.confirm'),
              cancelButtonText: t('action.cancel')
            }).then(() =>
              IndexApi(this.index)
                .delete()
                .then((res) => MessageUtil.success(res, resolve))
                .catch((e) => MessageUtil.error(t('error.delete_index_error'), e, () => reject(e)))
            )
            break
          case 'lifecycle':
            break
        }
      })
    }
  }
})
</script>
<style lang="less">
.index-manage-drawer {
  .index-manage {
    position: absolute;
    top: 56px;
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
}
</style>
