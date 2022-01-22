import { Index, Setting } from "@/entity/Index";

function getDefaultBody(setting: Setting) {
    return {
        "settings": {
            "number_of_shards": setting.number_of_shards,
            "number_of_replicas": setting.number_of_replicas
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
export default function IndexSaveBuild(index: Index): any {
    let body = getDefaultBody(index.settings);
    let properties = {} as any;
    for (let property of index.mapping) {
        let type = {
            'type': property.type
        }
        properties[property.field] = type;
    }
    body.mappings.properties = properties;
    return body;
}