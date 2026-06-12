<template>
  <div class="abs-8 !left-0 material-card px-8px">
    <empty-result v-if="!tabs.length" title="请在左侧创建对话" />
    <template v-else>
      <TabChrome
        v-model="active"
        :tabs="tabs"
        :class="[{ 'theme-dark': isDark }, 'my-8px']"
        @remove="handleRemove"
      />
      <div>
        <r-chat-assistant
          v-for="chatId in ids"
          v-show="active === chatId"
          :key="chatId"
          :chat-id="chatId"
          :functions="chatFunctions"
          :system-prompt="chatPrompt"
          height="calc(100vh - 116px)"
        />
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '@/store'
import { ChatRecord } from '@/entity/chat'
import { SelectOption } from '$/shared/common'
import { chatFunctions, chatPrompt } from '@/module/chat'

const active = defineModel({
  type: String,
  default: ''
})
const props = defineProps({
  records: {
    type: Array as PropType<Array<ChatRecord>>,
    default: () => []
  }
})

const ids = ref<Array<string>>([])

const isDark = computed(() => useGlobalStore().isDark)
const tabs = computed(() => {
  return props.records
    .filter((e) => ids.value.includes(e.id))
    .map((e) => ({
      value: e.id,
      label: e.name
    }))
})

watch(active, (val) => {
  if (!val) return
  if (ids.value.includes(val)) return
  ids.value.push(val)
})

const handleRemove = (val: SelectOption) => {
  ids.value = ids.value.filter((e) => e !== val.value)
  if (val.value === active.value) {
    active.value = ''
  }
}
</script>
<style scoped lang="less"></style>
