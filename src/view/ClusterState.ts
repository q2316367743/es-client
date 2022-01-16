/**
 * 集群状态
 */

export interface ClusterState {

    /**
     * 集群名称
     */
    cluster_name: string;
    compressed_size_in_bytes: number;
    cluster_uuid: string;
    version: number;
    state_uuid: string;
    master_node: string;
    blocks: object;
    nodes: Map<string, object>;
    metadata: ClusterStateMetadata;
    routing_table: ClusterStateRoutingTable;
    routing_nodes: object;
    snapshot_deletions: object;
    snapshots: object;
    restore: object;
}

export interface ClusterStateRoutingTable {
    indices: Map<string, ClusterStateRoutingTableIndex>;
}

export interface ClusterStateRoutingTableIndex {
    shards: Map<string, Array<ClusterStateRoutingTableIndexShard>>;
}

export interface ClusterStateRoutingTableIndexShard {
    allocation_id: object;
    id: string;
    index: string;
    node: string;
    primary: boolean;
    relocating_node: object;
    shard: number;
    state: string;
}

/**
 * 集群状态元数据
 */
export interface ClusterStateMetadata {
    cluster_uuid: string;
    templates: object;
    // 索引
    indices: Map<string, ClusterStateIndex>;
    index_lifecycle: object;
    "index-graveyard": object;
    ingest: object;

}

/**
 * 集群状态元数据索引
 */
export interface ClusterStateIndex {

    /**
     * 状态，打开或关闭
     */
    state: string;
    settings: ClusterStateIndexSettings;
    mappings: object;
    aliases: Array<string>;
    primary_terms: object;
    in_sync_allocations: object;

}

export interface ClusterStateIndexSettings {
    index: ClusterStateIndexIndex;
}

export interface ClusterStateIndexIndex {
    number_of_shards: string;
    blocks: object;
    provided_name: string;
    creation_date: string;
    analysis: object;
    number_of_replicas: string;
    uuid: string;
    version: object;
}