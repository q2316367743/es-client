import IndexView from "@/view/index/IndexView";
import clusterApi from "@/components/es/ClusterApi";
import IndexFieldBuild from "./IndexFieldBuild";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import StrUtil from "@/utils/StrUtil";
import {ClusterInfo, ClusterNode} from "@/domain/index/ClusterInfo";
import NotificationUtil from "@/utils/NotificationUtil";

/**
 * 索引列表构造器
 *
 * @returns 索引数组
 */
export default async function Builder(): Promise<ClusterInfo> {
  let indices = new Array<IndexView>();

  const cluster_stats = await clusterApi._cluster_state();

  let metaIndices = cluster_stats.metadata.indices;
  let cluster_indices = cluster_stats.routing_table.indices;
  let errorIndexKeys = new Array<string>();
  for (let key in metaIndices) {
    try {
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
      let indexInfo = metaIndices[key];
      let state = metaIndices[key].state;
      indices.push({
        name: key,
        alias: indexInfo.aliases,
        settings: indexInfo.settings,
        mapping: indexInfo.mappings,
        fields: IndexFieldBuild(indexInfo.mappings),
        indexInfo,
        state: state,
        // 可能存在关闭的索引
        shards: cluster_indices[key] ? cluster_indices[key].shards : {},
      });
    } catch (e) {
      console.error(e);
      errorIndexKeys.push(key);
    }
  }
  if (errorIndexKeys.length > 0) {
    NotificationUtil.error(`加载索引时发生错误，共${errorIndexKeys.length}个索引加载失败：[${errorIndexKeys.join(",")}]`, "索引构造器");
  }
  const nodes: Record<string, ClusterNode> = {};
  for (let key of Object.keys(cluster_stats.nodes)) {
    const node = cluster_stats.nodes[key];
    nodes[key] = {
      name: node.name
    }
  }
  return Promise.resolve<ClusterInfo>({
    masterNode: cluster_stats.master_node,
    nodes,
    indices
  });
}
