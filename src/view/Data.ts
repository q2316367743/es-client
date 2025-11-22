export interface Repository {

  name: string;

  url: string;

}

export interface Log {

  version: string;

  sign: number;

  time: string;

  items: Array<string | LogItem | Array<string>>

  title?: string;

  /**
   * 文档地址
   */
  doc?: string;

  /**
   * 描述
   */
  remark: string;

}

export interface LogItem {

  label: LogItemEnum;

  content: string;

  /**
   * 兔小巢反馈
   */
  txc?: string

  /**
   * gitee反馈
   */
  gitee?: {

    title: string;

    content: string;
  }

  /**
   * pull request
   */
  pull?: {

    name: string;

    url: string;
  }

}

export enum LogItemEnum {

  /**
   * 新增
   */
  ADD = 1,

  /**
   * 优化
   */
  OPTIMIZATION = 2,

  /**
   * 修复
   */
  REPAIR = 3,

  /**
   * 更新/改版
   */
  UPDATE = 4

}

export interface Item {

  type: ItemType,

  value: string;

  addon?: string

}

export type ItemType = 'string' | 'link';