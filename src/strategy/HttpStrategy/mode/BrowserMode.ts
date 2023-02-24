import axios, { AxiosError } from "axios";

import HttpStrategyConfig from "../HttpStrategyConfig";

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

