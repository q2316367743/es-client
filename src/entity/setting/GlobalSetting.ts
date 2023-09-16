import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";

/**
 * 设置
 */
export interface GlobalSetting {

    /*--------------------------------- 新建索引 ---------------------------------*/

    /**
     * 默认分片
     */
    defaultShard: number;

    /**
     * 默认副本
     */
    defaultReplica: number;

    /*--------------------------------- 时间相关 ---------------------------------*/

    /**
     * 超时时间
     */
    timeout: number;

    /**
     * 通知关闭时间
     */
    notificationTime: number;

    /*--------------------------------- 全局索引查询条件 ---------------------------------*/

    /**
     * 概览 => 搜索 => 状态
     */
    homeSearchState: number;

    /**
     * 概览 => 搜索 => 排除的索引
     */
    homeExcludeIndices: Array<string>;

    /**
     * 概览 => 搜索 => 显示的索引
     */
    homeIncludeIndices: Array<string>;

    /*--------------------------------- 显示设置 ---------------------------------*/

    /**
     * 默认分页大小
     */
    pageSize: number;

    /**
     * 默认视图
     */
    defaultViewer: number;

    /**
     * JSON字体，单位px，默认14
     */
    jsonFontSize: number;

    /**
     * JSON是否自动换行
     */
    jsonWrap: boolean;

    /**
     * JSON主题 - 白天
     */
    jsonThemeByLight: string;

    /**
     * JSON主题 - 黑夜
     */
    jsonThemeByDark: string;

    /**
     * 表格表头渲染模式
     */
    tableHeaderMode: TableHeaderModeEnum;

    /*--------------------------------- 其他设置 ---------------------------------*/

    /**
     * 保存上次选择的连接
     */
    lastUrl: boolean;

}


export function getDefaultGlobalSetting(): GlobalSetting {
    return {

        // 新建索引
        defaultReplica: 1,
        defaultShard: 5,

        // http设置
        timeout: 5000,
        notificationTime: 5000,

        // 全局索引查询条件
        homeSearchState: 0,
        homeExcludeIndices: new Array<string>(),
        homeIncludeIndices: new Array<string>(),

        // 显示设置
        pageSize: 20,
        defaultViewer: 2,
        jsonFontSize: 16,
        jsonWrap: false,
        jsonThemeByLight: 'github',
        jsonThemeByDark: 'github-dark',
        tableHeaderMode: TableHeaderModeEnum.RENDER,

        // 其他设置
        lastUrl: false,
    };
}
