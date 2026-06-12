/**
 * 基础字段
 */
export default interface Base {
  /**
   * ID
   */
  id: string

  /**
   * 创建时间
   */
  createTime: Date | string | number

  /**
   * 更新时间
   */
  updateTime: Date | string | number
}
