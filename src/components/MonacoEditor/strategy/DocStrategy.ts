import Index from '@/view/Index';
import Strategy from "./Strategy";
import { getCoreStringType, getCoreNumberType } from '../util/TypeUtil';

// 文档策略类
export default class DocStrategy implements Strategy {

    issue(index: Index): any {
        return {
            "$id": "schema_search.json",
            "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
            "type": "object",
            "properties": this.propertiesBuild(index.mapping)
        }
    }

    private propertiesBuild(mappings: any): any {
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
            this.propertyBuild(key, properties[key], target_properties);
        }
        return target_properties;
    }

    private propertyBuild(name: string, field: any, properties: any): void {
        if (field.properties) {
            // 复合类型
            for (let key in field.properties) {
                let property = {} as any;
                properties[name] = {
                    "type": "object",
                    "properties": property
                }
                this.propertyBuild(key, field.properties[key], property);
            }
        } else {
            this.baseTypeBuild(field.type, name, properties);
        }
    }

    private baseTypeBuild(type: string, name: string, properties: any): void {
        if (getCoreNumberType().findIndex((t) => t === type) > -1) {
            properties[name] = {
                "type": "number"
            }
        } else if (getCoreStringType().findIndex((t) => t === type) > -1) {
            properties[name] = {
                "type": "string"
            }
        }
    }

}