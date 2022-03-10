import Index from '@/view/Index';
import { getType } from '../util/TypeUtil';

/**
 * 构造_search的schema
 * 
 * @param fields 字段
 */
export default function SearchSchemaBuild(fields: Array<string>): any {
    return {
        "$id": "schema_search.json",
        "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
        "type": "object",
        "properties": {
            "query": {
                "type": "object",
                "properties": {
                    "type": "object",
                    "bool": {
                        "type": "object",
                        "properties": {
                            "must": {
                                "type": "array",
                                "items": getQueryCondition(fields)
                            },
                            "should": {
                                "type": "string"
                            },
                            "must_not": {
                                "type": "string"
                            },
                            "filter": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "from": {
                "type": "number",
                "default": 0,
            },
            "size": {
                "type": "number",
                "default": 10,
            },
            "sort": {
                "type": "array",
                "items": {
                    "anyOf": sortBuild(fields)
                },
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
function parseLink(indices: Array<Index>, link: string): Index | undefined {
    if (link === '') {
        return;
    }
    for (let index of indices) {
        if (link.indexOf(index.name) > -1) {
            return index;
        }
        for (let alias of index.alias) {
            if (link.indexOf(alias)) {
                return index;
            }
        }
    }
}

/* ============================= 排序构造器 ============================= */

// https://www.elastic.co/guide/en/elasticsearch/reference/7.6/search-request-body.html#request-body-search-sort

function sortBuild(fields: Array<string>): any[] {
    return [{
        "type": "object",
        "properties": getSort(fields)
    }, {
        "type": "string",
        "enum": fields
    }]
}

function getSort(fields: Array<string>): any {
    let properties = {} as any;
    fields.forEach(field => {
        properties[field] = {
            "type": "object",
            "properties": getBaseSort()
        }
    });
    return properties;
}

function getBaseSort(): any {
    return {
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


/* ============================= 条件生成器 ============================= */

function getQueryCondition(fields: Array<string>): any[] {
    return [{
        "type": "object",
        "properties": {
            "term": {
                "type": "object",
                "properties": ConditionBuild(fields, termBaseCondition)
            },
            "terms": {
                "type": "object",
                "properties": ConditionBuild(fields, termsBaseCondition)
            },
            "match": {
                "type": "string"
            },
            "wildcard": {
                "type": "string"
            },
            "prefix": {
                "type": "string"
            },
            "range": {
                "type": "string"
            },
            "fuzzy": {
                "type": "string"
            },
            "query_string": {
                "type": "string"
            },
            "missing": {
                "type": "string"
            }
        }
    }]
}

function ConditionBuild(fields: Array<string>, condition: () => any): any {
    let properties = {} as any;
    fields.forEach(field => {
        properties[field] = condition()
    })
    return properties;
}

function termBaseCondition(): any {
    return {
        "anyOf": [{
            "type": "string"
        }, {
            "type": "number"
        }, {
            "type": "object",
            "properties": {
                "value": {
                    "type": "string"
                },
                "boot": {
                    "type": "number"
                }
            }
        }]
    };
}

function termsBaseCondition(): any {
    return {
        "anyOf": [{
            "type": "array"
        }, {
            "type": "object",
            "properties": {
                "value": {
                    "type": "array"
                },
                "boot": {
                    "type": "number"
                }
            }
        }]
    };
}