export interface DocumentSearchResult<T> {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits<T>;
}

interface Hits<T> {
    total: number;
    max_score: number;
    hits: Hit<T>[];
}

interface Hit<T> {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: T;
}


interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
