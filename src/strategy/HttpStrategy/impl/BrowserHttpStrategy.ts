import axios from "axios";

import HttpStrategy from "../HttpStrategy";
import HttpStrategyConfig from "../HttpStrategyConfig";

import {ElMessage} from 'element-plus'

export default class BrowserHttpStrategy implements HttpStrategy {

    private readonly instance = axios.create();

    constructor() {

        // 响应拦截器
        this.instance.interceptors.response.use(
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
    }

    es(config: HttpStrategyConfig): Promise<any> {
        return this.fetch(config);
    }

    fetch<T>(config: HttpStrategyConfig): Promise<T> {
        return this.instance(config);
    }

    server<T>(config: HttpStrategyConfig): Promise<T> {
        return this.fetch(config);
    }

}