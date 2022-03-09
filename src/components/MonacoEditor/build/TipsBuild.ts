import Index from '@/view/Index';

interface SChema {

    /**
     * The URI of the schema, which is also the identifier of the schema.
     */
    readonly uri: string;
    /**
     * A list of glob patterns that describe for which file URIs the JSON schema will be used.
     * '*' and '**' wildcards are supported. Exclusion patterns start with '!'.
     * For example '*.schema.json', 'package.json', '!foo*.schema.json', 'foo/**\/BADRESP.json'.
     * A match succeeds when there is at least one pattern matching and last matching pattern does not start with '!'.
     */
    readonly fileMatch?: string[];
    /**
     * The schema for the given URI.
     */
    readonly schema?: any;

}

export default function TipsBuild(indices: Array<Index>, link: string): SChema[] {
    return [
        {
            uri: 'https://esion.xyz/assert/es-client/schema.json',
            fileMatch: ['*'],
            schema: schemaBuild(indices, link)
        },
    ]
}

// schema指南: https://www.cnblogs.com/terencezhou/p/10474617.html

function schemaBuild(indices: Array<Index>, link: string): any {
    let index_name = parseLink(indices, link);
    return {
        "$id": "schema.json",
        "$schema": "https://esion.xyz/assert/es-client/schema.json",
        "type": "object",
        "properties": {
            "query": {
                "type": "object",
                "properties": {
                    "must": {
                        "type": "string"
                    },
                    "should": {
                        "type": "string"
                    },
                    "must_not": {
                        "type": "string"
                    }
                }
            },
            "from": {
                "type": "number"
            },
            "size": {
                "type": "number"
            },
            "sort": {
                "type": "array",
                "items": sortBuild(indices, index_name),
            }
        }
    }
}

/**
 * 解析链接中的索引名称
 * 
 * @param indices 全部的索引
 * @param link 当前链接
 */
function parseLink(indices: Array<Index>, link: string): string {
    for (let index of indices) {
        if (link.indexOf(index.name) > -1) {
            return index.name;
        }
    }
    return "";
}

// https://www.elastic.co/guide/en/elasticsearch/reference/7.6/search-request-body.html#request-body-search-sort

function sortBuild(indices: Array<Index>, index: string): any[] {
    return [{
        "type": "object",
        "properties": {
            "create_time": {
                "type": "object",
                "properties": {
                    "order": {
                        "type": "string",
                        "enum": ["asc", "desc"]
                    },
                    "mode": {
                        "type": "string",
                        "enum": ["min", "max", "sum", "avg", "median"]
                    },
                    "nested_path": {
                        "type": "string"
                    },
                    "missing": {
                        "type": "string",
                        "default": "_last",
                        "examples": ["_last", "_first"]
                    },
                    "unmapped_type": {
                        "type": "string",
                        "enum": getType()
                    }
                }
            }
        }
    }, {
        "type": "object",
        "properties": {
            "update_time": {
                "type": "object",
                "properties": {
                    "order": {
                        "type": "string",
                        "enum": ["asc", "desc"]
                    }
                }
            }
        }
    }]
}

function getType(): Array<string> {
    return [...getCoreType(), ...getCompoundType(), ...getMapType(), ...getSpecialType()];
}

function getCoreType(): Array<string> {
    return ["string", "text", "keyword", "integer", "long", "short", "byte", 
    "double", "float", "half_float", "scaled_float", "boolean", "date", "range", "binary"];
}

function getCompoundType(): Array<string> {
    return ["array", "object", "nested"];
}

function getMapType(): Array<string> {
    return ["geo_point", "geo_shape"];
}

function getSpecialType(): Array<string> {
    return ["ip", "completion", "token_count", "attachment", "percolator"]
}