import {BaseQuery} from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";
import Base from "@/entity/Base";

/**
 * 历史记录
 * */
export default interface BaseSearchHistory extends Base{

    /**
     * URL的id
     */
    urlId: number

    /**
     * 名字。唯一
     */
    name: string;

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
