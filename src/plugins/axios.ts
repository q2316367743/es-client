import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUrlStore } from '@/store/UrlStore'

// 创建一个axios实例
const service = axios.create({
    timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (!config.url) {
            // URL必须存在，
            throw new Error('URL必须存在');

        }
        // 基础链接每次动态取值
        config.baseURL = useUrlStore().current;
        if (config.baseURL === '') {
            throw new Error('请选择链接')
        }
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
        return response;
    },
    error => {
        console.error('err', error) // for debug
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service