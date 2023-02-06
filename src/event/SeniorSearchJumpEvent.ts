import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * 高级查询 - 页面跳转事件
 */
export default interface SeniorSearchJumpEvent {

    /**
     * 关联历史ID，只有历史跳转有
     */
    id?: number;

    /**
     * 名称
     * */
    name?: string;
    /**
     * 请求方法
     */
    method?: Method;

    /**
     * 请求链接
     */
    link?: string;

    /**
     * 请求参数
     */
    params?: string;

    /**
     * 请求体，存在会替代上面参数
     */
    body?: string;

    /**
     * 是否执行
     */
    execute: boolean;

}