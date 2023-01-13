/**
 * 设置
 */
export default interface Setting {

    // 新建索引

    /**
     * 默认分片
     */
    defaultShard: number;

    /**
     * 默认副本
     */
    defaultReplica: number;

    /**
     * 默认视图
     */
    defaultViewer: number;

    /**
     * 默认分页大小
     */
    pageSize: number;

    /**
     * 超时时间
     */
    timeout: number;

    /**
     * 概览 => 搜索 => 状态
     */
    homeSearchState: number;

    /**
     * 概览 => 搜索 => 排除的索引
     */
    homeExcludeIndices: Array<string>;

    /**
     * 展示标签栏
     */
    showTab: boolean;

    /**
     * JSON主题 - 白天
     */
    jsonThemeByLight: string;

    /**
     * JSON主题 - 黑夜
     */
    jsonThemeByDark: string;

    /**
     * 自动全屏
     */
    autoFullScreen: boolean;

}