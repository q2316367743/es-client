import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";

// 引入tauri
import {Body, fetch, HttpVerb, Response} from '@tauri-apps/api/http';
import Optional from "@/utils/Optional";

export default function fetchSelf<T>(config: HttpStrategyConfig): Promise<T> {
    return new Promise((resolve, reject) => {
        const baseUrl = Optional.ofNullable(config.baseURL).orElse("");
        const url = `${baseUrl === '' ? '' : (baseUrl + '/')}${config.url}`;
        if (config.auth) {
            let authorization = btoa(`${config.auth.username}:${config.auth.password}`);
            if (config.headers) {
                config.headers['Authorization'] = `Basic ${authorization}`;
            } else {
                config.headers = {
                    Authorization: `Basic ${authorization}`
                }
            }
        }
        let timeout = 5;
        if (config.timeout) {
            timeout = Math.round(config.timeout / 1000);
        }
        console.log(url, config)
        fetch<T>(url, {
            method: config.method?.toUpperCase() as HttpVerb,
            headers: config.headers,
            body: config.data ? Body.json(config.data) : undefined,
            timeout: timeout,
            responseType: 1,
            query: config.params
        }).then((response: Response<T>) => {
            if (response.data) {
                if (response.ok) {
                    resolve(response.data);
                } else {
                    reject({
                        response: {
                            data: response.data
                        }
                    })
                }
            } else {
                reject({
                    response: {
                        data: `请求【${url}】没有响应内容`
                    }
                });
            }
        }).catch((reason: any) => {
            console.error(reason)
            reject({
                response: {
                    data: reason
                }
            })
        });
    });
}