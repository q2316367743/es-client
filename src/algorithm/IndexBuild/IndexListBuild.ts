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
        let shard = {} as any;
        let replica = {} as any;
        if (cluster_indices[key]) {
            let shards = cluster_indices[key].shards;
            for (let idx in shards) {
                // 数组
                let items = shards[idx];
                let replica_temp = [];
                let shard_temp = [];
                for (let item of items!) {
                    if (item.state === "STARTED") {
                        shard_temp.push(item);
                    } else if (item.state === "UNASSIGNED") {
                        replica_temp.push(item);
                    }
                }
                // NOTE: 分片和副本可能都是list
                shard[idx] = shard_temp;
                replica[idx] = replica_temp;
            }
        }
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
            shard,
            replica,
        });
    }
    return new Promise((resolve) => {
        resolve(indices);
    })
}
