/**
 * 基础排序
 */
export default interface BaseOrder {

    id: number;

    /**
     * 排序的字段
     */
    field: string;

    /**
     * 排序的方式
     */
    type: string;

    /**
     * 是否启用
     */
    isEnable: boolean;

}