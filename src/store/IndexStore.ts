import {defineStore} from "pinia";
import {useGlobalSettingStore, useUrlStore} from "@/store";
import NotificationUtil from "@/utils/model/NotificationUtil";
import {ClusterNode, Field, IndexItem} from "$/elasticsearch-client";
import {LoadingPlugin} from "tdesign-vue-next";
import MessageUtil from "@/utils/model/MessageUtil";
import {SelectOption} from "$/shared/common";
import {IndexMapping} from "$/shared/elasticsearch";

export interface IndexOption extends SelectOption {
  // 标签
  tag: "index" | "alias" | "custom";
}

function renderMap(indices: Array<IndexItem>): Map<string, IndexItem> {
  const indicesMap = new Map<string, IndexItem>();
  for (const index of indices) {
    const names = [index.name, ...index.alias];
    for (const name of names) {
      indicesMap.set(name, index);
    }
  }
  return indicesMap;
}

const buildItem = (
  items: Set<IndexOption>,
  names: Set<string>,
  alias: Array<string>,
  name: string
) => {
  names.add(name);
  items.add({
    label: name,
    value: name,
    tag: "index"
  });
  if (alias) {
    for (const al of alias) {
      const aliasName = al;
      // 别名可能重复
      const aliasValue = al;
      if (!names.has(aliasValue)) {
        names.add(aliasValue);
        items.add({
          label: aliasName,
          value: aliasValue,
          tag: "alias"
        });
      }
    }
  }
};

export const useIndexStore = defineStore("index", () => {
  const masterNode = ref<string>("");
  const nodes = ref<Record<string, ClusterNode>>({});
  const indices = ref<Array<IndexItem>>([]);
  const indicesMap = ref<Map<string, IndexItem>>(new Map());
  const name = ref<string>("");
  const active_shards = ref<number>(0);
  const total_shards = ref<number>(0);
  const status = ref<string>("");

  const list = computed(() => {
    let idx = indices.value;

    const {getHomeExcludeIndices, getHomeIncludeIndices} = useGlobalSettingStore();
    if (getHomeIncludeIndices.length > 0) {
      const his = getHomeIncludeIndices.map((e) => new RegExp(e));
      idx = idx.filter((index) => his.some((e) => e.test(index.name)));
    }
    if (getHomeExcludeIndices.length > 0) {
      const his = getHomeExcludeIndices.map((e) => new RegExp(e));
      idx = idx.filter((index) => !his.some((e) => e.test(index.name)));
    }

    const { indexOrderBy } = useGlobalSettingStore();
    return idx.sort((a, b) => {
      if (indexOrderBy === "desc") {
        return b.name.localeCompare(a.name, "zh");
      }
      return a.name.localeCompare(b.name, "zh");
    });
  });

  /**
   * 所有可进行搜索的索引
   *
   * @example value-index:type
   */
  const indexOptions = computed<Array<IndexOption>>(() => {
    const items = new Set<IndexOption>();
    const names = new Set<string>();
    if (indices.value.length === 0) {
      return Array.from(items);
    }
    for (const index of indices.value) {
      const { alias, name } = index;
      buildItem(items, names, alias, name);
    }
    return Array.from(items).sort((e1, e2) => e1.value.localeCompare(e2.value, "zh"));
  });

  /**
   * 所有的字段项
   * @example type:field
   */
  const fieldOptionMap = computed<Record<string, Array<Field>>>(() => {
    const result: Record<string, Array<Field>> = {};
    for (const index of indices.value) {
      const { name, alias, fields } = index;
      for (const item of [name, ...alias]) {
        result[item] = [
          {
            label: "_id",
            value: "_id",
            type: "text"
          },
          ...fields
        ];
      }
    }
    return result;
  });

  /**
   * mapping映射
   * 所有支持的查询列表都在这
   * @extends type:[index|alias] => mapping
   */
  const mappingMap = computed<Map<string, IndexMapping>>(() => {
    const target = new Map<string, IndexMapping>();
    for (const index of indices.value) {
      const { name, alias, indexInfo, types } = index;
      for (const item of [name, ...alias]) {
        target.set(item, (indexInfo.mappings as Record<string, IndexMapping>)[types[0]]);
      }
    }
    return target;
  });

  async function reset(): Promise<void> {
    const {client} = useUrlStore();
    if (!client) {
      return Promise.reject("请选择链接");
    }
    const old = useUrlStore().current;
    clear();
    const useLoading = LoadingPlugin({
      content: "开始构建索引信息"
    });
    try {
      const clusterInfo = await client.indices();
      indices.value = clusterInfo.indices;
      masterNode.value = clusterInfo.masterNode;
      nodes.value = clusterInfo.nodes;
      indicesMap.value = renderMap(indices.value);

      client.clusterHealth()
        .then((health) => {
          name.value = health.cluster_name;
          active_shards.value = health.active_shards;
          const unassigned_shards = health.unassigned_shards;
          total_shards.value = active_shards.value + unassigned_shards;
          status.value = health.status;
        })
        .catch((e) => NotificationUtil.error(e, "获取索引健康值失败"));

      return Promise.resolve();
    } catch (e: any) {
      if (useUrlStore().current === old) {
        useUrlStore().clear();
      }
      console.error(e);
      return Promise.reject(e);
    } finally {
      useLoading.hide();
    }
  }

  function clear() {
    name.value = "";
    masterNode.value = "";
    nodes.value = {};
    indices.value = [];
    indicesMap.value = new Map<string, IndexItem>();
    active_shards.value = 0;
    total_shards.value = 0;
    status.value = "";
  }

  async function refreshIndex(index: IndexItem | string, remove = false) {
    const {client} = useUrlStore();
    if (!client) return MessageUtil.error("请选择链接");
    const indexName = typeof index === "string" ? index : index.name;
    for (let i = 0; i < indices.value.length; i++) {
      if (indices.value[i].name === indexName) {
        if (remove) {
          indices.value.splice(i, 1);
          return;
        }
        indices.value[i] = await client.getIndex(indexName);
        return;
      }
    }
    indices.value.push(await client.getIndex(indexName));
  }

  function updateIndex(indexName: string, onUpdate: (index: IndexItem) => void) {
    for (let i = 0; i < indices.value.length; i++) {
      if (indices.value[i].name === indexName) {
        onUpdate(indices.value[i]);
        return;
      }
    }
  }

  function removeIndex(indexName: string) {
    for (let i = 0; i < indices.value.length; i++) {
      if (indices.value[i].name === indexName) {
        indices.value.splice(i, 1);
        return;
      }
    }
  }

  return {
    masterNode,
    nodes,
    indicesMap,
    name,
    active_shards,
    total_shards,
    status,
    list,
    indexOptions,
    fieldOptionMap,
    mappingMap,
    reset,
    clear,
    refreshIndex,
    updateIndex,
    removeIndex
  };
});
