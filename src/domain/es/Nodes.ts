export interface Nodes {
    _nodes: _Nodes;
    cluster_name: string;
    nodes: Record<string, Node>;
}

interface Node {
    name: string;
    transport_address: string;
    host: string;
    ip: string;
    version: string;
    build_flavor: string;
    build_type: string;
    build_hash: string;
    total_indexing_buffer: number;
    roles: string[];
    attributes: Record<string, string>;
    settings: Settings;
    os: Os;
    process: Process;
    jvm: Jvm;
    thread_pool: Threadpool;
    transport: Transport2;
    http: Http2;
    plugins: Plugin[];
    modules: Module[];
    ingest: Ingest;
}

interface Ingest {
    processors: Discovery[];
}

interface Module {
    name: string;
    version: string;
    elasticsearch_version: string;
    java_version: string;
    description: string;
    classname: string;
    extended_plugins: string[];
    has_native_controller: boolean;
}

interface Plugin {
    name: string;
    version: string;
    elasticsearch_version: string;
    java_version: string;
    description: string;
    classname: string;
    extended_plugins: any[];
    has_native_controller: boolean;
}

interface Http2 {
    bound_address: string[];
    publish_address: string;
    max_content_length_in_bytes: number;
}

interface Transport2 {
    bound_address: string[];
    publish_address: string;
    profiles: Profiles;
}

interface Profiles {
}

interface Threadpool {
    watcher: Watcher;
    force_merge: Watcher;
    'security-token-key': Watcher;
    ml_datafeed: Watcher;
    fetch_shard_started: Fetchshardstarted;
    listener: Watcher;
    ml_autodetect: Watcher;
    index: Watcher;
    refresh: Fetchshardstarted;
    generic: Fetchshardstarted;
    rollup_indexing: Watcher;
    warmer: Fetchshardstarted;
    search: Watcher;
    ccr: Watcher;
    flush: Fetchshardstarted;
    fetch_shard_store: Fetchshardstarted;
    management: Fetchshardstarted;
    ml_utility: Watcher;
    get: Watcher;
    analyze: Watcher;
    write: Watcher;
    snapshot: Fetchshardstarted;
    search_throttled: Watcher;
}

interface Fetchshardstarted {
    type: string;
    min: number;
    max: number;
    keep_alive: string;
    queue_size: number;
}

interface Watcher {
    type: string;
    min: number;
    max: number;
    queue_size: number;
}

interface Jvm {
    pid: number;
    version: string;
    vm_name: string;
    vm_version: string;
    vm_vendor: string;
    start_time_in_millis: number;
    mem: Mem;
    gc_collectors: string[];
    memory_pools: string[];
    using_compressed_ordinary_object_pointers: string;
    input_arguments: string[];
}

interface Mem {
    heap_init_in_bytes: number;
    heap_max_in_bytes: number;
    non_heap_init_in_bytes: number;
    non_heap_max_in_bytes: number;
    direct_max_in_bytes: number;
}

interface Process {
    refresh_interval_in_millis: number;
    id: number;
    mlockall: boolean;
}

interface Os {
    refresh_interval_in_millis: number;
    name: string;
    pretty_name: string;
    arch: string;
    version: string;
    available_processors: number;
    allocated_processors: number;
}

interface Settings {
    cluster: Cluster;
    node: Node;
    path: Path;
    discovery: Discovery;
    action: Action;
    client: Discovery;
    http: Http;
    transport: Transport;
    network: Network;
}

interface Network {
    host: string;
}

interface Transport {
    type: string;
    features: Features;
    'type.default': string;
}

interface Features {
    'x-pack': string;
}

interface Http {
    type: string;
    'type.default': string;
}

interface Action {
    auto_create_index: string;
}

interface Discovery {
    type: string;
}

interface Path {
    logs: string;
    home: string;
}

interface Node {
    attr: Attr;
    name: string;
}

interface Attr {
    xpack: Xpack;
    ml: Ml;
}

interface Ml {
    machine_memory: string;
    max_open_jobs: string;
    enabled: string;
}

interface Xpack {
    installed: string;
}

interface Cluster {
    name: string;
}


interface _Nodes {
    total: number;
    successful: number;
    failed: number;
}
