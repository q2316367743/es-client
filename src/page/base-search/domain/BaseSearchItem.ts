import BaseQuery from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";

export interface BaseSearchItemBody {

    index: string,

    conditions: Array<BaseQuery>;

    orders: Array<BaseOrder>;

    page: number;

    size: number;

    total: number;

    result: any;

}
