import {SelectOptionData} from "@/domain/common/SelectOption";

/**
 * 基础查询
 */
export interface BaseQuery {

  /**
   * 唯一标识，时间戳
   */
  id: number;

  /**
   * 查询类型 <br />
   * ['must', 'should', 'must_not']
   */
  type: BaseQueryType,

  /**
   * 字段
   */
  field: string;

  /**
   * 条件 <br />
   * 'match', 'wildcard', 'prefix', 'range', 'fuzzy', 'query_string', 'text', 'missing'
   */
  condition: BaseQueryCondition;

  /**
   * 值
   */
  value: string;

  /**
   * 是否启用
   */
  isEnable: boolean;

}

export type BaseQueryType = 'must' | 'should' | 'must_not';

export type BaseQueryCondition =
// 分词查询
  'match' |
  // 文本字段进行短语匹配
  'match_phrase' |
  // 精准查询
  'term' |
  // 可以搜索多个值
  'terms' |
  // 是否存在
  'exists' |
  // 是否不存在
  'missing' |
  // 通配符查询
  'wildcard' |
  'range_lt' |
  'range_lte' |
  'range_gt' |
  'range_gte';

export function getDefaultBaseQuery(): BaseQuery {
  return {
    id: new Date().getTime(),
    condition: 'match',
    field: '',
    isEnable: true,
    type: 'must',
    value: ''
  }
}


export const BaseQueryConditionOption: Array<SelectOptionData> = [{
  label: 'match',
  value: 'match'
}, {
  label: 'match_phrase',
  value: 'match_phrase'
}, {
  label: 'term',
  value: 'term'
}, {
  label: 'terms',
  value: 'terms'
}, {
  label: 'exists',
  value: 'exists'
}, {
  label: 'missing',
  value: 'missing'
}, {
  label: 'wildcard',
  value: 'wildcard'
}, {
  label: 'range lt',
  value: 'range_lt'
}, {
  label: 'range lte',
  value: 'range_lte'
}, {
  label: 'range gt',
  value: 'range_gt'
}, {
  label: 'range gte',
  value: 'range_gte'
}]
