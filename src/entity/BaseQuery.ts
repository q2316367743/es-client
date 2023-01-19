/**
 * 基础查询
 */
export default interface BaseQuery {

    /**
     * 唯一标识，时间戳
     */
    id: number;

    /**
     * 查询类型 <br />
     * ['must', 'should', 'must_not']
     */
    type: string,

    /**
     * 字段
     */
    field: string;

    /**
     * 条件 <br />
     * ['match', 'wildcard', 'prefix', 'range', 'fuzzy', 'query_string', 'text', 'missing']
     */
    condition: string;

    /**
     * 值
     */
    value: string;

    /**
     * 额外左条件<br />
     * ['gt', 'gte']
     */
    extra_left_condition: string;

    /**
     * 额外左条件值
     */
    extra_left_value: string;

    /**
     * 额外右条件<br />
     * ['lt', 'lte']
     */
    extra_right_condition: string;

    /**
     * 额外右条件值
     */
    extra_right_value: string;

}