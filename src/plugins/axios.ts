import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUrlStore from '@/store/UrlStore'
import useSettingStore from '@/store/SettingStore'
import i18n from '@/i18n'

// 创建一个axios实例
const service = axios.create()

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 基础链接每次动态取值
        config.baseURL = useUrlStore().current;
        console.log('发送请求', config.baseURL)
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
        return config
    },
    error => {
        ElMessage.error(error);
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
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

export default service