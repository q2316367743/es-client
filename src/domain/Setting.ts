import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";

/**
 * 设置
 */
export default interface Setting {

    /*--------------------------------- 布局方式 ---------------------------------*/

    /**
     * 默认页面
     */
    defaultPage: PageNameEnum;

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

    /*--------------------------------- 标签栏设置 ---------------------------------*/

    /**
     * 启用标签栏
     */
    showTab: boolean;

    /**
     * 标签载入模式
     */
    tabLoadMode: number;

    /**
     * 标签栏最大数量
     */
    tabMaxCount: number,

    /**
     * 超过最大数量后的关闭模式
     */
    tabCloseMode: TabCloseModeEnum,

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
     * 自动全屏
     */
    autoFullScreen: boolean;

    /**
     * 保存上次选择的连接
     */
    lastUrl: boolean;

    /**
     * 高级查询默认过滤
     */
    seniorFilter: boolean;

}