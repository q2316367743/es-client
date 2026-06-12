<template>
  <div :style="{ height, display: 'flex', flexDirection: 'column' }">
    <!-- 消息列表 -->
    <r-chat-list
      :messages="messages"
      :clear-history="messages.length > 1 && status !== 'streaming'"
      style="flex: 1"
      @clear="handleClear"
    />

    <!-- 输入框 -->
    <ChatSender
      v-model="inputValue"
      placeholder="请输入内容"
      :loading="status === 'pending' || status === 'streaming'"
      @send="handleSend"
      @stop="handleStop"
    >
      <template #footer-prefix>
        <div class="model-select">
          <div class="flex gap-8px">
            <t-select v-model="modelValue" :options="options" />
            <div class="w-32px">
              <t-button
                :variant="think ? 'base' : 'outline'"
                shape="circle"
                :theme="think ? 'primary' : 'default'"
                @click="toggleThink()"
              >
                <SystemSumIcon />
              </t-button>
            </div>
          </div>
        </div>
      </template>
    </ChatSender>
  </div>
</template>
<script lang="ts" setup>
import { ChatSender } from '@tdesign-vue-next/chat'
import { SystemSumIcon } from 'tdesign-icons-vue-next'
import { useBoolState, useChat, type ToolFunction } from '@/hooks'
import { useAiProvideStore } from '@/store'
import MessageUtil from '@/utils/model/MessageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'

const props = withDefaults(
  defineProps<{
    chatId: string
    functions: ToolFunction[]
    systemPrompt: string
    height?: string
  }>(),
  {
    height: 'calc(100vh - 73px)'
  }
)

const [think, toggleThink] = useBoolState(false)

const inputValue = ref('')
const modelValue = useLocalStorage(LocalNameEnum.PAGE_CHAT_MODEL, '')

const options = computed(() => useAiProvideStore().options)

const { messages, status, init, sendUserMessage, sendSystemMessage, abortChat, destroy } = useChat({
  functions: props.functions
})

const handleSend = () => {
  const model = useAiProvideStore().optionMap.get(modelValue.value)
  if (!model) return MessageUtil.error('请选择模型')
  init({
    baseURL: model.baseUrl,
    apiKey: model.key
  })
  sendUserMessage({
    content: inputValue.value,
    model: model.identifier,
    thinking: model ? (think.value ? 'enabled' : 'disabled') : 'disabled'
  })
  inputValue.value = ''
}

const handleStop = () => {
  abortChat()
}

const handleClear = () => {
  messages.value = [
    {
      id: '0',
      role: 'system',
      content: [
        {
          type: 'text',
          data: props.systemPrompt,
          status: 'complete'
        }
      ]
    }
  ]
}

let unWatch: (() => void) | null = null

onMounted(async () => {
  const c = localStorage.getItem(LocalNameEnum.ITEM_SOURCE_AI(props.chatId))
  if (c) {
    const parsed = JSON.parse(c)
    init(
      {
        baseURL: '',
        apiKey: ''
      },
      parsed.messages ?? parsed.message
    )
  }

  // 如果第一次，则需要注入系统提示词
  if (messages.value.length === 0) {
    await sendSystemMessage(props.systemPrompt)
  }

  // 保存起来
  unWatch = watchDebounced(
    messages,
    async (val) => {
      localStorage.setItem(
        LocalNameEnum.ITEM_SOURCE_AI(props.chatId),
        JSON.stringify({ messages: val })
      )
    },
    { debounce: 600, deep: true }
  )
})

onUnmounted(() => {
  unWatch?.()
  destroy()
})
</script>
<style scoped lang="less"></style>
