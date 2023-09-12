import VersionStrategy from "@/strategy/VersionStrategy/VersionStrategy";
import {IndexInstance, Setting} from "@/domain/IndexInstance";
import {IndexCreate} from "@/components/es/domain/IndexCreate";

/**
 * v6版本策略
 */
export default class V8VersionStrategyImpl implements VersionStrategy {
    getVersionExp(): RegExp {
        return /^8\.\d+\.\d+$/;
    }

    hasType(): boolean {
        return false;
    }

    private getDefaultBody(setting: Setting): any {
        return {
            settings: {
                number_of_shards: setting.numberOfShards,
                number_of_replicas: setting.numberOfReplicas
            },
            mappings: {
                properties: {}
            }
        }
    }

    indexCreateBuild(index: IndexInstance): IndexCreate {
        let body = this.getDefaultBody(index.settings);
        let properties = {} as any;
        for (let property of index.mapping) {
            properties[property.field] = {
                'type': property.type
            };
        }
        body.mappings.properties = properties;
        return body;
    }

}
