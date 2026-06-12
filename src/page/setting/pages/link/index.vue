<template>
  <page-layout :title="t('menu.setting_link')">
    <div class="setting-url">
      <div class="setting-url-toolbar">
        <t-input
          v-model="keyword"
          style="width: 40vw"
          :placeholder="t('setting.link_name')"
          clearable
        />
        <t-space size="small">
          <t-button theme="primary" @click="openAddLink">
            {{ t('setting.add') }}
          </t-button>
          <t-dropdown trigger="click">
            <t-button theme="primary" shape="square">
              <template #icon>
                <more-icon />
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item @click="exportUrlToJson()">
                <template #prefix-icon>
                  <file-export-icon />
                </template>
                {{ t('setting.data_export') }}
              </t-dropdown-item>
              <t-dropdown-item @click="importUrlByJson()">
                <template #prefix-icon>
                  <file-import-icon />
                </template>
                {{ t('setting.data_import') }}
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </t-space>
      </div>
      <t-table
        ref="urlTable"
        :data="urls"
        class="data"
        style="height: 100%"
        :columns="linkTableColumn"
        row-key="id"
        :maxHeight="virtualListProps.height"
      >
      </t-table>
    </div>
  </page-layout>
</template>
<script lang="ts" setup>
import { useUrlStore } from '@/store'
import { getDefaultUrl } from '@/entity/Url'
import MessageUtil from '@/utils/model/MessageUtil'
import { useFuse } from '@vueuse/integrations/useFuse'
import { download } from '@/utils/BrowserUtil'
import { Constant } from '@/global/Constant'
import { openAddLink } from '@/page/setting/pages/link/components/EditLink'
import { parseJsonWithBigIntSupport, stringifyJsonWithBigIntSupport } from '$/util'
import { FileExportIcon, FileImportIcon, MoreIcon } from 'tdesign-icons-vue-next'
import { linkTableColumn } from '@/page/setting/pages/link/components/LinkTableColumn'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const size = useWindowSize()

const keyword = ref('')

const items = computed(() => useUrlStore().urls)
const { results } = useFuse(keyword, items, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: [
      {
        name: 'name'
      },
      {
        name: 'value'
      }
    ]
  }
})
const urls = computed(() => results.value.map((e) => e.item))

const virtualListProps = computed(() => ({
  height: size.height.value - 144
}))

// -------------------------------------- Methods --------------------------------------

function onDragSort({ newData }: { newData: Array<any> }) {
  useUrlStore().save(newData.map((item) => toRaw(item)))
}

// Import/Export

function exportUrlToJson() {
  download(
    stringifyJsonWithBigIntSupport({
      version: Constant.version,
      records: useUrlStore().urls
    }),
    t('setting.link_export_filename'),
    'application/json'
  )
}

const importFile = useFileSystemAccess({
  dataType: 'Text',
  types: [
    {
      accept: {
        'application/json': ['.json']
      },
      description: t('setting.json_file')
    }
  ]
})

function importUrlByJson() {
  const rsp = importFile.open() as Promise<void>
  rsp.then(() => {
    const value = importFile.data.value
    if (!value) {
      MessageUtil.error(t('setting.parse_error'))
    }
    handlerJson(value)
      .then(() => MessageUtil.success(t('setting.import_success')))
      .catch((e) => MessageUtil.error(t('setting.import_failed'), e))
  })
}

async function handlerJson(json?: string) {
  if (!json) {
    return Promise.reject(t('setting.parse_error'))
  }
  let value
  try {
    value = parseJsonWithBigIntSupport(json)
  } catch (e) {
    return Promise.reject(t('setting.json_parse_error'))
  }
  if (!value) {
    return Promise.reject(t('setting.json_no_data'))
  }
  let records = value.records
  if (!records) {
    return Promise.reject(t('setting.link_record_not_exist'))
  }
  if (!(records instanceof Array)) {
    return Promise.reject(t('setting.data_format_error'))
  }
  await useUrlStore().addByBatch(records.map((e) => getDefaultUrl(e)))
}
</script>
<style lang="less">
.setting-url {
  .setting-url-toolbar {
    display: flex;
    justify-content: space-between;
    margin: 8px 5px;
  }

  .url-copy {
    display: inline;
    margin-left: 10px;
    color: #0052d9;
    cursor: pointer;
  }
}
</style>
