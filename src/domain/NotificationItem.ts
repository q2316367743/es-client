import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * 通知项
 */
export interface NotificationItem {

    /**
     * id
     */
    id: number;

    /**
     * 通知标题
     */
    title: string;

    /**
     * 通知时间
     */
    time: Date;

    /**
     * 类型
     */
    type: 'original' |  'http'

    /**
     * 内容
     */
    body: string;

    /**
     * 通知体
     */
    httpMode?: HttpMode;

}

export interface HttpMode {

    baseURL?: string;

    url: string;

    method: Method;

    data?: any;

    rsp: any;

}