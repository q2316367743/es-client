import Index from '@/view/Index';
import Strategy from "../Strategy";

// 文档策略类
export default class DocStrategyImpl implements Strategy {

    issue(index: Index): any {
        return {
            "$id": "schema_search.json",
            "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
            "type": "object",
            "properties": {
                "settings": {
                    "type": "object",
                    "properties": {
                        "number_of_replicas": {
                            "type": "number"
                        }, 
                        "number_of_shards": {
                            "type": "number"
                        }
                    }
                },
                "mapping": {
                    "type": "object"
                }
            }
        }
    }
}