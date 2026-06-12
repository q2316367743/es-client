<template>
  <ChatList :clear-history="clearHistory" style="flex: 1" @clear="$emit('clear')">
    <ChatMessage
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :placement="message.role === 'user' ? 'right' : 'left'"
      :variant="message.role === 'user' ? 'base' : 'text'"
    >
      <template #content>
        <div class="flex flex-col gap-4px">
          <template
            v-for="(contentItem, contentIndex) in message.content"
            :key="contentItem.id || contentIndex"
          >
            <r-chat-system v-if="message.role === 'system'" :prompt="message.content[0]?.data" />
            <ChatMessage
              v-else-if="message.role === 'user'"
              variant="outline"
              :content="message.content"
              :role="message.role"
            />
            <ChatContent
              v-else-if="contentItem.type === 'text' || contentItem.type === 'markdown'"
              :content="contentItem.data"
            />
            <r-chat-think
              v-else-if="contentItem.type === 'thinking'"
              :content="contentItem"
              :index="contentIndex"
            />
            <r-chat-tool v-else-if="contentItem.type === 'toolcall'" :content="contentItem" />
          </template>
        </div>
      </template>
    </ChatMessage>
  </ChatList>
</template>
<script lang="ts" setup>
import { ChatContent, ChatList, ChatMessage, ChatMessagesData } from '@tdesign-vue-next/chat'
import RChatTool from '@/components/chat/RChatTool.vue'
import RChatSystem from '@/components/chat/RChatSystem.vue'

defineProps({
  clearHistory: {
    type: Boolean,
    default: false
  },
  messages: {
    type: Array as PropType<Array<ChatMessagesData>>,
    default: () => []
  }
})
defineEmits(['clear'])
</script>
<style scoped lang="less"></style>
