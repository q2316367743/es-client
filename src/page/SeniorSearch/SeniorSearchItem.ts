import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";

export interface SeniorSearchItem {
    header: TabMenuItem;
    body: SeniorSearchItemBody
}


export interface SeniorSearchItemBody {

    link: string,
    method: Method,
    params: string,
    result: any,

}