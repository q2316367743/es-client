<template>
  <div class="abs-0">
    <SplitPanel v-model="size">
      <template #left>
        <chat-left v-model="active" :records="records" @add="handleAdd" />
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
import { addChatRecord, listChatRecords } from '@/api'
import MessageUtil from '@/utils/model/MessageUtil'
import { toDateString } from '@/utils/lang'
import MessageBoxUtil from '@/utils/model/MessageBoxUtil'

defineOptions({
  name: 'Chat2ES'
})

const size = useLocalStorage(LocalNameEnum.KEY_CHAT_SIZE, 400)
const active = useSessionStorage(LocalNameEnum.PAGE_CHAT2ES_ACTIVE, '')

const records = ref<Array<ChatRecord>>([])

const init = () => {
  listChatRecords()
    .then((res) => (records.value = res))
    .catch((e) => MessageUtil.error('获取记录失败', e))
}

const handleAdd = () => {
  MessageBoxUtil.prompt('请输入记录名称', '添加记录', {
    inputValue: toDateString(Date.now())
  }).then((name) => {
    addChatRecord(name)
      .then(() => {
        MessageUtil.success('添加记录成功')
        init()
      })
      .catch((e) => MessageUtil.error('添加记录失败', e))
  })
}

onMounted(init)
</script>
<style scoped lang="less"></style>
