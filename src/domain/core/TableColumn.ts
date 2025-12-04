export interface TableColumnSortable {
  sortDirections: ("ascend" | "descend")[];
}

export interface TableColumn {
  /**
   * 使用的字段
   */
  field: string;
  // 列名
  title: string;
  // 宽度
  width: number;
  // 是否固定
  fixed?: "left" | "right";
  // 是否省略
  ellipsis?: boolean;
  // 是否显示提示
  tooltip?: boolean | Record<string, any>;
  // 排序
  sortable?: TableColumnSortable;
  // 单元格样式
  cellClass?: string;
  // 是否显示
  show: boolean;
}
