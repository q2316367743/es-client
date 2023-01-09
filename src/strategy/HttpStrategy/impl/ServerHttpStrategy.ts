import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import axios from "axios";
import {ElMessage} from "element-plus";
import {serverHandle} from "@/strategy/HttpStrategy/HttpCommonHandle";

interface Result<T> {

    success: boolean;

    data: T | string

}

export default class ServerHttpStrategy implements HttpStrategy {

    es(config: HttpStrategyConfig): Promise<any> {
        return this.fetch(config);
    }

    fetch<T>(config: HttpStrategyConfig): Promise<T> {
        // 服务器版本
        serverHandle(config);
        return new Promise<T>((resolve, reject) => {
            axios({
                url: '/api/fetch',
                data: config,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((data) => {
                let result = data.data as Result<T>;
                if (result.success) {
                    resolve(result.data as T);
                }else {
                    ElMessage({
                        showClose: true,
                        message: result.data as string,
                        type: 'error',
                        duration: 5 * 1000
                    });
                    reject(result.data);
                }
            }).catch(e => {
                reject(e);
            })
        });
    }

    server<T>(config: HttpStrategyConfig): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            axios(config).then((data) => {
                let result = data.data as Result<T>;
                if (result.success) {
                    resolve(result.data as T);
                }else {
                    ElMessage({
                        showClose: true,
                        message: result.data as string,
                        type: 'error',
                        duration: 5 * 1000
                    });
                    reject(result.data);
                }
            }).catch(e => {
                reject(e);
            })
        });
    }

}