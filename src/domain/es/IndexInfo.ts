import {Mapping, Setting} from "@/domain/es/IndexBase";

export interface IndexInfo {

  /**
   * 状态
   */
  state: string;

  /**
   * 别名
   */
  aliases: Array<string>;

  /**
   * 映射
   */
  mappings: Record<string, Mapping>;

  /**
   * 设置
   */
  settings: SettingInfo;

}

export interface SettingInfo extends Setting {

  /**
   * 创建日期，时间戳
   */
  creation_date: string;

  /**
   * UUID
   */
  uuid: string;

  /**
   * 版本
   */
  version: {
    created: string;
  };

  /**
   * 名字
   */
  provided_name: string;

}

