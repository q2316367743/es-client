import IndexView from "@/view/index/IndexView";
import {prettyDataUnit} from "@/utils/BrowserUtil";
import clusterApi from "@/components/es/api/ClusterApi";
import IndexFieldBuild from "./IndexFieldBuild";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import StrUtil from "@/utils/StrUtil";
import Optional from "@/utils/Optional";

/**
 * 索引列表构造器
 *
 * @returns 索引数组
 */
export default async function Builder(): Promise<Array<IndexView>> {
    let indices = new Array<IndexView>();

    const [cluster_stats, stats] = await Promise.all([clusterApi._cluster_state(), clusterApi._stats()])

    let metaIndices = cluster_stats.metadata.indices;
    let statsIndices = stats.indices;
    let cluster_indices = cluster_stats.routing_table.indices;
    for (let key in metaIndices) {
        if (useGlobalSettingStore().getHomeExcludeIndices.length > 0) {
            if (StrUtil.matchAll(key, useGlobalSettingStore().getHomeExcludeIndices)) {
                continue;
            }
        }
        if (useGlobalSettingStore().getHomeIncludeIndices.length > 0) {
            if (!StrUtil.matchAll(key, useGlobalSettingStore().getHomeIncludeIndices)) {
                continue;
            }
        }
        let indexStats = statsIndices[key];
        let indexInfo = metaIndices[key];
        let size = 0;
        let docs = 0;
        if (indexStats) {
            let total = indexStats.total;
            size = total.store.size_in_bytes;
            docs = total.docs.count;
        }
        let state = metaIndices[key].state;
        indices.push({
            name: key,
            alias: Optional.ofNullable(indexInfo.aliases).orElse(new Array<string>()),
            original_size: size,
            settings: indexInfo.settings,
            mapping: indexInfo.mappings,
            fields: IndexFieldBuild(indexInfo.mappings),
            indexStats,
            indexInfo,
            size: prettyDataUnit(size),
            doc_count: prettyDataUnit(docs),
            original_doc_count: docs,
            state: state,
            shards: cluster_indices[key].shards,
        });
    }
    return new Promise((resolve) => {
        resolve(indices);
    })
}
