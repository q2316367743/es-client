import {AxiosError, AxiosHeaders, AxiosRequestConfig} from "axios";
import useUrlStore from "@/store/UrlStore";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";
import JSONBig from 'json-bigint';
import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {fetch, ResponseType, Body} from "@tauri-apps/api/http";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useErrorStore} from "@/store/components/ErrorStore";

interface Response<T> {
    /** The request URL. */
    url: string;
    /** The response status code. */
    status: number;
    /** The response data. */
    data: T;
}

const error = {
    code: "ERR_BAD_REQUEST",
    config: {} as AxiosRequestConfig,
    message: "Request failed with status code 400",
    name: "AxiosError",
    request: {},
    response: {
        config: {} as AxiosRequestConfig,
        data: "{\"error\":{\"root_cause\":[{\"type\":\"parsing_exception\",\"reason\":\"Expected [START_OBJECT]",
        headers: {} as AxiosHeaders,
        request: {},
        status: 400,
        statusText: "Bad Request"
    }
} as AxiosError

async function tauri(config: AxiosRequestConfig): Promise<Response<string>> {
    try {
        let body = undefined;
        if (config.data) {
            body = typeof config.data === 'string' ? Body.text(config.data) : Body.json(config.data);
        }
        const rsp = await fetch<string>((config.baseURL || '') + (config.url || ''), {
            headers: config.headers || {},
            method: config.method as any,
            query: config.params,
            timeout: config.timeout,
            responseType: ResponseType.Text,
            body
        });
        return {
            url: rsp.url,
            data: rsp.data,
            status: rsp.status
        }
    } catch (e) {
        // TODO: 抛出的异常类型
        console.error(e);
        throw new AxiosError();
    }
}

async function axios(config: AxiosRequestConfig): Promise<Response<string>> {
    const rsp = await window.preload.axios<string>(config);
    return Promise.resolve({
        url: (rsp.config.baseURL || '') + (rsp.config.url || ''),
        data: rsp.data,
        status: rsp.status
    });
}


export async function http<T>(config: AxiosRequestConfig): Promise<Response<T>> {
    config.timeout = useGlobalSettingStore().getTimeout;
    let result: Response<string>;
    // 先判断是否是判断是否是桌面客户端
    if (Constant.mode === PluginModeEnum.DESKTOP) {
        result = await tauri(config);
    } else {
        result = await axios(config);
    }

    return Promise.resolve({
        ...result,
        data: config.responseType === 'text' ? (result.data as T) : jsonParse(result.data),
    });

}


export async function httpWrap<T>(config: AxiosRequestConfig): Promise<T> {
    const now = new Date().getTime();
    const event = {
        url: '',
        createTime: new Date(),
        method: config.method + '',
        body: config.data ? (typeof config.data === 'string' ? config.data : JSON.stringify(config.data)) : (config.data + ''),
        code: 200,
        time: 0,
        response: {}
    }
    try {
        const res = await http<T>(config);
        useErrorStore().addEvent({
            ...event,
            url: res.url,
            code: res.status,
            time: new Date().getTime() - now,
            response: res.data,
            message: ''
        })
        return res.data;
    } catch (e: any) {
        useErrorStore().addEvent({
            ...event,
            url: e.config ? ((e.config.baseURL || '') + (e.config.url || '')) : '',
            code: e.response ? e.response.status : 0,
            time: new Date().getTime() - now,
            response: e.response.data,
            message: e.message
        })
        throw e;
    }
}

/**
 * http请求
 * @param config
 */
export async function fetchEs<T>(config: AxiosRequestConfig): Promise<T> {

    if (useUrlStore().current.trim() === '' && (!config.url || !config.url.startsWith("http"))) {
        return Promise.reject("请先选择链接！");
    }

    let headers: Record<string, string> = {};

    // 如果有密码应该追加密码
    let url = useUrlStore().url;
    if (url) {
        if (url.isAuth) {
            if (url.authType === UrlAuthTypeEnum.HEADER) {
                headers[url.authUser] = url.authPassword;
            }
            if (url.authType === UrlAuthTypeEnum.COOKIE) {
                headers['Cookie'] = url.authPassword;
            } else {
                config.auth = {
                    username: url.authUser,
                    password: url.authPassword
                }
            }
        }
    }

    return httpWrap<T>({
        ...config,
        baseURL: useUrlStore().current,
        headers: {
            ...config.headers,
            ...headers
        },
        responseEncoding: "utf-8"
    });
}

export function jsonParse<T = any>(data: string): T {
    return JSONBig.parse(data, (_key, value) => {
        try {
            if (typeof value === 'object' && value.constructor && value.constructor.name == 'BigNumber2') {
                return value.toString();
            }
        } catch (e) {
            return value;
        }
        return value;
    })
}
