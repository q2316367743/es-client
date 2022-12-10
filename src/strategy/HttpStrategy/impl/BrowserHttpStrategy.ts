import axios from "axios";

import HttpStrategy from "../HttpStrategy";
import HttpStrategyConfig from "../HttpStrategyConfig";

import {ElMessage} from 'element-plus'
import useUrlStore from '@/store/UrlStore'
import useSettingStore from '@/store/SettingStore'
import i18n from '@/i18n'

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
                    message: error.message,
                    type: 'error',
                    duration: 5 * 1000
                })
                return Promise.reject(error)
            }
        )
    }

    all(config: HttpStrategyConfig): Promise<any> {
        // 基础链接每次动态取值
        config.baseURL = useUrlStore().current;
        if (!config.baseURL || config.baseURL === '') {
            throw new Error(i18n.global.locale.value == 'zh' ? '请选择链接' : 'please select a link')
        }
        // TODO: 如果有密码应该追加密码
        let url = useUrlStore().url;
        if (url && url.is_auth && url.auth_user && url.auth_password) {
            config.auth = {
                username: url.auth_user,
                password: url.auth_password
            }
        }
        // 设置超时时间
        config.timeout = useSettingStore().getTimeout
        return this.instance(config);
    }

    base(config: HttpStrategyConfig): Promise<any> {
        return this.instance(config);
    }

}