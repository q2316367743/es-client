export default interface FetchArgs {

    /**
     * ID，用于监听回调事件
     */
    id: number;

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