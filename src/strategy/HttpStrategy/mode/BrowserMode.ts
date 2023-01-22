import axios from "axios";

import HttpStrategyConfig from "../HttpStrategyConfig";

import MessageUtil from "@/utils/MessageUtil";


const instance = axios.create();


// 响应拦截器
instance.interceptors.response.use(
    // 响应不作处理
    response => {
        return response.data;
    },
    error => {
        console.error(error)
        MessageUtil.error(error.message);
        return Promise.reject(error)
    }
)

export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    return instance(config);
}

