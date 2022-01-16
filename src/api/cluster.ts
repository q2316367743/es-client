import axios from '@/plugins/axios'

import { Info } from '@/view/Info'
import { ClusterState } from '@/view/ClusterState';
import { State } from '@/view/State';

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
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            }
        })
    },
    /**
     * _cluster_state
     * 
     * @param success 成功回调
     * @param error 失败回调
     */
    _cluster_state(success: (data: any) => void, error?: (e: Error) => void): void {
        axios({
            method: 'GET',
            url: '/_cluster/state'
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            }
        })
    },
    /**
     * _stats
     * 
     * @param success 成功回调
     * @param error 失败回调
     */
    _stats(success: (data: any) => void, error?: (e: Error) => void): void {
        axios({
            method: 'GET',
            url: '/_stats'
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            }
        })
    },
}