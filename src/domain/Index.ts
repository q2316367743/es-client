/**
 * 索引实体类
 */
export interface Index {

    /**
     * 索引名称
     */
    name: string;

    /**
     * 设置
     */
    settings: Setting;

    /**
     * 映射
     */
    mapping: Array<Property>;
}

export interface Setting {

    /**
     * 分片数量
     */
    numberOfShards: number;

    /**
     * 副本数量
     */
    numberOfReplicas: number;

}

export interface Property {

    /**
     * 唯一标识，时间戳
     */
    id: number;

    /**
     * 字段
     */
    field: string;

    /**
     * 类型
     */
    type: string;

}