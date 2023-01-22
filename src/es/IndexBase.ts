/**
 * 索引信息
 */
export interface IndexBase {

    /**
     * 设置
     */
    settings: Setting;

    /**
     * 映射
     */
    mappings: Mapping;

}

export interface Setting {

    /**
     * 分片数
     */
    number_of_shards: number;

    /**
     * 副本数
     */
    number_of_replicas: number;

}

export interface Mapping {

    /**
     *
     */
    properties: Record<string, Property>;

}

export interface Property {

    /**
     * 字段类型
     */
    type?: Type;

    /**
     * keyword独有字段
     */
    fields?: { keyword: Keyword };

    /**
     * 属性
     */
    properties?: Record<string, Property>;

    search_analyzer?: string;

    analyzer?: string;

    /**
     * 日期类型的格式化
     */
    format?: string;

}


export type Type = 'text' |
    'long' |
    'date' |
    'keyword' |
    'short' |
    'integer' |
    'nested';

export interface Keyword {

    ignore_above: number;

    /**
     * 字段类型
     */
    type: string;

}