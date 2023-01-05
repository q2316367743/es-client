import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import HttpCommonHandle from "@/strategy/HttpStrategy/HttpCommonHandle";

// 引入tauri
import {Body, fetch, HttpVerb, Response} from '@tauri-apps/api/http';
import BrowserUtil from "@/utils/BrowserUtil";

export default class TauriHttpStrategy implements HttpStrategy {
    all(config: HttpStrategyConfig): Promise<any> {
        HttpCommonHandle(config);
        return this.base(config);
    }

    base(config: HttpStrategyConfig): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = `${config.baseURL}/${config.url}`;
            fetch<any>(url, {
                method: config.method as HttpVerb,
                headers: config.headers,
                body: config.data ? Body.json(config.data) : undefined,
                timeout: config.timeout || 5000,
                responseType: 1,
                query: config.params
            }).then((response: Response<any>) => {
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

}