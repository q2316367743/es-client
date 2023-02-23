import axios, { AxiosError } from "axios";

import HttpStrategyConfig from "../HttpStrategyConfig";

import MessageUtil from "@/utils/MessageUtil";
import { P } from "@tauri-apps/api/event-2a9960e7";
import HttpStrategyError from "../HttpStrategyError";
import Optional from "@/utils/Optional";


const instance = axios.create();


// 响应拦截器
instance.interceptors.response.use(
    // 响应不作处理
    response => {
        return response.data;
    },
    (error: AxiosError) => {
        console.error(error)
        MessageUtil.error(error.message);
        return Promise.reject(error)
    }
)

export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        instance(config).then((rsp: any) => {
            resolve(rsp);
        }).catch(reason => {
            //reason.response.status
            reject({
                code: Optional.ofNullable(reason)
                    .attr('response')
                    .attr('status')
                    .orElse(500),
                reason: Optional.ofNullable(reason)
                    .attr('message')
                    .orElse(''),
                data: Optional.ofNullable(reason)
                    .attr('response')
                    .attr('data')
                    .orElse({})
            } as HttpStrategyError)
        })
    });
}

