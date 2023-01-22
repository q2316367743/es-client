
export interface NodeState {

    _nodes: Nodes;

    cluster_name: string;

    nodes: Record<string, Node>;

}

export interface Nodes {
    total:      number;
    successful: number;
    failed:     number;
}
export interface Node {
    timestamp: number;
    name: string;
    transport_address: string;
    host: string;
    ip: string;
    roles: string[];
    attributes: Attributes;
    indices: Indices;
    os: OS;
    process: Process;
    jvm: JVM;
    thread_pool: { [key: string]: ThreadPool };
    fs: FS;
    transport: Transport;
    http: HTTP;
    breakers: Breakers;
    script: Script;
    discovery: Discovery;
    ingest: Ingest;
    adaptive_selection: Record<string, AdaptiveSelection>;
}


export interface AdaptiveSelection {
    outgoing_searches: number;
    avg_queue_size: number;
    avg_service_time_ns: number;
    avg_response_time_ns: number;
    rank: string;
}

export interface Attributes {
    "ml.machine_memory": string;
    "xpack.installed": string;
    "ml.max_open_jobs": string;
}

export interface Breakers {
    request: Accounting;
    fielddata: Accounting;
    in_flight_requests: Accounting;
    accounting: Accounting;
    parent: Accounting;
}

export interface Accounting {
    limit_size_in_bytes: number;
    limit_size: string;
    estimated_size_in_bytes: number;
    estimated_size: string;
    overhead: number;
    tripped: number;
}

export interface Discovery {
    cluster_state_queue: ClusterStateQueue;
    published_cluster_states: PublishedClusterStates;
}

export interface ClusterStateQueue {
    total: number;
    pending: number;
    committed: number;
}

export interface PublishedClusterStates {
    full_states: number;
    incompatible_diffs: number;
    compatible_diffs: number;
}

export interface FS {
    timestamp: number;
    total: FSTotal;
    least_usage_estimate: StUsageEstimate;
    most_usage_estimate: StUsageEstimate;
    data: Datum[];
}

export interface Datum {
    path: string;
    mount: string;
    type: string;
    total_in_bytes: number;
    free_in_bytes: number;
    available_in_bytes: number;
}

export interface StUsageEstimate {
    path: string;
    total_in_bytes: number;
    available_in_bytes: number;
    used_disk_percent: number;
}

export interface FSTotal {
    total_in_bytes: number;
    free_in_bytes: number;
    available_in_bytes: number;
}

export interface HTTP {
    current_open: number;
    total_opened: number;
}

export interface Indices {
    docs: Docs;
    store: Completion;
    indexing: Indexing;
    get: Get;
    search: { [key: string]: number };
    merges: Merges;
    refresh: Refresh;
    flush: Flush;
    warmer: Warmer;
    query_cache: QueryCache;
    fielddata: Fielddata;
    completion: Completion;
    segments: Segments;
    translog: Translog;
    request_cache: RequestCache;
    recovery: Recovery;
}

export interface Completion {
    size_in_bytes: number;
}

export interface Docs {
    count: number;
    deleted: number;
}

export interface Fielddata {
    memory_size_in_bytes: number;
    evictions: number;
}

export interface Flush {
    total: number;
    periodic: number;
    total_time_in_millis: number;
}

export interface Get {
    total: number;
    time_in_millis: number;
    exists_total: number;
    exists_time_in_millis: number;
    missing_total: number;
    missing_time_in_millis: number;
    current: number;
}

export interface Indexing {
    index_total: number;
    index_time_in_millis: number;
    index_current: number;
    index_failed: number;
    delete_total: number;
    delete_time_in_millis: number;
    delete_current: number;
    noop_update_total: number;
    is_throttled: boolean;
    throttle_time_in_millis: number;
}

export interface Merges {
    current: number;
    current_docs: number;
    current_size_in_bytes: number;
    total: number;
    total_time_in_millis: number;
    total_docs: number;
    total_size_in_bytes: number;
    total_stopped_time_in_millis: number;
    total_throttled_time_in_millis: number;
    total_auto_throttle_in_bytes: number;
}

export interface QueryCache {
    memory_size_in_bytes: number;
    total_count: number;
    hit_count: number;
    miss_count: number;
    cache_size: number;
    cache_count: number;
    evictions: number;
}

export interface Recovery {
    current_as_source: number;
    current_as_target: number;
    throttle_time_in_millis: number;
}

export interface Refresh {
    total: number;
    total_time_in_millis: number;
    external_total: number;
    external_total_time_in_millis: number;
    listeners: number;
}

export interface RequestCache {
    memory_size_in_bytes: number;
    evictions: number;
    hit_count: number;
    miss_count: number;
}

export interface Segments {
    count: number;
    memory_in_bytes: number;
    terms_memory_in_bytes: number;
    stored_fields_memory_in_bytes: number;
    term_vectors_memory_in_bytes: number;
    norms_memory_in_bytes: number;
    points_memory_in_bytes: number;
    doc_values_memory_in_bytes: number;
    index_writer_memory_in_bytes: number;
    version_map_memory_in_bytes: number;
    fixed_bit_set_memory_in_bytes: number;
    max_unsafe_auto_id_timestamp: number;
    file_sizes: FileSizes;
}

export interface FileSizes {
}

export interface Translog {
    operations: number;
    size_in_bytes: number;
    uncommitted_operations: number;
    uncommitted_size_in_bytes: number;
    earliest_last_modified_age: number;
}

export interface Warmer {
    current: number;
    total: number;
    total_time_in_millis: number;
}

export interface Ingest {
    total: XpackMonitoring6_Class;
    pipelines: Pipelines;
}

export interface Pipelines {
    xpack_monitoring_6: XpackMonitoring6_Class;
    xpack_monitoring_7: XpackMonitoring6_Class;
}

export interface Gsub {
    type: string;
    stats: XpackMonitoring6_Class;
}

export interface Processor {
    script?: Gsub;
    gsub?: Gsub;
}

export interface XpackMonitoring6_Class {
    count: number;
    time_in_millis: number;
    current: number;
    failed: number;
    processors?: Processor[];
}

export interface JVM {
    timestamp: number;
    uptime_in_millis: number;
    mem: JVMMem;
    threads: Threads;
    gc: Gc;
    buffer_pools: BufferPools;
    classes: Classes;
}

export interface BufferPools {
    mapped: Direct;
    direct: Direct;
}

export interface Direct {
    count: number;
    used_in_bytes: number;
    total_capacity_in_bytes: number;
}

export interface Classes {
    current_loaded_count: number;
    total_loaded_count: number;
    total_unloaded_count: number;
}

export interface Gc {
    collectors: Collectors;
}

export interface Collectors {
    young: CollectorsOld;
    old: CollectorsOld;
}

export interface CollectorsOld {
    collection_count: number;
    collection_time_in_millis: number;
}

export interface JVMMem {
    heap_used_in_bytes: number;
    heap_used_percent: number;
    heap_committed_in_bytes: number;
    heap_max_in_bytes: number;
    non_heap_used_in_bytes: number;
    non_heap_committed_in_bytes: number;
    pools: Pools;
}

export interface Pools {
    young: SurvivorClass;
    survivor: SurvivorClass;
    old: SurvivorClass;
}

export interface SurvivorClass {
    used_in_bytes: number;
    max_in_bytes: number;
    peak_used_in_bytes: number;
    peak_max_in_bytes: number;
}

export interface Threads {
    count: number;
    peak_count: number;
}

export interface OS {
    timestamp: number;
    cpu: OSCPU;
    mem: OSMem;
    swap: Swap;
}

export interface OSCPU {
    percent: number;
}

export interface OSMem {
    total_in_bytes: number;
    free_in_bytes: number;
    used_in_bytes: number;
    free_percent: number;
    used_percent: number;
}

export interface Swap {
    total_in_bytes: number;
    free_in_bytes: number;
    used_in_bytes: number;
}

export interface Process {
    timestamp: number;
    open_file_descriptors: number;
    max_file_descriptors: number;
    cpu: ProcessCPU;
    mem: ProcessMem;
}

export interface ProcessCPU {
    percent: number;
    total_in_millis: number;
}

export interface ProcessMem {
    total_virtual_in_bytes: number;
}

export interface Script {
    compilations: number;
    cache_evictions: number;
    compilation_limit_triggered: number;
}

export interface ThreadPool {
    threads: number;
    queue: number;
    active: number;
    rejected: number;
    largest: number;
    completed: number;
}

export interface Transport {
    server_open: number;
    rx_count: number;
}