import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";

/**
 * 文档搜索条件
 */
export interface DocumentSearchQuery {
  from?: number;
  size?: number;
  sort?: QuerySort;
  query?: Query;
  aggs?: any;
  /**
   * 跟踪总命中数
   * @since 7.0.0
   */
  track_total_hits?: boolean | number;
}

export type QuerySort = Record<string, SortCondition>;

export type SortCondition = Record<'order', SortConditionType>;

export type SortConditionType = 'asc' | 'desc';

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
  must?: Array<Record<ConditionKey, Record<string, any>>>;
  must_not?: Array<Record<ConditionKey, Record<string, any>>>;
  should?: Array<Record<ConditionKey, Record<string, any>>>;
}

export type ConditionArray = Array<Record<ConditionKey, Record<string, any>>>;

export type ConditionKey = 'match' | 'term' | 'terms' | 'exists' | 'wildcard' | 'range';

export const getDefaultDocumentSearchQuery = (): DocumentSearchQuery => ({
  sort: {},
  query: {
    bool: {
      must: [],
      should: [],
      must_not: []
    }
  },
  aggs: {},
  from: 0,
  size: useGlobalSettingStore().getPageSize
});

const defaultDocumentSearchQueryStr = stringifyJsonWithBigIntSupport(getDefaultDocumentSearchQuery());

export const getDefaultDocumentSearchQueryStr = (): string => defaultDocumentSearchQueryStr;



