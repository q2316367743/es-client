import axios, {AxiosRequestConfig} from "axios";
import useUrlStore from "@/store/UrlStore";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";
import JSONBig from 'json-bigint';

export async function http<T>(config: AxiosRequestConfig): Promise<T> {
    const rsp = await axios<T>(config);
    return rsp.data;
}

/**
 * http请求
 * @param config
 */
export async function fetchEs<T>(config: AxiosRequestConfig): Promise<T> {

    if (useUrlStore().current.trim() === '') {
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

    const data = await http<string>({
        ...config,
        baseURL: useUrlStore().current,
        headers: {
            ...config.headers,
            ...headers
        },
        responseType: "text",
        responseEncoding: "utf-8"
    });

    // 如果设置了响应类型是字符串，那么就不解码
    if (config.responseType === 'text') {
        return Promise.resolve(data as T);
    }

    return Promise.resolve(jsonParse(data));
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
