import {NodeState} from "@/components/es/domain/NodeState";
import {Stats} from "@/components/es/domain/Stats";
import {ClusterState} from "@/components/es/domain/ClusterState";
import {Nodes} from "@/components/es/domain/Nodes";
import {fetchEs} from "@/plugins/native/axios";
import {ClusterHealth} from "@/components/es/domain/ClusterHealth";
import {Overview} from "@/components/es/domain/Overview";

/**
 * 与集群相关的API
 */
export default {
    /**
     * 集群基本信息
     */
    info(): Promise<Overview> {
        return fetchEs<Overview>({
            method: 'GET',
            url: '/'
        });
    },
    /**
     * _cluster_state
     */
    _cluster_state(): Promise<ClusterState> {
        return fetchEs<ClusterState>({
            method: 'GET',
            url: '/_cluster/state'
        })
    },
    /**
     * _stats
     */
    _stats(): Promise<Stats> {
        return fetchEs<Stats>({
            method: 'GET',
            url: '/_stats'
        })
    },
    _nodes_stats(): Promise<NodeState> {
        return fetchEs<NodeState>({
            method: 'GET',
            url: '/_nodes/stats'
        })
    },
    _nodes(): Promise<Nodes> {
        return fetchEs<Nodes>({
            method: 'GET',
            url: '/_nodes'
        })
    },
    _nodes_plugins(): Promise<any> {
        return fetchEs<any>({
            method: 'GET',
            url: '/_nodes/plugins'
        })
    },
    _cluster_health(): Promise<ClusterHealth> {
        return fetchEs<any>({
            method: 'GET',
            url: '/_cluster/health'
        })
    },
    _template(): Promise<any> {
        return fetchEs<any>({
            method: 'GET',
            url: '/_template'
        })
    }
}
