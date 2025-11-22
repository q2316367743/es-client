import Base from "@/entity/Base";

/**
 * 高级查询历史记录
 */
export interface SeniorSearchRecord extends Base {

  urlId: number | undefined;

  method: string;

  link: string;

  body: string;

}
