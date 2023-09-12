/**
 * 文档搜索条件
 */
export interface DocumentSearchQuery {
  from?: number;
  size?: number;
  sort?: Record<string, SortCondition>;
  query?: Query;
}


interface SortCondition {
  order: string;
}

/**
 * 查询条件
 */
interface Query {
  bool: Bool;
}

/**
 * bool条件查询
 */
interface Bool {
  must?: BoolCondition[];
  must_not?: BoolCondition[];
  should?: BoolCondition[];
}



interface BoolCondition {
  term?: Record<string, any>;
}




