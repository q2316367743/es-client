import Base from "@/entity/Base";
import {Method} from "axios";

/**
 * 历史记录
 * */
export default interface SeniorSearchHistory extends Base{

    /**
     * URL的id
     */
    urlId: number

    /**
     * 文件夹
     */
    folder: string;

    /**
     * 名字。唯一
     */
    name: string;

    /**
     * 请求方式
     */
    method: Method;

    /**
     * 链接
     */
    link: string;

    /**
     * 参数
     */
    body: string;


}
