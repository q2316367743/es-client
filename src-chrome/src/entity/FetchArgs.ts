import BaseArgs from "./BaseArgs";

export default interface FetchArgs extends BaseArgs{

    /**
     * 链接
     */
    url: string;

    /**
     * 请求方法
     */
    method: string;

    /**
     * 请求头
     */
    headers?: Record<string, any>;

    /**
     * 请求体
     */
    data?: Record<string, any> | string;

}