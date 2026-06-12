import { listByAsync, saveListByAsync } from '@/utils/utools/DbStorageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { AiProvide, AiProvideForm } from '@/entity'
import { useSnowflake } from '$/util'

export const listAiProvide = async () => {
  const { list } = await listByAsync<AiProvide>(LocalNameEnum.LIST_SETTING_AI_PROVIDE)
  return list
}

export const addAiProvide = async (form: AiProvideForm) => {
  const list = await listAiProvide()
  list.push({
    ...form,
    id: useSnowflake().nextId(),
    createTime: Date.now(),
    updateTime: Date.now()
  })
  await saveListByAsync(LocalNameEnum.LIST_SETTING_AI_PROVIDE, list)
}

export const updateAiProvide = async (form: AiProvideForm, id: string) => {
  const list = await listAiProvide()
  const index = list.findIndex((item) => item.id === id)
  if (index > -1) {
    list[index] = {
      ...list[index],
      ...form,
      updateTime: Date.now()
    }
    await saveListByAsync(LocalNameEnum.LIST_SETTING_AI_PROVIDE, list)
  }
}

export const removeAiProvide = async (id: string) => {
  const list = await listAiProvide()
  const index = list.findIndex((item) => item.id === id)
  if (index > -1) {
    list.splice(index, 1)
    await saveListByAsync(LocalNameEnum.LIST_SETTING_AI_PROVIDE, list)
  }
}
