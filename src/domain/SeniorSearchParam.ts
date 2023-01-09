import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * 复杂查询 - 参数
 */
export default interface SeniorSearchParam {

    /**
     * 名称
     * */
    name?: string;
    /**
     * 请求方法
     */
    method: Method;

    /**
     * 请求链接
     */
    url: string;

    /**
     * 请求参数
     */
    param: string;

    /**
     * 是否执行
     */
    execute: boolean;

}