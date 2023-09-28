import {Setting} from "@/components/es/domain/IndexBase";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";

/**
 * 索引实体类
 */
export interface IndexInstance {

    /**
     * 索引名称
     */
    name: string;

    /**
     * 设置
     */
    settings: Setting;

    /**
     * 映射
     */
    mappings: string;
}
export function getDefaultIndexInstance(): IndexInstance {
    return {
        name: '',
        settings: {
            number_of_shards: useGlobalSettingStore().getDefaultShard,
            number_of_replicas: useGlobalSettingStore().getDefaultReplica
        },
        mappings: "{}"
    }
}
