import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * 标签项
 */
export default interface TagItem {

    /**
     * id，唯一
     */
    id: number;

    /**
     * 标签名字
     */
    name: string;

    /**
     * 链接
     */
    link: string;

    /**
     * 求求方法
     */
    method: Method,

    /**
     * 请求参数
     */
    params: string,

    /**
     * 结果
     */
    result: any,

}