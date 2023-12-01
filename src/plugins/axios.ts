import {AxiosRequestConfig} from "axios";
import useUrlStore from "@/store/UrlStore";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";
import JSONBig from 'json-bigint';
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useErrorStore} from "@/store/components/ErrorStore";
import MessageUtil from "@/utils/MessageUtil";

interface Response<T> {
    /** The request URL. */
    url: string;
    /** The response status code. */
    status: number;
    /** The response data. */
    data: T;
}

// const error = {
//     code: "ERR_BAD_REQUEST",
//     config: {} as AxiosRequestConfig,
//     message: "Request failed with status code 400",
//     name: "AxiosError",
//     request: {},
//     response: {
//         config: {} as AxiosRequestConfig,
//         data: "{\"error\":{\"root_cause\":[{\"type\":\"parsing_exception\",\"reason\":\"Expected [START_OBJECT]",
//         headers: {} as AxiosHeaders,
//         request: {},
//         status: 400,
//         statusText: "Bad Request"
//     }
// } as AxiosError

/**
 * axios的简单封装
 *
 * @param config 配置项
 */
async function axios(config: AxiosRequestConfig): Promise<Response<string>> {
    const rsp = await window.preload.axios<string>({
        ...config,
        responseType: 'text'
    });
    return Promise.resolve({
        url: (rsp.config.baseURL || '') + (rsp.config.url || ''),
        data: rsp.data,
        status: rsp.status
    });
}

/**
 * 执行一个HTTP请求
 * @param config 请求配置项
 * @return 响应内容
 */
export async function http<T>(config: AxiosRequestConfig): Promise<Response<T>> {
    config.timeout = useGlobalSettingStore().getTimeout;
    let result: Response<string>;
    // 先判断是否是判断是否是桌面客户端
    result = await axios(config);

    if (config.responseType === 'text') {

        return Promise.resolve({
            ...result,
            data: result.data as T,
        });
    }
    try {
        return Promise.resolve({
            ...result,
            data: jsonParse(result.data),
        });
    } catch (e) {
        MessageUtil.error("JSON解析失败", e);
        return Promise.resolve({
            ...result,
            data: result.data as T,
        });
    }
}

/**
 * 对HTTP请求的包装，主要是增加了请求记录
 *
 * @param config 请求配置项
 */
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
            response: e.response ? e.response.data : {},
            message: e.message
        })
        throw e;
    }
}

/**
 * 对es的http请求进行了封装，主要是增加了基础URL和认证信息
 *
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

/**
 * JSON解析，将字符串解析为对象
 * @param data
 */
export function jsonParse<T = any>(data: string): T {
    return JSONBig.parse(data, (_key, value) => {
        try {
            if (typeof value === 'object') {
                if (value.constructor) {
                    // 存在构造器，是个类
                    if (value.constructor.name == 'BigNumber2') {
                        return value.toString();
                    } else if (value.constructor.name == 'BigNumber') {
                        return value.toString();
                    }  else if (value.constructor.name == 'Array') {
                        return value;
                    } else {
                        // 尝试解决数据异常问题
                        return `${value}`;
                    }
                }
            }
        } catch (e) {
            return value;
        }
        return value;
    })
}
