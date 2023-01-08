import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * 历史记录
 * */
export default interface HistoryEntity {

    /**
     * 历史ID
     */
    id?: number;

    /**
     * URL的id
     */
    urlId?: number

    /**
     * 创建时间
     */
    createTime?: Date;

    /**
     * 更新时间
     */
    updateTime?: Date;

    /**
     * 名字。唯一
     */
    name?: string;

    /**
     * 链接
     */
    link: string;

    /**
     * 请求方式
     */
    method: Method;

    /**
     * 参数
     */
    params: string;

}