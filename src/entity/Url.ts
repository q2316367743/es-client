import Base from '@/entity/Base'
import UrlAuthTypeEnum from '@/enumeration/UrlAuthTypeEnum'

export interface UrlForm {
  /**
   * 链接名称
   */
  name: string

  /**
   * 链接值
   */
  value: string

  /**
   * 排序
   */
  sequence: number
  /**
   * 是否需要认证
   */
  isAuth: boolean

  /**
   * 认证类型那个，默认Basic认证
   */
  authType: UrlAuthTypeEnum

  /**
   * 用户名
   */
  authUser: string

  /**
   * 密码
   */
  authPassword: string

  /**
   * 版本信息
   */
  version: string

  platform: 'elasticsearch' | 'opensearch' | 'easysearch'
}

export interface Url extends Base, UrlForm {}

export function getDefaultUrl(source?: Partial<UrlForm>): UrlForm {
  return Object.assign<UrlForm, Partial<UrlForm>>(
    {
      version: '',
      name: '',
      value: 'http://',
      sequence: 0,
      isAuth: false,
      authType: UrlAuthTypeEnum.BASIC as UrlAuthTypeEnum,
      authUser: '',
      authPassword: '',
      platform: 'elasticsearch'
    },
    source || {}
  )
}
