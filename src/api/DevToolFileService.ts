import { listByAsync, saveListByAsync } from '@/utils/utools/DbStorageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { DevToolFileCreateProp, DevToolFileItem } from '@/entity'
import { useSnowflake } from '$/util'

export async function devToolFileList(urlId: string) {
  const { list } = await listByAsync<DevToolFileItem>(
    `${LocalNameEnum.LIST_DEV_TOOL_FILE_ITEM}/${urlId}`
  )
  return list
}

export async function devToolFileCreate(urlId: string, prop: DevToolFileCreateProp) {
  const list = await devToolFileList(urlId)
  list.push({
    ...prop,
    createTime: Date.now(),
    updateTime: Date.now(),
    id: useSnowflake().nextId()
  })
  await saveListByAsync(`${LocalNameEnum.LIST_DEV_TOOL_FILE_ITEM}/${urlId}`, list)
}

export async function devToolFileRename(urlId: string, id: string, name: string) {
  const list = await devToolFileList(urlId)
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.reject(new Error('未找到该文件'))
  }
  list[index].name = name
  list[index].updateTime = Date.now()
  await saveListByAsync(`${LocalNameEnum.LIST_DEV_TOOL_FILE_ITEM}/${urlId}`, list)
}

export async function devToolFileDelete(urlId: string, id: string) {
  const list = await devToolFileList(urlId)
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.reject(new Error('未找到该文件'))
  }
  list.splice(index, 1)
  await saveListByAsync(`${LocalNameEnum.LIST_DEV_TOOL_FILE_ITEM}/${urlId}`, list)
}
