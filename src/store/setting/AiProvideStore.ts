import { defineStore } from 'pinia'
import { AiModel, AiProvide, AiProvideForm } from '@/entity'
import { SelectOptionGroup } from 'tdesign-vue-next'
import { addAiProvide, listAiProvide, removeAiProvide, updateAiProvide } from '@/api'

export interface AiProvideOption extends AiModel {
  // 提供方名称
  baseUrl: string
  // 提供方密钥
  key: string
}

export const useAiProvideStore = defineStore('AiProvideStore', () => {
  const items = ref(new Array<AiProvide>())

  const options = computed<Array<SelectOptionGroup>>(() => {
    return items.value.map((item) => ({
      group: item.name,
      children: item.models.map((model) => ({
        label: model.name,
        value: `${item.id}:${model.identifier}`
      }))
    }))
  })
  const optionMap = computed<Map<string, AiProvideOption>>(() => {
    const map = new Map<string, AiProvideOption>()
    items.value.forEach((item) =>
      item.models.forEach((model) => {
        map.set(`${item.id}:${model.identifier}`, {
          ...model,
          ...item
        })
      })
    )
    return map
  })

  const init = async () => {
    items.value = await listAiProvide()
  }

  init()

  const put = async (form: AiProvideForm) => {
    const index = form.id ? items.value.findIndex((item) => item.id === form.id) : -1
    if (index > -1) {
      await updateAiProvide(form, form.id!)
    } else {
      await addAiProvide(form)
    }
    await init()
  }

  const remove = async (id: string) => {
    await removeAiProvide(id)
    await init()
  }

  return {
    items,
    options,
    optionMap,
    put,
    remove
  }
})
