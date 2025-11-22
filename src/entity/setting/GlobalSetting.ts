import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

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

  /*--------------------------------- track_total_hits设置 ---------------------------------*/

  /**
   * track_total_hits模式
   */
  trackTotalHitsMode: "true" | "false" | "custom";

  /**
   * 当模式为custom时，track_total_hits值
   */
  trackTotalHitsValue: number;

  /*--------------------------------- 显示设置 ---------------------------------*/

  /**
   * 默认分页大小
   */
  pageSize: number;

  /**
   * 基础 - 默认视图
   */
  baseDefaultViewer: ViewTypeEnum;

  /**
   * 高级 - 默认视图
   */
  seniorDefaultViewer: ViewTypeEnum;

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
    trackTotalHitsValue: 10000,
    trackTotalHitsMode: 'true',

    // 显示设置
    pageSize: 20,
    baseDefaultViewer: ViewTypeEnum.EDITOR,
    seniorDefaultViewer: ViewTypeEnum.EDITOR,

    // 其他设置
    lastUrl: false,
  };
}
