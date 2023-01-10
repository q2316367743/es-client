import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import BaseQuery from "@/domain/BaseQuery";
import BaseOrder from "@/domain/BaseOrder";

export interface BaseSearchItem {

    header: TabMenuItem;

    body: BaseSearchItemBody;

}

export interface BaseSearchItemBody {

    index: string,

    conditions: Array<BaseQuery>;

    orders: Array<BaseOrder>;

    page: number;

    size: number;

    total: number;

    result: any;

}