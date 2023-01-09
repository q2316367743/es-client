import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

export interface SearchItem {
    header: SearchItemHeader;
    body: SearchItemBody
}

export interface SearchItemHeader {
    id: number;
    name: string;
}

export interface SearchItemBody {

    link: string,
    method: Method,
    params: string,
    result: any,

}