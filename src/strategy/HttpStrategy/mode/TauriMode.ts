import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";

// 引入tauri
import { Body, fetch, HttpVerb, Response, ResponseType } from '@tauri-apps/api/http';
import Optional from "@/utils/Optional";
import HttpStrategyError from "../HttpStrategyError";
import {getUrl} from "@/strategy/HttpStrategy/HttpModeUtil";

export default function fetchSelf<T>(config: HttpStrategyConfig): Promise<T> {
    return new Promise((resolve, reject) => {
        const url = getUrl(config.baseURL, config.url);
        let timeout = 5;
        if (config.timeout) {
            timeout = Math.round(config.timeout / 1000);
        }
        // 默认JSON
        let responseType = ResponseType.JSON;
        if (config.responseType === 'text') {
            responseType = ResponseType.Text;
        }
        if(config.auth && config.headers) {
            config.headers['Authorization'] = 'Basic ' + btoa(config.auth.username +':' + config.auth.password)
        }
        fetch<T>(url, {
            method: config.method?.toUpperCase() as HttpVerb,
            headers: config.headers,
            body: config.data ? Body.json(config.data) : undefined,
            timeout: timeout,
            responseType,
            query: config.params
        }).then((response: Response<T>) => {
            if (response.data) {
                if (response.ok) {
                    resolve(response.data);
                } else {
                    reject({
                        code: response.status,
                        // response.data.error.reason
                        reason: Optional.ofNullable(response)
                            .attr("data")
                            .attr("error")
                            .attr("reason")
                            .orElse(""),
                        data: response.data
                    } as HttpStrategyError)
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
                code: reason.response.data.status,
                reason: reason.response.data.error.reason,
                data: reason
            } as HttpStrategyError)
        });
    });
}