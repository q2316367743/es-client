<template>
  <div v-if="log">
    <ol>
      <template v-for="item in log.items">
        <li v-if="typeof item === 'string'">{{ item }}</li>
        <ol v-else-if="item instanceof Array">
          <li v-for="i in item">
            <span v-html="i"></span>
          </li>
        </ol>
        <li v-else>
          <t-tag
            :theme="renderTag(item.label).color"
            style="margin-left: 5px; padding-left: 6px; padding-right: 6px"
          >
            {{ renderTag(item.label).name }}
          </t-tag>
          <span style="margin-left: 5px">{{ item.content }}</span>
          <span v-if="item.txc"><t-link @click="open(item.txc)">@兔小巢</t-link></span>
          <span v-else-if="item.gitee">
            <t-link theme="primary" @click="open(item.gitee.content)">
              #{{ item.gitee.title }}
            </t-link>
          </span>
          <span v-else-if="item.pull">
            <t-tooltip :content="$t('module.update_item.contributor')">
              <t-link theme="primary" @click="open(item.pull?.url)">@ {{ item.pull?.name }}</t-link>
            </t-tooltip>
          </span>
        </li>
      </template>
    </ol>
    <t-typography-paragraph v-if="log.remark">{{ log.remark }}</t-typography-paragraph>
    <div v-if="log.doc">
      {{ $t('module.update_item.more_info_pre') }}
      <t-link target="_blank" @click="open(log?.doc)">{{
        $t('module.update_item.more_info_link')
      }}</t-link>
      {{ $t('module.update_item.more_info_post') }}
    </div>
  </div>
</template>
<script lang="ts">
import { Log, LogItemEnum } from '@/view/Data'
import { openUrl } from '@/utils/BrowserUtil'
import i18n from '@/i18n'

export default defineComponent({
  name: 'update-item',
  props: {
    log: Object as PropType<Log>
  },
  methods: {
    renderTag(value: number): {
      name: string
      color: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    } {
      switch (value) {
        case LogItemEnum.ADD:
          return {
            name: i18n.global.t('module.update_item.tag.add'),
            color: 'primary'
          }
        case LogItemEnum.UPDATE:
          return {
            name: i18n.global.t('module.update_item.tag.update'),
            color: 'success'
          }
        case LogItemEnum.REPAIR:
          return {
            name: i18n.global.t('module.update_item.tag.repair'),
            color: 'danger'
          }
        case LogItemEnum.OPTIMIZATION:
          return {
            name: i18n.global.t('module.update_item.tag.optimization'),
            color: 'warning'
          }
        default:
          return {
            name: '',
            color: 'default'
          }
      }
    },
    open(url?: string) {
      if (url) {
        openUrl(url)
      }
    }
  }
})
</script>
<style scoped></style>
