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
                "items": [{
                    "type": "object",
                    "properties": {
                        "create_time": {
                            "type": "object",
                            "properties": {
                                "order": {
                                    "type": "string",
                                    "enum": ["asc", "desc"]
                                }
                            }
                        },
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

function sortBuild(indices: Array<Index>, index: string): any {

}