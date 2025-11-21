/// <reference types="vite/client" />

declare interface TdAppUserOpt {
  /**
   * 账户的唯一标识，用于区分不同用户
   */
  profileId: string;
  /**
   * 传入账户的类型。支持匿名、自有账户显性注册、第三方账户及其他预留的自定义账户类型，共4大类，具体如下：
   * 0：ANONYMOUS，匿名账号；
   * 1：REGISTERED，自有帐户显性注册；
   * 2：SINA_WEIBO，新浪微博账号；
   * 3：QQ，QQ账号；
   * 4：TENCENT_WEIBO，腾讯微博账号；
   * 5：ND91，91平台账号；
   * 6：WEIXIN,微信账号
   * 11：Type1
   * 12：Type2；
   * 13：Type3；
   * ……
   * 20：Type10
   */
  profileType: number;
  /**
   * 账户名称
   */
  name?: string;
  /**
   * 性别，0：未知；1：男性；2：女性
   */
  gender?: number;
  /**
   * 年龄，限数字
   */
  age?: number;
  // property1到property10为扩展属性
  property1?: string | number;
  property2?: string | number;
  property3?: string | number;
  property4?: string | number;
  property5?: string | number;
  property6?: string | number;
  property7?: string | number;
  property8?: string | number;
  property9?: string | number;
  property10?: string | number;
}

declare interface TDAPP {
  /**
   * 自定义事件
   * @param eventId 自定义事件ID
   * 64个字符以内的中文、英文、数字、下划线，不要加空格或其他的转义字符
   * @param label 一个事件的子分类
   * 64个字符以内的中文、英文、数字、下划线，不要加空格或其他的转义字符
   * @param mapKv 事件的参数信息，描绘发生事件时的属性和场景
   * Object键值对中的value如果是number类型，服务器会做sum/avg之类的处理；如果是其他类型，按string对待做次数统计
   */
  onEvent(eventId: string, label?: string, mapKv?: Record<string, string>): void;

  /**
   * 注册
   * @param opt
   */
  register(opt: TdAppUserOpt): void;

  /**
   * 登录
   */
  login(opt: TdAppUserOpt): void;
}


interface UmamiProps {
  hostname?: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url?: string;
  website: string;
}

interface UmamiPropData extends UmamiProps {
  name?: string;
  data?: Record<string, string | number | boolean>;
}

interface UmamiInstance {

  track(event: string, data?: Record<string, string | number | boolean>): void;

  track(data: UmamiProps): void;

  track(func: (props: Required<UmamiProps>) => UmamiPropData): void;

}

interface Window {
  preload: {
    axios: <T>(config: any) => any,
    iconv(content: any, charset: string): string,
    sendTo(id: number, channel: string, data: any): void;
  },
  mode: string,
  referrer: string,
  TDAPP: TDAPP,
  umami: UmamiInstance
}

interface ImportMetaEnv {
  // 发行版
  VITE_MODE: string;
  VITE_PLATFORM: string;
  VITE_REFERRER: string;
  VITE_HOMENAME: string;
}
