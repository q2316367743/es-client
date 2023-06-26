import {AxiosRequestConfig } from "axios";

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

interface BasicCredentials {
    username: string;
    password: string;
}

export default interface HttpStrategyConfig extends AxiosRequestConfig{

    url: string;
    method: Method | undefined;
    baseURL?: string;
    params?: any;
    data?: any;
    timeout?: number;
    auth?: BasicCredentials;

    /**
     * 请求头
     */
    headers?: Record<string, any>;

    /**
     * 是否隐藏
     */
    hidden?: boolean;

    responseType?: 'json' | 'text' | 'blob' | 'document' | 'arraybuffer';
    
}