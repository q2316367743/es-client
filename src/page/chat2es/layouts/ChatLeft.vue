<template>
  <div class="abs-8 !right-0 material-card p-8px flex flex-col min-w-200px">
    <div class="flex justify-between items-center">
      <div>CHAT2ES</div>
      <div class="flex gap-8px">
        <t-button theme="primary" variant="text" shape="circle" :disabled @click="$emit('add')">
          <template #icon>
            <chat-bubble-add-icon />
          </template>
        </t-button>
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <t-empty v-if="!records.length" title="空空如也" class="mt-25vh" />
      <div class="chat-records">
        <div
          v-for="(record, index) in records"
          :key="index"
          :class="['chat-record', { active: active === record.id }]"
          @click="handleClick(record)"
        >
          <div class="chat-record-name">{{ record.name }}</div>
          <div class="chat-record-action">
            <t-popconfirm content="确定删除此会话？" @confirm="$emit('remove', record)">
              <t-button theme="danger" variant="text" shape="square" size="small" @click.stop>
                <template #icon>
                  <delete-icon />
                </template>
              </t-button>
            </t-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ChatBubbleAddIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import { ChatRecord } from '@/entity/chat'
import { useUrlStore } from '@/store'

const active = defineModel({
  type: String,
  default: ''
})
defineProps({
  records: {
    type: Array as PropType<Array<ChatRecord>>,
    default: () => []
  }
})
const emit = defineEmits(['add', 'remove'])

const disabled = computed(() => !useUrlStore().id)

const handleClick = (record: ChatRecord): void => {
  if (active.value === record.id) {
    active.value = ''
  } else {
    active.value = record.id
  }
}
</script>
<style scoped lang="less">
.chat-records {
  padding-top: 8px;
}
.chat-record {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--td-bg-color-container);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease-in-out;
  border-radius: var(--td-radius-medium);
  line-height: 32px;
  height: 32px;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 8px;
  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }
  &.active {
    background-color: var(--td-bg-color-container-active);
  }
}
</style>
