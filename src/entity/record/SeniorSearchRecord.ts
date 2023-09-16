import Base from "@/entity/Base";
import {Method} from "axios";

/**
 * 高级查询历史记录
 */
export interface SeniorSearchRecord extends Base {

    urlId: number | undefined;

    method: Method;

    link: string;

    body: string;

}
