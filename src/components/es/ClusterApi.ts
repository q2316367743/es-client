import {NodeState} from "@/domain/es/NodeState";
import {Stats} from "@/domain/es/Stats";
import {ClusterState} from "@/domain/es/ClusterState";
import {Nodes} from "@/domain/es/Nodes";
import {useEsRequestJson} from "@/plugins/native/axios";
import {ClusterHealth} from "@/domain/es/ClusterHealth";
import {Overview} from "@/domain/es/Overview";

/**
 * 与集群相关的API
 */
export default {
  /**
   * 集群基本信息
   */
  info(): Promise<Overview> {
    return useEsRequestJson<Overview>({
      method: 'GET',
      url: '/'
    });
  },
  /**
   * _cluster_state
   */
  _cluster_state(): Promise<ClusterState> {
    return useEsRequestJson<ClusterState>({
      method: 'GET',
      url: '/_cluster/state'
    })
  },
  /**
   * _stats
   */
  _stats(): Promise<Stats> {
    return useEsRequestJson<Stats>({
      method: 'GET',
      url: '/_stats'
    })
  },
  _nodes_stats(): Promise<NodeState> {
    return useEsRequestJson<NodeState>({
      method: 'GET',
      url: '/_nodes/stats'
    })
  },
  _nodes(): Promise<Nodes> {
    return useEsRequestJson<Nodes>({
      method: 'GET',
      url: '/_nodes'
    })
  },
  _nodes_plugins(): Promise<any> {
    return useEsRequestJson<any>({
      method: 'GET',
      url: '/_nodes/plugins'
    })
  },
  _cluster_health(): Promise<ClusterHealth> {
    return useEsRequestJson<any>({
      method: 'GET',
      url: '/_cluster/health'
    })
  },
  _template(): Promise<any> {
    return useEsRequestJson<any>({
      method: 'GET',
      url: '/_template'
    })
  }
}
