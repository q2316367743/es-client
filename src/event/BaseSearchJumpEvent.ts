import BaseQuery from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";

/**
 * 基础查询 - 页面跳转事件
 */
export default interface BaseSearchJumpEvent {

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

    /**
     * 是否立即执行
     */
    execute: boolean;

}
