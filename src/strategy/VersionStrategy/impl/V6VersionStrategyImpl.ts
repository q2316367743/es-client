import VersionStrategy from "@/strategy/VersionStrategy/VersionStrategy";
import {IndexInstance, Setting} from "@/domain/IndexInstance";
import {IndexCreate} from "@/es/IndexCreate";

/**
 * v6版本策略
 */
export default class V6VersionStrategyImpl implements VersionStrategy {
    getVersion(): string {
        return "6.*.*";
    }

    private getDefaultBody(setting: Setting): any {
        return {
            settings: {
                number_of_shards: setting.numberOfShards,
                number_of_replicas: setting.numberOfReplicas
            },
            mappings: {
                _doc: {
                    properties: {}
                }
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
        body.mappings._doc.properties = properties;
        return body;
    }

}