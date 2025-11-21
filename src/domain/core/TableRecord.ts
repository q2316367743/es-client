export interface TableRecord extends Record<string, any> {
  // 树表格
  children?: Array<TableRecord>;
}
