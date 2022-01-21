export default interface BaseQuery {

    /**
     * 查询类型
     * ['must', 'should', 'must_not']
     */
    type: string,

    /**
     * 字段
     */
    field: string;

    /**
     * 条件
     * ['match', 'wildcard', 'prefix', 'range', 'fuzzy', 'query_string', 'text', 'missing']
     */
    condition: string;

    /**
     * 值
     */
    value: string;

    /**
     * 额外左条件
     * ['gt', 'gte']
     */
    extra_left_cindition: string;

    /**
     * 额外左条件值
     */
    extra_left_value: string;

    /**
     * 额外右条件
     * ['lt', 'lte']
     */
    extra_right_cindition: string;

    /**
     * 额外右条件值
     */
    extra_right_value: string;

}