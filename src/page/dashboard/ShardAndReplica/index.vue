<template>
    <div class="shard-and-replica">
        <div class="header">
            <a-input-group>
                <a-input style="width: 350px;" v-model="keyword" allow-clear>
                    <template #suffix>
                        <icon-search/>
                    </template>
                </a-input>
                <a-select v-model="order" placeholder="索引排序" style="width: 120px;margin-left: 7px;">
                    <a-option :value="OrderType.NAME_ASC">名称正序</a-option>
                    <a-option :value="OrderType.NAME_DESC">名称倒序</a-option>
                    <a-option :value="OrderType.SIZE_ASC">大小正序</a-option>
                    <a-option :value="OrderType.SIZE_DESC">大小倒序</a-option>
                    <a-option :value="OrderType.DOCS_ASC">文档正序</a-option>
                    <a-option :value="OrderType.DOCS_DESC">文档倒序</a-option>
                </a-select>
            </a-input-group>
        </div>
        <div class="container">
            <!-- 标题 -->
            <div class="index">
                <div class="info">
                    <div class="name"></div>
                </div>
                <div class="shards">
                    <a-typography v-for="node in nodeKeys" class="shard-title">
                        <a-typography-paragraph class="icon">
                            <a-tooltip content="主节点" v-if="node === masterNode">
                                <icon-star-fill style="color: rgb(var(--arcoblue-6));"/>
                            </a-tooltip>
                            <a-tooltip content="未分配的节点" v-else-if="node === UNASSIGNED">
                                <icon-exclamation-circle-fill style="color: rgb(var(--red-6));"/>
                            </a-tooltip>
                            <!-- 标准节点 -->
                            <a-tooltip content="工作节点" v-else>
                                <icon-info-circle-fill/>
                            </a-tooltip>
                        </a-typography-paragraph>
                        <a-typography-paragraph bold>
                            <a-button type="text" v-if="node === UNASSIGNED">
                                {{ nodes[node] ? nodes[node].name : node }}
                            </a-button>
                            <a-dropdown-button position="br" v-else type="text" :title="node">
                                {{ nodes[node] ? nodes[node].name : node }}
                                <template #icon>
                                    <icon-down/>
                                </template>
                                <template #content>
                                    <a-doption @click="showClusterNode(node)">集群节点信息</a-doption>
                                    <a-doption @click="showNode(node)">节点信息</a-doption>
                                </template>
                            </a-dropdown-button>
                        </a-typography-paragraph>
                    </a-typography>
                </div>
            </div>
            <!-- 每一个索引 -->
            <div class="index" v-for="index in items" :key="index.name">
                <div class="info">
                    <div class="name">
                        <a-link class="link" @click="openIndexInfo(index.name)">{{ index.name }}</a-link>
                    </div>
                    <div class="size">size: {{ index.size }}</div>
                    <div class="doc_count">docs: {{ index.docCount }}</div>
                </div>
                <!-- 每一个副本 -->
                <div class="shards">
                    <div class="shard" v-for="nodeKey in nodeKeys">
                        <div class="item" v-for="(shard, idx) in index.nodes[nodeKey]" @click="openJsonDialog(shard)"
                             :class="handlerReplicaClass(shard)">
                            {{ shard ? shard.shard : idx }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import useIndexStore from "@/store/IndexStore";
import {showJson, showJsonDialogByAsync} from "@/utils/DialogUtil";
import {Shard} from "@/domain/es/ClusterState";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useIndexManageEvent} from "@/global/BeanFactory";
import {OrderType} from "@/store/components/HomeStore";
import ClusterApi from "@/components/es/ClusterApi";
import {ClusterNode} from "@/domain/index/ClusterInfo";

const UNASSIGNED = "Unassigned";

interface IndexItem {
    name: string;
    size: string;
    docCount: string;
    // 节点ID => 节点内全部的分片
    nodes: Record<string, Array<Shard | null>>;

}


const keyword = ref('');
const order = ref(useIndexStore().order);
const hasUnAssigned = ref(false);
// 节点信息
const nodeKeys = computed<Array<string>>(() => {
    let keys = Object.keys(useIndexStore().nodes);
    if (hasUnAssigned.value) {
        keys.push(UNASSIGNED)
    }
    return keys;
});
const nodes = computed<Record<string, ClusterNode>>(() => useIndexStore().nodes);
const masterNode = computed(() => useIndexStore().masterNode);
// 索引信息
const indices = computed(() => {
    hasUnAssigned.value = false;
    const items = new Array<IndexItem>();
    useIndexStore().indices.forEach(index => {
        const item: IndexItem = {
            name: index.name,
            size: index.size,
            docCount: index.doc_count,
            nodes: {}
        }
        for (let shardsKey in index.shards) {
            // shardsKey: 分片编号
            let shards = index.shards[shardsKey];
            for (let shard of shards) {
                if (!shard.node) {
                    hasUnAssigned.value = true;
                }
                const key = shard.node || UNASSIGNED;
                let temp = item.nodes[key];
                if (!temp) {
                    item.nodes[key] = new Array<Shard | null>();
                    temp = item.nodes[key];
                }
                temp.push(shard)
            }
        }
        items.push(item);
    });
    return items;
});

const {results} = useFuse(keyword, indices, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }]
    }
});
const items = computed(() => results.value.map(e => e.item));

watch(order, value => useIndexStore().sort(value));

function openJsonDialog(shard: Shard | null) {
    if (shard) {
        showJson(`${shard.index}/${shard.node}[${shard.shard}]`, shard, {
            width: '600px'
        });
    }
}

function openIndexInfo(name: string) {
    useIndexManageEvent.emit(name);
}

function handlerReplicaClass(shard: Shard | null): string {
    if (!shard) {
        return 'empty';
    }
    if (shard.state === 'UNASSIGNED') {
        return "unassigned"
    }
    if (shard.primary) {
        return 'primary';
    }
    return "";
}

function showClusterNode(node: string) {
    showJsonDialogByAsync(`集群节点信息【${node}】`, ClusterApi._nodes().then(e => e.nodes[node]), {
        width: '600px'
    })
}

function showNode(node: string) {
    showJsonDialogByAsync(`节点信息【${node}】`, ClusterApi._nodes_stats().then(e => e.nodes[node]), {
        width: '600px'
    })
}

</script>
<style scoped lang="less">
@import url(./index.less);
</style>
