export default interface HttpStrategyError {

    /**
     * 响应状态码
     */
    code: number;

    /**
     * 错误原因
     */
    reason: string;

    /**
     * 响应体
     */
    data: any;

}