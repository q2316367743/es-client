import VersionStrategy from "@/strategy/VersionStrategy/VersionStrategy";
import {IndexInstance} from "@/domain/IndexInstance";
import {IndexCreate} from "@/domain/es/IndexCreate";
import {Setting} from "@/domain/es/IndexBase";

/**
 * v6版本策略
 */
export default class V6VersionStrategyImpl implements VersionStrategy {
    getVersionExp(): RegExp {
        return /^6\.\d+\.\d+$/;
    }

    hasType(): boolean {
        return true;
    }

    private getDefaultBody(setting: Setting): any {
        return {
            settings: {
                number_of_shards: setting.number_of_shards,
                number_of_replicas: setting.number_of_replicas
            },
            mappings: {
                _doc: {
                    properties: {}
                }
            }
        }
    }

    indexCreateBuild(index: IndexInstance): IndexCreate {
        // TODO：此处需要处理
        return this.getDefaultBody(index.settings);
    }

}
