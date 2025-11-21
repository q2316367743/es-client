import Field from "../Field";
import {IndexInfo} from "@/domain/es/IndexInfo";
import {Mapping, Setting} from "@/domain/es/IndexBase";
import {Shard} from "@/domain/es/ClusterState";

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
   * 索引元信息
   */
  indexInfo: IndexInfo;

  // ------------------------------------------- 渲染后 -------------------------------------------

  /**
   * 状态
   */
  state?: string;

  /**
   * 分片
   */
  shards: Record<string, Array<Shard>>;

}
