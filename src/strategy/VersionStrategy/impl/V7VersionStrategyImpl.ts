import VersionStrategy from "@/strategy/VersionStrategy/VersionStrategy";
import {IndexInstance} from "@/domain/IndexInstance";
import {IndexCreate} from "@/domain/es/IndexCreate";
import {Setting} from "@/domain/es/IndexBase";

/**
 * v6版本策略
 */
export default class V7VersionStrategyImpl implements VersionStrategy {
    getVersionExp(): RegExp {
        return /^7\.\d+\.\d+$/;
    }

    hasType(): boolean {
        return false;
    }

    private getDefaultBody(setting: Setting): any {
        return {
            settings: {
                number_of_shards: setting.number_of_shards,
                number_of_replicas: setting.number_of_replicas
            },
            mappings: {
                properties: {}
            }
        }
    }

    indexCreateBuild(index: IndexInstance): IndexCreate {
        return this.getDefaultBody(index.settings);
    }

}
