import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import axios from "axios";
import {getUrl} from "@/strategy/HttpStrategy/HttpModeUtil";


export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    config.url = getUrl(config.baseURL, config.url);
    return new Promise<T>((resolve, reject) => {
        axios.request({
            url: '/api/fetch',
            method: 'POST',
            data: config
        }).then(response => {
            let data = response.data;
            if (data.success) {
                resolve(data.data);
            } else {
                reject(data.data);
            }
        }).catch(e => {
            reject(e);
        })
    })
}