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

export default interface HttpStrategyConfig{

    url: string;
    method: Method | undefined;
    params?: any;
    data?: any;
    timeout?: number;
    auth?: BasicCredentials;
    
}