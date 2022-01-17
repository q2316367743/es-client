/**
 * 主页索引遍历
 */
export interface Index {

    /**
     * 索引名称
     */
    name: string;

    /**
     * 别名
     */
    alias: Array<string>;

    /**
     * 索引大小，美化后的
     */
    size: string;

    /**
     * 索引大小，原始逐句
     */
    original_size: number;

    /**
     * 文档数
     */
    doc_count: number;

    /**
     * 状态
     */
    state?: string;

    /**
     * 分片
     */
    shard: Map<string, Array<object>>;

    /**
     * 副本
     */
    replica: Map<string, Array<object>>;

    /**
     * 分片数量
     * 
     * 用于新增
     */
    number_of_shards?: number;

    /**
     * 副本数量
     * 
     * 用于新增
     */
    number_of_replicas?: number;

}
