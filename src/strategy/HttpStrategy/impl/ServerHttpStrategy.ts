import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import axios from "axios";
import {ElMessage} from "element-plus";
import HttpCommonHandle from "@/strategy/HttpStrategy/HttpCommonHandle";

interface Result {

    success: boolean;

    data: any

}

export default class ServerHttpStrategy implements HttpStrategy {

    all(config: HttpStrategyConfig): Promise<any> {
        HttpCommonHandle(config);
        return this.base(config);
    }

    base(config: HttpStrategyConfig): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            axios({
                url: 'http://localhost:3000/api/http',
                data: config,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((data) => {
                let result = data.data as Result;
                if (result.success) {
                    resolve(result.data);
                }else {
                    ElMessage({
                        showClose: true,
                        message: result.data,
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