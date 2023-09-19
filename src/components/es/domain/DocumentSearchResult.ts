export interface DocumentSearchResult<T = any> {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits<T>;
}

export interface Hits<T> {
    total: number | {
        value: number
    };
    max_score: number;
    hits: Array<Hit<T>>;
}

export interface Hit<T> {
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
