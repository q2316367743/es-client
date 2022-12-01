import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

export default interface Chart {

    /**
     * ID；时间戳
     */
    id: number;

    /**
     * 创建时间
     */
    create_time?: Date;

    /**
     * 更新时间
     */
    update_time?: Date;

    /**
     * 图表名字
     */
    name: string;

    /**
     * 索引ID
     */
    index_id: number;

    /**
     * 描述
     */
    description: string;

    /**
     * 请求方式
     */
    method: Method;

    /**
     * 请求路径
     */
    path: string;

    /**
     * 请求参数
     */
    params: string;

    /**
     * 请求体
     */
    data: string;

    /**
     * 模板
     */
    template: string;

}