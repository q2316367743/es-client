import {TreeNodeData} from "@arco-design/web-vue";

export default interface MappingNode extends TreeNodeData {

  disabled?: boolean;

  key: string;

  type: string;

  value: string;

  children: Array<MappingNode>;

}