import Base from "@/entity/Base";
import BaseQuery from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";

export interface BaseSearchRecord extends Base {

    /**
     * URL的id，可能存在
     */
    urlId?: number

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

}
