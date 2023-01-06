import Field from "../Field";
import Mapping from "@/view/index/Mapping";

/**
 * 主页索引遍历
 */
export default interface IndexView {

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
    shard: any;

    /**
     * 副本
     */
    replica: any;

    /**
     * 映射
     */
    mapping: Mapping;

    /**
     * 设置
     */
    settings: any;

    /**
     * 字段
     */
    fields: Array<Field>;

}
