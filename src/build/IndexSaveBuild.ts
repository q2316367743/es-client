import {IndexInstance, Setting} from '@/entity/IndexInstance'

function getDefaultBody(setting: Setting) {
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
export default function IndexSaveBuild(index: IndexInstance): any {
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