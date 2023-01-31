import {Property, Setting} from "@/es/IndexBase";

export interface IndexInfo {

    /**
     * 状态
     */
    state: string;

    /**
     * 别名
     */
    aliases: Record<string, any>;

    /**
     * 映射
     */
    mappings: { _doc: Mapping };

    /**
     * 设置
     */
    settings: { index: SettingInfo };

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

export interface Mapping {

    _doc: { properties: Record<string, Property>; }

}