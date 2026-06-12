import axios, { AxiosRequestConfig } from 'axios'
import { fetch } from '@tauri-apps/plugin-http'
import { useUrlStore } from '@/store'
import UrlAuthTypeEnum from '@/enumeration/UrlAuthTypeEnum'
import { parseJsonWithBigIntSupport } from '$/util'
import { Url } from '@/entity/Url'
import MessageUtil from '@/utils/model/MessageUtil'

export interface RequestConfig extends AxiosRequestConfig {
  /**
   * 是否是调试模式，如果是调试模式，则不会监控
   */
  debug?: boolean
}

const instance = axios.create({
  adapter: 'fetch',
  env:
    import.meta.env.VITE_PLATFORM === 'tauri'
      ? {
          fetch: fetch
        }
      : undefined
})

export async function useRequest(config: RequestConfig = {}): Promise<string> {
  console.debug('请求：', config)
  const response = await instance.request<string>({
    ...config,
    responseType: 'text'
  })
  return response.data
}

export async function useRequestJson<T extends Record<string, any>>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const r = await useRequest({
    ...config,
    url
  })
  return parseJsonWithBigIntSupport<T>(r)
}

export const buildEsRequestConfig = (
  config: RequestConfig,
  record?: Omit<Url, 'id' | 'createTime' | 'updateTime'>
): RequestConfig => {
  let headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8'
  }
  if (record) {
    if (record.isAuth) {
      if (record.authType === UrlAuthTypeEnum.BASIC) {
        config.auth = {
          username: record.authUser!,
          password: record.authPassword!
        }
      } else if (record.authType === UrlAuthTypeEnum.HEADER) {
        if (record.authUser) {
          headers[record.authUser] = record.authPassword
        }
      } else if (record.authType === UrlAuthTypeEnum.COOKIE) {
        MessageUtil.error('浏览器不支持Cookie认证')
      }
    }
  }
  return {
    baseURL: record?.value,
    ...config,
    headers: {
      // 默认的
      ...headers,
      // 自定义的
      ...config.headers
    }
  }
}

export async function useEsRequest(config: RequestConfig = {}): Promise<string> {
  const { url, current } = useUrlStore()
  if (current.trim() === '') {
    return Promise.reject(new Error('请先选择链接！'))
  }

  let headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8'
  }

  // 如果有密码应该追加密码
  return useRequest(
    buildEsRequestConfig(
      {
        ...config,
        baseURL: current,
        headers: {
          ...headers,
          ...config.headers
        },
        responseEncoding: 'utf-8'
      },
      url
    )
  )
}

export async function useEsRequestJson<T extends Record<string, any>>(
  config: RequestConfig = {}
): Promise<T> {
  const r = await useEsRequest(config)
  return parseJsonWithBigIntSupport<T>(r)
}
