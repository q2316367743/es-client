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
     * 名字。唯一
     */
    name?: string;

    /**
     * 参数
     */
    body?: string;

    /**
     * 是否启用过滤器
     */
    isEnableFilter?: boolean;

    /**
     * 过滤器
     */
    filter?: string;

}
