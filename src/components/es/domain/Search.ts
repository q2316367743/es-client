export interface Search {

    from?: number;

    size?: number;

    query?: Query

    /**
     * 其他字段
     */
    [name: string]: any;

}

export interface Query {

    bool?: Bool;

}

export interface Bool {

    must?: Array<Record<Condition, Record<string, string | number | boolean>>>

}

export type Condition = "term" | "match" | "wildcard" | "range"