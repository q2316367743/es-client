import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import Base from "@/entity/Base";

/**
 * 历史记录
 * */
export default interface SeniorSearchHistory extends Base{

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