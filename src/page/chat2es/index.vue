<template>
  <div class="abs-0">
    <SplitPanel v-model="size">
      <template #left>
        <chat-left v-model="active" :records="records" @add="handleAdd" @remove="handleRemove" />
      </template>
      <template #right>
        <chat-right v-model="active" :records="records" />
      </template>
    </SplitPanel>
  </div>
</template>
<script lang="ts" setup>
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import ChatLeft from '@/page/chat2es/layouts/ChatLeft.vue'
import ChatRight from '@/page/chat2es/layouts/ChatRight.vue'
import { ChatRecord } from '@/entity/chat'
import { addChatRecord, deleteChatRecord, listChatRecords } from '@/api'
import MessageUtil from '@/utils/model/MessageUtil'
import { toDateString } from '@/utils/lang'
import MessageBoxUtil from '@/utils/model/MessageBoxUtil'
import { useUrlStore } from '@/store'

defineOptions({
  name: 'Chat2ES'
})

const size = useLocalStorage(LocalNameEnum.PAGE_CHAT2ES_SIZE, 400)
const active = useSessionStorage(LocalNameEnum.PAGE_CHAT2ES_ACTIVE, '')

const records = ref<Array<ChatRecord>>([])

const init = () => {
  listChatRecords(useUrlStore().id)
    .then((res) => (records.value = res))
    .catch((e) => MessageUtil.error('获取记录失败', e))
}

const handleAdd = () => {
  const { id } = useUrlStore()
  if (!id) return MessageUtil.error('请先选择一个连接')
  MessageBoxUtil.prompt('请输入记录名称', '添加记录', {
    inputValue: toDateString(Date.now())
  }).then((name) => {
    addChatRecord(name, id)
      .then(() => {
        MessageUtil.success('添加记录成功')
        init()
      })
      .catch((e) => MessageUtil.error('添加记录失败', e))
  })
}

const handleRemove = (record: ChatRecord) => {
  deleteChatRecord(record.id, useUrlStore().id)
    .then(() => {
      MessageUtil.success('删除记录成功')
      init()
    })
    .catch((e) => MessageUtil.error('删除记录失败', e))
}

watch(
  () => useUrlStore().id,
  () => {
    init()
    active.value = ''
  }
)
onMounted(init)
</script>
<style scoped lang="less"></style>
