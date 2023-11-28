import Field from "../Field";
import {IndexInfo} from "@/components/es/domain/IndexInfo";
import {Setting, Mapping} from "@/components/es/domain/IndexBase";
import {Index} from "@/components/es/domain/Stats";
import {Shard} from "@/components/es/domain/ClusterState";

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
     * 映射
     */
    mapping: Mapping;

    /**
     * 设置
     */
    settings: Setting;

    /**
     * 字段
     */
    fields: Array<Field>;

    /**
     * 索引状态
     */
    indexStats: Index;

    /**
     * 索引元信息
     */
    indexInfo: IndexInfo;

    // ------------------------------------------- 渲染后 -------------------------------------------

    /**
     * 索引大小，美化后的
     */
    size: string;

    /**
     * 索引大小，原始数据
     */
    original_size: number;

    /**
     * 文档数
     */
    doc_count: string;

    /**
     * 原始文档数
     */
    original_doc_count: number;

    /**
     * 状态
     */
    state?: string;

    /**
     * 分片
     */
    shards: Record<string, Array<Shard>>;

}
