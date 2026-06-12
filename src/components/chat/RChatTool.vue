<template>
  <div class="chat-tool">
    <SearchDslToolCard
      v-if="toolName === 'generate_search_dsl'"
      :content="content"
      @execute="(p) => emit('execute', p)"
    />
    <AggsDslToolCard
      v-else-if="toolName === 'generate_aggregation_dsl'"
      :content="content"
      @execute="(p) => emit('execute', p)"
    />
    <DefaultToolCard
      v-else
      :content="content"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { ToolCallContent } from '@tdesign-vue-next/chat'
import SearchDslToolCard from './tools/SearchDslToolCard.vue'
import AggsDslToolCard from './tools/AggsDslToolCard.vue'
import DefaultToolCard from './tools/DefaultToolCard.vue'

const props = defineProps({
  content: {
    type: Object as PropType<ToolCallContent>,
    required: true
  }
})

const emit = defineEmits<{
  execute: [payload: { index: string; body: Record<string, unknown>; method: string }]
}>()

const toolName = computed(() => props.content.data.toolCallName)
</script>
