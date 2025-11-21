import {Method} from "axios";

/**
 * 高级查询 - 页面跳转事件
 */
export default interface SeniorSearchJumpEvent {

  /**
   * 请求方法
   */
  method: Method;

  /**
   * 请求链接
   */
  link: string;

  /**
   /**
   * 请求体，存在会替代上面参数
   */
  body?: string;

}
