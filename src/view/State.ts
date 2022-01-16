export interface State {

    _shards: object;

    _all: object;

    indices: Map<string, StateIndex>;

}

export interface StateIndex {

    uuid: string;
    primaries: object;
    total: StateIndexTotal;

}

export interface StateIndexTotal {
    docs: Docs;
    store: Store;
    indexing: Indexing;
    get: Get;
    search: Search;
    merges: Merges;
    refresh: Refresh;
    flush: Flush;
    warmer: Warmer;
    query_cache: Query_cache;
    fielddata: Fielddata;
    completion: Completion;
    segments: Segments;
    translog: Translog;
    request_cache: Request_cache;
    recovery: Recovery;
}

/*Docs*/
export interface Docs {
    count: number;
    deleted: number;
}

/*Store*/
export interface Store {
    size_in_bytes: number;
}

/*Indexing*/
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

/*Get*/
export interface Get {
    total: number;
    time_in_millis: number;
    exists_total: number;
    exists_time_in_millis: number;
    missing_total: number;
    missing_time_in_millis: number;
    current: number;
}

/*Search*/
export interface Search {
    open_contexts: number;
    query_total: number;
    query_time_in_millis: number;
    query_current: number;
    fetch_total: number;
    fetch_time_in_millis: number;
    fetch_current: number;
    scroll_total: number;
    scroll_time_in_millis: number;
    scroll_current: number;
    suggest_total: number;
    suggest_time_in_millis: number;
    suggest_current: number;
}

/*Merges*/
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

/*Refresh*/
export interface Refresh {
    total: number;
    total_time_in_millis: number;
    listeners: number;
}

/*Flush*/
export interface Flush {
    total: number;
    periodic: number;
    total_time_in_millis: number;
}

/*Warmer*/
export interface Warmer {
    current: number;
    total: number;
    total_time_in_millis: number;
}

/*Query_cache*/
export interface Query_cache {
    memory_size_in_bytes: number;
    total_count: number;
    hit_count: number;
    miss_count: number;
    cache_size: number;
    cache_count: number;
    evictions: number;
}

/*Fielddata*/
export interface Fielddata {
    memory_size_in_bytes: number;
    evictions: number;
}

/*Completion*/
export interface Completion {
    size_in_bytes: number;
}

/*File_sizes*/
export interface File_sizes {
}

/*Segments*/
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
    file_sizes: File_sizes;
}

/*Translog*/
export interface Translog {
    operations: number;
    size_in_bytes: number;
    uncommitted_operations: number;
    uncommitted_size_in_bytes: number;
    earliest_last_modified_age: number;
}

/*Request_cache*/
export interface Request_cache {
    memory_size_in_bytes: number;
    evictions: number;
    hit_count: number;
    miss_count: number;
}

/*Recovery*/
export interface Recovery {
    current_as_source: number;
    current_as_target: number;
    throttle_time_in_millis: number;
}