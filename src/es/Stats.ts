export interface Stats {
    _shards: Shards;
    _all:    All;
    indices: Record<string, Index>;
}

export interface All {
    primaries: Primaries;
    total:     Primaries;
}

export interface Primaries {
    docs:          Docs;
    store:         Completion;
    indexing:      Indexing;
    get:           Get;
    search:        { [key: string]: number };
    merges:        Merges;
    refresh:       Refresh;
    flush:         Flush;
    warmer:        Warmer;
    query_cache:   QueryCache;
    fielddata:     Fielddata;
    completion:    Completion;
    segments:      Segments;
    translog:      Translog;
    request_cache: RequestCache;
    recovery:      Recovery;
}

export interface Completion {
    size_in_bytes: number;
}

export interface Docs {
    count:   number;
    deleted: number;
}

export interface Fielddata {
    memory_size_in_bytes: number;
    evictions:            number;
}

export interface Flush {
    total:                number;
    periodic:             number;
    total_time_in_millis: number;
}

export interface Get {
    total:                  number;
    time_in_millis:         number;
    exists_total:           number;
    exists_time_in_millis:  number;
    missing_total:          number;
    missing_time_in_millis: number;
    current:                number;
}

export interface Indexing {
    index_total:             number;
    index_time_in_millis:    number;
    index_current:           number;
    index_failed:            number;
    delete_total:            number;
    delete_time_in_millis:   number;
    delete_current:          number;
    noop_update_total:       number;
    is_throttled:            boolean;
    throttle_time_in_millis: number;
}

export interface Merges {
    current:                        number;
    current_docs:                   number;
    current_size_in_bytes:          number;
    total:                          number;
    total_time_in_millis:           number;
    total_docs:                     number;
    total_size_in_bytes:            number;
    total_stopped_time_in_millis:   number;
    total_throttled_time_in_millis: number;
    total_auto_throttle_in_bytes:   number;
}

export interface QueryCache {
    memory_size_in_bytes: number;
    total_count:          number;
    hit_count:            number;
    miss_count:           number;
    cache_size:           number;
    cache_count:          number;
    evictions:            number;
}

export interface Recovery {
    current_as_source:       number;
    current_as_target:       number;
    throttle_time_in_millis: number;
}

export interface Refresh {
    total:                         number;
    total_time_in_millis:          number;
    external_total:                number;
    external_total_time_in_millis: number;
    listeners:                     number;
}

export interface RequestCache {
    memory_size_in_bytes: number;
    evictions:            number;
    hit_count:            number;
    miss_count:           number;
}

export interface Segments {
    count:                         number;
    memory_in_bytes:               number;
    terms_memory_in_bytes:         number;
    stored_fields_memory_in_bytes: number;
    term_vectors_memory_in_bytes:  number;
    norms_memory_in_bytes:         number;
    points_memory_in_bytes:        number;
    doc_values_memory_in_bytes:    number;
    index_writer_memory_in_bytes:  number;
    version_map_memory_in_bytes:   number;
    fixed_bit_set_memory_in_bytes: number;
    max_unsafe_auto_id_timestamp:  number;
    file_sizes:                    FileSizes;
}

export interface FileSizes {
}

export interface Translog {
    operations:                 number;
    size_in_bytes:              number;
    uncommitted_operations:     number;
    uncommitted_size_in_bytes:  number;
    earliest_last_modified_age: number;
}

export interface Warmer {
    current:              number;
    total:                number;
    total_time_in_millis: number;
}

export interface Shards {
    total:      number;
    successful: number;
    failed:     number;
}

export interface Index {
    uuid:      string;
    primaries: Primaries;
    total:     Primaries;
}
