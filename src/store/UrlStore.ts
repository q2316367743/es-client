import { defineStore } from 'pinia'
import { Url } from '@/entity/Url'
import { map } from '@/utils/lang'
import { listByAsync, saveListByAsync, setItem } from '@/utils/utools/DbStorageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { statistics } from '@/global/BeanFactory'
import {
  buildEsRequestConfig,
  RequestConfig,
  useRequest,
  useRequestJson
} from '@/plugins/native/axios'
import { Overview } from '@/domain/es/Overview'
import { createElasticsearchClient, ElasticsearchClient } from '$/elasticsearch-client'
import { clearDataBrowserQuery } from '@/api/DataBrowser/DataBrwoserQueryService'
import { clearDataBrowserViews } from '@/api/DataBrowser/DataBrowserViewService'

const title = useTitle()

export const buildRequestConfig = (
  record: Omit<Url, 'id' | 'createTime' | 'updateTime'>
): RequestConfig => {
  return buildEsRequestConfig(
    {
      baseURL: record.value,
      url: '/',
      method: 'GET',
      headers: {} as Record<string, any>
    },
    record
  )
}

export const useUrlStore = defineStore('url', () => {
  // state
  const urls = ref<Array<Url>>([])
  const url = ref<Url>()

  // getters
  const urlMap = computed(() => map(urls.value, 'id'))
  const list = computed(() => urls.value)
  const current = computed(() => (url.value && url.value.value ? url.value.value! : ''))
  const id = computed(() => (url.value ? url.value.id! : undefined))
  const empty = computed(() => url.value === undefined)
  const client = shallowRef<ElasticsearchClient>()
  // 第一个版本号
  const versionFirst = computed(() => {
    const [r1] = (url.value?.version || '').split('.')
    if (r1) return Number(r1)
    else return 0
  })

  // actions
  const init = async () => {
    const res = await listByAsync<Url>(LocalNameEnum.DB_URL)
    urls.value = res.list.sort((a, b) => b.sequence! - a.sequence!)
  }

  init()
    .then(() => console.log('url 初始化成功'))
    .catch((e) => console.log('url 初始化失败', e))

  const choose = (id: number): boolean => {
    // 查询URL
    const targetUrl = urls.value.find((e) => e.id! === id)
    if (!targetUrl) {
      return false
    }
    // 统计用户使用的es版本
    statistics.access('es_version', targetUrl.version)
    setItem(LocalNameEnum.KEY_LAST_URL, id)
    url.value = targetUrl
    title.value = targetUrl.name || 'es-client'
    client.value = createElasticsearchClient({
      ...url.value,
      id: url.value.id + '',
      created_at: 0,
      updated_at: 0,
      is_auth: url.value.isAuth ? 1 : 0,
      platform: 'elasticsearch',
      auth_type: url.value.authType,
      auth_user: url.value.authUser,
      auth_password: url.value.authPassword,
      adapter: useRequest
    })
    return true
  }

  const clear = () => {
    url.value = undefined
    client.value = undefined
    title.value = 'es-client'
  }

  const add = async (record: Omit<Url, 'id' | 'createTime' | 'updateTime'>) => {
    const now = new Date()
    const id = now.getTime()
    // 获取版本
    const response = await useRequestJson<Overview>('/', buildRequestConfig(record))

    urls.value.push({
      ...record,
      version: response.version.number,
      id,
      createTime: now,
      updateTime: now
    })
    await _sync()
  }

  const addByBatch = async (records: Array<Omit<Url, 'id' | 'createTime' | 'updateTime'>>) => {
    const now = new Date()
    const id = now.getTime()
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      urls.value.push({
        ...record,
        id: id + i,
        createTime: now,
        updateTime: now
      })
    }
    await _sync()
  }

  const update = async (id: number, record: Partial<Url>) => {
    const index = urls.value.findIndex((e) => e.id === id)
    if (index === -1) {
      return Promise.reject(`存储【${id}】不存在`)
    }
    const now = new Date()
    const oldUrl = urls.value[index]
    const target: Url = {
      ...oldUrl,
      ...record,
      id,
      updateTime: now
    }

    // 检查连接信息是否变更
    const connectionChanged =
      oldUrl.value !== target.value ||
      oldUrl.isAuth !== target.isAuth ||
      oldUrl.authType !== target.authType ||
      oldUrl.authUser !== target.authUser ||
      oldUrl.authPassword !== target.authPassword

    // 只有连接信息变更时才重新获取版本
    if (connectionChanged) {
      try {
        const response = await useRequestJson<Overview>('/', buildRequestConfig(target))
        target.version = response.version.number
      } catch (e) {
        return Promise.reject(`连接测试失败: ${e}`)
      }
    }

    urls.value[index] = target
    await _sync()
  }

  const remove = async (id: number) => {
    const index = urls.value.findIndex((e) => e.id === id)
    if (index === -1) {
      return Promise.reject(`链接【${id}】不存在`)
    }
    urls.value.splice(index, 1)
    await _sync()
    // TODO: 删除关联数据
    // 1. 删除数据浏览视图
    await clearDataBrowserViews(id)
    // 2. 删除数据浏览查询
    await clearDataBrowserQuery(id)
    // 删除高级查询列表
  }

  const save = async (res: Array<Url>) => {
    urls.value = res
    await _sync()
  }

  const _sync = async () => {
    await saveListByAsync(LocalNameEnum.DB_URL, urls.value)
  }

  return {
    urls,
    url,
    urlMap,
    list,
    current,
    id,
    empty,
    versionFirst,
    client,
    choose,
    clear,
    add,
    addByBatch,
    update,
    remove,
    save
  }
})
