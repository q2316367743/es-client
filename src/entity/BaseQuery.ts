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

export type BaseQueryCondition = 'match' | 'term' | 'terms' | 'exists' | 'missing' | 'wildcard' |
    'range_lt' | 'range_lte' | 'range_gt' | 'range_gte';

export function getDefaultBaseQuery():BaseQuery {
    return {
        id: new Date().getTime(),
        condition: 'match',
        field: '',
        isEnable: true,
        type: 'must',
        value: ''
    }
}
