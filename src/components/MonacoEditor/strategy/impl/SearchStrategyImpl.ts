import Index from '@/view/Index';
import Strategy from "..//Strategy";
import { getType } from '../../util/TypeUtil';

// 搜索策略类
export default class SearchStrategyImpl implements Strategy {

    issue(index: Index): any {
        let fields = new Array<string>();
        index.fields.forEach(i => fields.push(i.name.substring(5)));
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
                                    "items": this.getQueryCondition(fields)
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
                        "anyOf": this.sortBuild(fields)
                    },
                }
            }
        }
    }

    /**
     * 排序构造器
     * @see https://www.elastic.co/guide/en/elasticsearch/reference/7.6/search-request-body.html#request-body-search-sort
     * 
     * @param fields 字段
     * @returns 排序数组
     */
    private sortBuild(fields: Array<string>): any[] {
        return [{
            "type": "object",
            "properties": this.getSort(fields)
        }, {
            "type": "string",
            "enum": fields
        }]
    }

    private getSort(fields: Array<string>): any {
        let properties = {} as any;
        fields.forEach(field => {
            properties[field] = {
                "type": "object",
                "properties": this.getBaseSort()
            }
        });
        return properties;
    }

    private getBaseSort(): any {
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

    private getQueryCondition(fields: Array<string>): any[] {
        return [{
            "type": "object",
            "properties": {
                "term": {
                    "type": "object",
                    "properties": this.ConditionBuild(fields, this.termBaseCondition)
                },
                "terms": {
                    "type": "object",
                    "properties": this.ConditionBuild(fields, this.termsBaseCondition)
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

    private ConditionBuild(fields: Array<string>, condition: () => any): any {
        let properties = {} as any;
        fields.forEach(field => {
            properties[field] = condition()
        })
        return properties;
    }

    private termBaseCondition(): any {
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

    private termsBaseCondition(): any {
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
}