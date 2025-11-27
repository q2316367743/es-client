import MappingNode from "@/components/IndexMapping/domain/MappingNode";

export default interface MappingData {

  /**
   * 类型
   */
  type: string;

  /**
   * 动态
   */
  dynamic: string;

  /**
   * 节点
   */
  nodes: Array<MappingNode>;
}