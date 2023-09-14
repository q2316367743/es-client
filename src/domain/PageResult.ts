/**
 * 分页结果集
 */
export default interface PageResult<T> {

    /**
     * 当前页面
     */
    current: number;

    /**
     * 页面大小
     */
    size: number;

    /**
     * 总数
     */
    total: number;

    /**
     * 记录
     */
    records: Array<T>;

}
