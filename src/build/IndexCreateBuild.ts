import {IndexInstance, Setting} from '@/domain/IndexInstance'
import {IndexCreate} from "@/es/IndexCreate";

function getDefaultBody(setting: Setting): IndexCreate {
    return {
        "settings": {
            "number_of_shards": setting.numberOfShards,
            "number_of_replicas": setting.numberOfReplicas
        },
        "mappings": {
            "properties": {
            }
        }
    }
}

/**
 * 新增索引信息
 * 
 * @param index 索引信息
 */
export default function IndexCreateBuild(index: IndexInstance): IndexCreate {
    let body = getDefaultBody(index.settings);
    let properties = {} as any;
    for (let property of index.mapping) {
        properties[property.field] = {
            'type': property.type
        };
    }
    body.mappings.properties = properties;
    return body;
}