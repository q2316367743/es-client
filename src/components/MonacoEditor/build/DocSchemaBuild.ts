import Index from '@/view/Index';
import {getCoreStringType, getCoreNumberType} from '../util/TypeUtil';

/**
 * 构造_doc的schema
 * 
 * @param fields 字段
 */
export default function DocSchemaBuild(index: Index): any {
    let temp = propertiesBuild(index.mapping);
    return {
        "$id": "schema_search.json",
        "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
        "type": "object",
        "properties": temp
    }
}

function propertiesBuild(mappings: any): any {
    let target_properties = {} as any;
    let properties = {} as any;
    if (mappings._doc) {
        properties = mappings._doc.properties;
    } else if (mappings.doc) {
        properties = mappings.doc.properties;
    } else {
        return properties;
    }
    for (let key in properties) {
        propertyBuild(key, properties[key], target_properties);
    }
    return target_properties;
}

function propertyBuild(name: string, field: any, properties: any): void {
    if (field.properties) {
        // 复合类型
        for (let key in field.properties) {
            let property = {} as any;
            properties[name] = {
                "type": "object",
                "properties": property
            }
            baseTypeBuild(key, field.properties[key], property);
        }
    } else {
        baseTypeBuild(field.type, name, properties);
    }
}

function baseTypeBuild(type: string, name: string, properties: any): void {
    if (getCoreNumberType().findIndex((t) => t === type) > -1) {
        properties[name] = {
            "type": "number"
        }
    }else if (getCoreStringType().findIndex((t) => t === type)) {
        properties[name] = {
            "type": "string"
        }
    }
}

