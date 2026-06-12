<template>
  <page-layout :title="t('menu.setting_global')">
    <div class="setting-global">
      <t-form :model="instance" style="padding: 8px">
        <t-divider id="new">{{ t('setting.new_index') }}</t-divider>
        <t-form-item label-align="top" :label="t('setting.default_shard')" id="defaultShard">
          <t-input-number v-model="instance.defaultShard"></t-input-number>
        </t-form-item>
        <t-form-item label-align="top" :label="t('setting.default_replica')" id="defaultReplica">
          <t-input-number v-model="instance.defaultReplica"></t-input-number>
        </t-form-item>

        <t-divider id="global-search">
          {{ t('setting.global_search_condition') }}
        </t-divider>
        <t-form-item label-align="top" :label="t('setting.status')" id="homeSearchState">
          <t-radio-group v-model="instance.homeSearchState">
            <t-radio :value="0">{{ t('setting.not_set') }}</t-radio>
            <t-radio :value="1">{{ t('setting.open') }}</t-radio>
            <t-radio :value="2">{{ t('setting.close') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          label-align="top"
          id="homeExcludeIndices"
          class="w-full"
          :help="t('setting.enter_to_add')"
        >
          <template #label>
            <span>{{ t('setting.exclude_index') }}</span>
            <t-tooltip :content="t('setting.regex_support')" placement="top" effect="light">
              <help-circle-icon style="margin-left: 5px" />
            </t-tooltip>
          </template>
          <t-tag-input v-model="instance.homeExcludeIndices" allow-clear />
        </t-form-item>
        <t-form-item
          label-align="top"
          id="homeIncludeIndices"
          class="w-full"
          :help="t('setting.enter_to_add')"
        >
          <template #label>
            <span>{{ t('setting.include_index') }}</span>
            <t-tooltip :content="t('setting.regex_support')" placement="top" effect="light">
              <help-circle-icon style="margin-left: 5px" />
            </t-tooltip>
          </template>
          <t-tag-input v-model="instance.homeIncludeIndices" allow-clear style="" />
        </t-form-item>
        <t-divider id="time">track_total_hits</t-divider>
        <t-alert theme="info" :title="t('setting.track_total_hits_intro')">
          <p v-html="t('setting.track_total_hits_desc')"></p>
          <ul>
            <li>{{ t('setting.track_total_hits_true') }}</li>
            <li>{{ t('setting.track_total_hits_false') }}</li>
            <li>{{ t('setting.track_total_hits_custom') }}</li>
          </ul>
        </t-alert>
        <t-form-item
          label-align="top"
          :label="t('setting.track_total_hits_mode')"
          name="trackTotalHitsMode"
          :help="t('setting.track_total_hits_help')"
        >
          <t-radio-group v-model="instance.trackTotalHitsMode" default-value="true">
            <t-radio :value="'true'">true</t-radio>
            <t-radio :value="'false'">false</t-radio>
            <t-radio :value="'custom'">{{ t('setting.custom') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="instance.trackTotalHitsMode === 'custom'"
          label-align="top"
          :label="t('setting.track_total_hits_value')"
          name="trackTotalHitsValue"
        >
          <t-input-number
            v-model="instance.trackTotalHitsValue"
            :min="0"
            :step="1000"
            class="w-240px"
          />
        </t-form-item>

        <t-divider id="time">{{ t('setting.time_settings') }}</t-divider>
        <t-form-item label-align="top" :label="t('setting.timeout')" id="timeout">
          <t-input-number
            v-model="instance.timeout"
            :min="0"
            :step="1000"
            :placeholder="t('setting.timeout')"
            style="width: 180px"
          >
            <template #suffix>ms</template>
          </t-input-number>
        </t-form-item>
        <t-form-item
          label-align="top"
          :label="t('setting.notification_time')"
          id="notificationTime"
        >
          <t-input-number
            v-model="instance.notificationTime"
            :min="0"
            :step="1000"
            :placeholder="t('setting.unit_ms')"
            style="width: 180px"
          >
            <template #suffix>ms</template>
          </t-input-number>
        </t-form-item>

        <t-divider id="display">{{ t('setting.display_settings') }}</t-divider>
        <t-form-item label-align="top" :label="t('setting.default_page_size')" id="pageSize">
          <t-input-number v-model="instance.pageSize"></t-input-number>
        </t-form-item>
        <t-form-item label-align="top" :label="t('setting.data_browse_show_meta')">
          <t-switch v-model="instance.dataBrowserShowMeta">
            <template #label="checked">{{
              checked.value ? t('setting.show') : t('setting.hide')
            }}</template>
          </t-switch>
        </t-form-item>
        <t-form-item
          label-align="top"
          :label="t('setting.base_search_default_view')"
          id="baseDefaultViewer"
        >
          <t-radio-group v-model="instance.baseDefaultViewer">
            <t-radio :label="t('setting.table_view')" :value="ViewTypeEnum.TABLE"
              >{{ t('setting.table_view') }}
            </t-radio>
            <t-radio :label="t('setting.editor_view')" :value="ViewTypeEnum.EDITOR"
              >{{ t('setting.editor_view') }}
            </t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="instance.baseDefaultViewer === ViewTypeEnum.TABLE"
          label-align="top"
          :label="t('setting.base_search_show_meta')"
        >
          <t-switch v-model="instance.baseSearchShowMeta">
            <template #label="checked">{{
              checked.value ? t('setting.show') : t('setting.hide')
            }}</template>
          </t-switch>
        </t-form-item>
        <t-form-item
          label-align="top"
          :label="t('setting.dev_tool_default_view')"
          id="devToolViewer"
        >
          <t-radio-group v-model="instance.devToolViewer">
            <t-radio :label="t('setting.table_view')" :value="ViewTypeEnum.TABLE"
              >{{ t('setting.table_view') }}
            </t-radio>
            <t-radio :label="t('setting.editor_view')" :value="ViewTypeEnum.EDITOR"
              >{{ t('setting.editor_view') }}
            </t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="instance.devToolViewer === ViewTypeEnum.TABLE"
          label-align="top"
          :label="t('setting.dev_tool_show_meta')"
        >
          <t-switch v-model="instance.devToolShowMeta">
            <template #label="checked">{{
              checked.value ? t('setting.show') : t('setting.hide')
            }}</template>
          </t-switch>
        </t-form-item>
        <t-form-item
          label-align="top"
          :label="t('setting.senior_search_default_view')"
          id="seniorDefaultViewer"
          :help="t('setting.will_remove')"
        >
          <t-radio-group v-model="instance.seniorDefaultViewer">
            <t-radio :label="t('setting.table_view')" :value="ViewTypeEnum.TABLE"
              >{{ t('setting.table_view') }}
            </t-radio>
            <t-radio :label="t('setting.editor_view')" :value="ViewTypeEnum.EDITOR"
              >{{ t('setting.editor_view') }}
            </t-radio>
          </t-radio-group>
        </t-form-item>

        <t-divider id="other">{{ t('setting.other_settings') }}</t-divider>
        <t-form-item label-align="top" id="lastUrl">
          <template #label>
            <span>{{ t('setting.save_last_url') }}</span>
            <t-tooltip :content="t('setting.save_last_url_help')" placement="top" effect="light">
              <help-circle-icon style="margin-left: 5px" />
            </t-tooltip>
          </template>
          <t-switch v-model="instance.lastUrl">
            <template #label="checked">{{
              checked.value ? t('setting.save') : t('setting.ignore')
            }}</template>
          </t-switch>
        </t-form-item>
      </t-form>
      <div class="extend">
        <ActiveExtend />
      </div>
    </div>
  </page-layout>
</template>
<script lang="ts" setup>
import { useGlobalSettingStore } from '@/store'
import ViewTypeEnum from '@/enumeration/ViewTypeEnum'
import { storeToRefs } from 'pinia'
import { HelpCircleIcon } from 'tdesign-icons-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { globalSetting: instance } = storeToRefs(useGlobalSettingStore())
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
  color: var(--td-warning-color);
}

.setting-global {
}

.extend {
  position: absolute;
  right: 16px;
  bottom: 0;
}
</style>
