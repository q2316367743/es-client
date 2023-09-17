import Base from "@/entity/Base";
import {Method} from "axios";

export interface SeniorSearchHistoryIndex extends Base {

    /**
     * 名字。唯一
     */
    name: string;

}

/**
 * 历史记录
 * */
export interface SeniorSearchHistoryRecord {

    id: number;

    /**
     * 请求方式
     */
    method: Method | '';

    /**
     * 链接
     */
    link: string;

    /**
     * 参数
     */
    body: string;

}


export function getDefaultSeniorSearchHistoryRecord(): SeniorSearchHistoryRecord {
    return {
        id: 0,
        body: '',
        link: '',
        method: 'GET',
    }
}
