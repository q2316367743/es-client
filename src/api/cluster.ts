import axios from '@/plugins/axios'

import { Info } from '@/view/Info'

/**
 * 与集群相关的API
 */
export default {
    /**
     * 集群基本信息
     * 
     * @param success 成功回调
     * @param error 失败回调
     */
    info(success: (data: Info) => void, error?: (e: Error) => void): void {
        axios({
            method: 'GET',
            url: '/'
        }).then((response: any) => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            }
        })
    },
    /**
     * _cluster_state
     * 
     */
    _cluster_state(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_cluster/state'
        })
    },
    /**
     * _stats
     * 
     */
    _stats(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_stats'
        })
    },
}