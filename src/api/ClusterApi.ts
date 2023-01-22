import {httpStrategyContext} from "@/global/BeanFactory";
import {NodeState} from "@/es/NodeState";
import {Stats} from "@/es/Stats";
import {ClusterState} from "@/es/ClusterState";
import {Info} from "@/es/Info";

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
    info(): Promise<Info> {
        return httpStrategyContext.getStrategy().es<any>({
            method: 'GET',
            url: '/'
        });
    },
    /**
     * _cluster_state
     * 
     */
    _cluster_state(): Promise<ClusterState> {
        return httpStrategyContext.getStrategy().es<ClusterState>({
            method: 'GET',
            url: '/_cluster/state'
        })
    },
    /**
     * _stats
     * 
     */
    _stats(): Promise<Stats> {
        return httpStrategyContext.getStrategy().es<Stats>({
            method: 'GET',
            url: '/_stats'
        })
    },
    _nodes_stats(): Promise<NodeState> {
        return httpStrategyContext.getStrategy().es<any>({
            method: 'GET',
            url: '/_nodes/stats'
        })
    },
    _nodes(): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            method: 'GET',
            url: '/_nodes'
        })
    },
    _nodes_plugins(): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            method: 'GET',
            url: '/_nodes/plugins'
        })
    },
    _cluster_health(): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            method: 'GET',
            url: '/_cluster/health'
        })
    },
    _template(): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            method: 'GET',
            url: '/_template'
        })
    }
}