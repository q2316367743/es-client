import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import {esHandle, serverHandle} from "@/strategy/HttpStrategy/HttpCommonHandle";

// 引入tauri
import {Body, fetch, HttpVerb, Response} from '@tauri-apps/api/http';
import BrowserUtil from "@/utils/BrowserUtil";

export default class TauriHttpStrategy implements HttpStrategy {
    es(config: HttpStrategyConfig): Promise<any> {
        esHandle(config);
        return this.fetch(config);
    }

    fetch<T>(config: HttpStrategyConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            const url = `${config.baseURL}/${config.url}`;
            if (config.auth) {
                let authorization = btoa(`${config.auth.username}:${config.auth.password}`);
                if (config.headers) {
                    config.headers['Authorization'] = authorization;
                }else {
                    config.headers = {
                        Authorization: authorization
                    }
                }
            }
            fetch<T>(url, {
                method: config.method as HttpVerb,
                headers: config.headers,
                body: config.data ? Body.json(config.data) : undefined,
                timeout: config.timeout || 5000,
                responseType: 1,
                query: config.params
            }).then((response: Response<T>) => {
                if (response.data) {
                    if (response.ok) {
                        resolve(response.data);
                    } else {
                        reject(response.data)
                    }
                } else {
                    reject(`请求【${url}】没有响应内容`)
                }
            }).catch((reason: any) => {
                console.log(reason)
                reject(reason)
            });
        });
    }

    server<T>(config: HttpStrategyConfig): Promise<T> {
        serverHandle(config);
        return this.fetch(config);
    }

}