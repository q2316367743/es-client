import TabMenuItem from "@/components/TabMenu/TabMenuItem";

export interface SeniorSearchItem {

    /**
     * 标签
     */
    header: TabMenuItem;

    /**
     * 请求体
     */
    body: string;

    /**
     * 是否启用过滤器
     */
    isEnableFilter: boolean;

    /**
     * 过滤器
     */
    filter: string;

}
