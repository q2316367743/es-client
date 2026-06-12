// 获取列表

import { getFromOne, listByAsync, saveOneByAsync } from '@/utils/utools/DbStorageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { ChatItem, ChatRecord } from '@/entity/chat'
import { debounce } from 'es-toolkit'
import { useSnowflake } from '$/util'

export const listChatRecords = async () => {
  const { list } = await listByAsync<ChatRecord>(LocalNameEnum.LIST_CHAT_RECORD)
  return list
}

export const addChatRecord = async (name: string) => {
  const list = await listChatRecords()
  list.push({
    id: useSnowflake().nextId(),
    name,
    createTime: Date.now(),
    updateTime: Date.now()
  })
  await saveOneByAsync(LocalNameEnum.LIST_CHAT_RECORD, list)
}

export const getChatRecordItem = async (id: string) => {
  const record = await getFromOne<ChatItem>(LocalNameEnum.ITEM_CHAT_RECORD(id))
  return record ? record.record : { messages: [] }
}

export const saveChatRecordItem = debounce((id: string, item: ChatItem) => {
  return saveOneByAsync(LocalNameEnum.ITEM_CHAT_RECORD(id), item)
}, 300)
