import Index from "@/view/Index";
import { prettyDataUnit } from "@/utils/fieldUtil";
import clusterApi from "@/api/ClusterApi";
import IndexFieldBuild from "./IndexFieldBuild";

/**
 * 索引列表构造器
 * 
 * @param url 链接
 * @returns 索引数组
 */
export default async function Builder(): Promise<Array<Index>> {
    let indices = new Array<Index>();
    let cluster_stats = await clusterApi._cluster_state();
    let stats = await clusterApi._stats()
    let indecis = cluster_stats.metadata.indices as any;
    let stats_indecis = stats.indices as any;
    let cluster_indecis = cluster_stats.routing_table.indices as any;
    for (let key in indecis) {
        let index = stats_indecis[key];
        let size = 0;
        let docs = 0;
        if (index) {
            let total = index.total;
            size = total.store.size_in_bytes;
            docs = total.docs.count;
        }
        let state = indecis[key].state;
        let shards = cluster_indecis[key].shards;
        let shard = {} as any;
        let replica = {} as any;
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
        indices.push({
            name: key,
            alias: indecis[key].aliases,
            original_size: size,
            size: prettyDataUnit(size),
            doc_count: docs,
            state: state,
            shard,
            replica,
            fields: IndexFieldBuild(indecis[key].mappings)
        });
    }
    return new Promise((resolve, reject) => {
        resolve(indices);
    })
}