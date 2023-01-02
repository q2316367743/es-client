/**
 * 设置
 */
export default interface Setting {

    /**
     * 默认分片
     */
    defaultShard: number;

    /**
     * 默认副本
     */
    defaultReplica: number;

    /**
     * 高级搜索的宽度（px）
     */
    seniorWidth: number;

    /**
     * 默认视图
     */
    defaultViewer: number;

    /**
     * 默认分页大小
     */
    pageSize: number;

    /**
     * 默认页码跨度
     */
    pageStep: number;

    /**
     * 超时时间
     */
    timeout: number;

    /**
     * 概览 => 搜索 => 状态
     */
    homeSearchState: number;

    /**
     * 自动全屏
     */
    autoFullScreen: boolean;

}