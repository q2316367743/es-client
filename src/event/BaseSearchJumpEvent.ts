import BaseQuery from "@/domain/BaseQuery";
import BaseOrder from "@/domain/BaseOrder";

/**
 * 基础查询 - 页面跳转事件
 */
export default interface BaseSearchJumpEvent {

    /**
     * 历史记录载入时存在
     */
    id?: number;

    /**
     * 名字。唯一
     */
    name?: string;

    /**
     * 索引
     */
    index: string;

    /**
     * 条件
     */
    conditions: Array<BaseQuery>;

    /**
     * 排序
     */
    orders: Array<BaseOrder>;

    execute: boolean;

}