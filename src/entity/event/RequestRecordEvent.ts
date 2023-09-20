export default interface RequestRecordEvent {

    id: number;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 请求连接
     */
    url: string;

    /**
     * 请求方法
     */
    method: string;

    /**
     * 请求体
     */
    body: string;

    /**
     * 状态码
     */
    code: number;

    /**
     * 响应内容
     */
    response: any;

    /**
     * 请求耗时，毫秒
     */
    time: number;

    /**
     * 消息
     */
    message: string;

}
