import axios from '@/plugins/axios'

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
    info(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/'
        });
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
    _nodes_stats(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_nodes/stats'
        })
    },
    _nodes(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_nodes'
        })
    },
    _nodes_plugins(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_nodes/plugins'
        })
    },
    _cluster_health(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_cluster/health'
        })
    },
    _template(): Promise<any> {
        return axios({
            method: 'GET',
            url: '/_template'
        })
    }
}