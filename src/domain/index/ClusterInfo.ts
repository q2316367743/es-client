import IndexView from "@/view/index/IndexView";

export interface ClusterInfo {
    masterNode: string;
    /**
     * 节点
     * 节点ID => 节点
     */
    nodes: Record<string, ClusterNode>;
    indices: Array<IndexView>
}

export interface ClusterNode {
    name: string
}
