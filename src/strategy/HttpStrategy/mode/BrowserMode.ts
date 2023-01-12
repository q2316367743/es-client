import axios from "axios";

import HttpStrategyConfig from "../HttpStrategyConfig";

import {ElMessage} from 'element-plus'


const instance = axios.create();


// 响应拦截器
instance.interceptors.response.use(
    // 响应不作处理
    response => {
        return response.data;
    },
    error => {
        console.error('err', error)
        ElMessage({
            showClose: true,
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error)
    }
)

export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    return instance(config);
}

