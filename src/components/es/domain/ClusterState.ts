import {IndexInfo} from "@/components/es/domain/IndexInfo";

/**
 * 集群状态
 */
export interface ClusterState {
    cluster_name: string;
    cluster_uuid: string;
    version: number;
    state_uuid: string;
    master_node: string;
    blocks: any;
    nodes: Record<string, Node>;
    metadata: Metadata;
    routing_table: { indices: Record<string, { shards: Record<string, Array<Shard>> }> };
    routing_nodes: any;
}


export interface Node {
    name: string;
    ephemeral_id: string;
    transport_address: string;
    attributes: Record<string, string>;
}


export interface Metadata {
    cluster_uuid: string;
    cluster_coordination: ClusterCoordination;
    templates: Record<string, any>;
    indices: Record<string, IndexInfo>;
    ingest: Ingest;
    /**
     * 索引墓地
     */
    "index-graveyard": IndexGraveyard;
    index_lifecycle: IndexLifecycle;
}

export interface ClusterCoordination {
    term: number;
    last_committed_config: string[];
    last_accepted_config: string[];
    voting_config_exclusions: any[];
}

// ------------------------------------ 索引元数据 ------------------------------------


/**
 * 摄入
 */
export interface Ingest {
    pipeline: PipelineElement[];
}

export interface PipelineElement {
    id: string;
    config: PipelineConfig;
}

export interface PipelineConfig {
    description: string;
    version: number;
    processors: ProcessorElement[];
}

export interface ProcessorElement {
    script?: Script;
    gsub?: Gsub;
}

export interface Gsub {
    field: string;
    pattern: string;
    replacement: string;
}

export interface Script {
    source: string;
}


/**
 * 索引墓地
 */
export interface IndexGraveyard {
    /**
     * 墓碑
     */
    tombstones: Tombstone[];
}

/**
 * 墓碑
 */
export interface Tombstone {
    index: TombstoneIndex;
    /**
     * 删除时间 - 时间戳
     */
    delete_date_in_millis: number;
}

export interface TombstoneIndex {
    index_name: string;
    index_uuid: string;
}

/**
 * 索引生命周期
 */
export interface IndexLifecycle {
    policies: Record<string, Policy>;
    operation_mode: string;
}

export interface Policy {

    policy: { phases: PurplePhases };
    headers: any;
    version: number;
    modified_date: number;
    modified_date_string: Date;

}

export interface PurplePhases {
    hot?: Hot;
    delete: Delete;
}

export interface Delete {
    min_age: string;
    actions: DeleteActions;
}

export interface DeleteActions {
    delete: any;
}

export interface Hot {
    min_age: string;
    actions: HotActions;
}

export interface HotActions {
    rollover: Rollover;
}

export interface Rollover {
    max_size: string;
    max_age: string;
}

export interface Shard {
    state: string;
    primary: boolean;
    node: string;
    relocating_node: null;
    shard: number;
    index: string;
    /**
     * state === 'STARTED' 时有效
     */
    allocation_id?: AllocationID;
    /**
     * state === 'UNASSIGNED' 时有效
     */
    recovery_source?: RecoverySource;
    /**
     * state === 'UNASSIGNED' 时有效
     */
    unassigned_info?: UnassignedInfo;
}

export interface AllocationID {
    id: string;
}

export interface RecoverySource {
    type: string;
}

export interface UnassignedInfo {
    reason: string;
    at: Date;
    delayed: boolean;
    allocation_status: string;
}
