// 获取列表

import {
  getFromOne,
  listByAsync,
  removeOneByAsync,
  saveOneByAsync
} from '@/utils/utools/DbStorageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { ChatItem, ChatRecord } from '@/entity/chat'
import { debounce } from 'es-toolkit'
import { useSnowflake } from '$/util'

export const listChatRecords = async (id?: string | number) => {
  const { list } = await listByAsync<ChatRecord>(LocalNameEnum.LIST_CHAT_RECORD(String(id || '')))
  return list
}

export const addChatRecord = async (name: string, id: string | number) => {
  const list = await listChatRecords(id)
  list.push({
    id: useSnowflake().nextId(),
    name,
    createTime: Date.now(),
    updateTime: Date.now()
  })
  await saveOneByAsync(LocalNameEnum.LIST_CHAT_RECORD(String(id)), list)
}

export const deleteChatRecord = async (id: string, urlId?: string | number) => {
  const list = await listChatRecords(urlId)
  list.splice(
    list.findIndex((item) => item.id === id),
    1
  )
  await saveOneByAsync(LocalNameEnum.LIST_CHAT_RECORD(String(urlId)), list)
  // 删除对应的记录
  await removeOneByAsync(LocalNameEnum.ITEM_CHAT_RECORD(id))
}

export const getChatRecordItem = async (id: string) => {
  const record = await getFromOne<ChatItem>(LocalNameEnum.ITEM_CHAT_RECORD(id))
  return record ? record.record : { messages: [] }
}

export const saveChatRecordItem = debounce((id: string, item: ChatItem) => {
  return saveOneByAsync(LocalNameEnum.ITEM_CHAT_RECORD(id), item)
}, 300)
