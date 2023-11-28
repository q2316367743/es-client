<template>
    <div class="shard-and-replica">
        <div class="header">
            <a-input style="width: 350px;" v-model="keyword" allow-clear>
                <template #suffix>
                    <icon-search/>
                </template>
            </a-input>
        </div>
        <div class="container">
            <!-- 标题 -->
            <div class="index">
                <div class="info">
                    <div class="name">索引</div>
                </div>
                <div class="shards">
                    <div class="shard-title">
                        <a-typography-paragraph v-for="node in nodes">
                            <a-typography-text class="icon">
                                <a-tooltip content="主节点" v-if="node.status === NodeItemStatus.PRIMARY">
                                    <icon-star-fill style="color: rgb(var(--arcoblue-6));"/>
                                </a-tooltip>
                                <a-tooltip content="无效的节点" v-else-if="node.status === NodeItemStatus.UNASSIGNED">
                                    <icon-exclamation-circle-fill style="color: rgb(var(--red-6));"/>
                                </a-tooltip>
                                <icon-info-circle-fill v-else/>
                            </a-typography-text>
                            <a-typography-paragraph bold>{{ node.name }}</a-typography-paragraph>
                        </a-typography-paragraph>
                    </div>
                </div>
            </div>
            <!-- 每一个索引 -->
            <div class="index" v-for="index in items" :key="index.name">
                <div class="info">
                    <div class="name">{{ index.name }}</div>
                    <div class="size">size: {{ index.size }}</div>
                    <div class="doc_count">docs: {{ index.docCount }}</div>
                </div>
                <!-- 每一个副本 -->
                <div class="shards">
                    <div class="shard" v-for="node in index.nodes">
                        <div class="item" v-for="shard in node" @click="openJsonDialog(shard)"
                             :class="shard ? shard.state ==='UNASSIGNED' ?  'unassigned' : '' : 'empty'">
                            {{ shard ? shard.shard : '' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import useIndexStore from "@/store/IndexStore";
import {showJson} from "@/utils/DialogUtil";
import {computed, ref} from "vue";
import {Shard} from "@/components/es/domain/ClusterState";
import {useFuse} from "@vueuse/integrations/useFuse";

interface IndexItem {
    name: string;
    size: string;
    docCount: string;
    // 节点ID => 节点内全部的分片
    nodes: Record<string, Array<Shard | null>>;

}


interface NodeItem {
    key: string;
    name: string;
    status: NodeItemStatus;
}

enum NodeItemStatus {
    UNASSIGNED = 1,
    PRIMARY = 2,
    OTHER = 3
}

const nodeNames = new Set<string>();

const keyword = ref('');
// 节点信息
const nodes = ref(new Array<NodeItem>());
// 索引信息
const indices = computed(() => {
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
                const key = shard.node || 'Unassigned';
                let temp = item.nodes[key];
                if (!temp) {
                    item.nodes[key] = new Array<Shard | null>(index.indexInfo.settings.number_of_shards);
                    temp = item.nodes[key];
                }
                temp[shard.shard] = shard;
                if (!nodeNames.has(key)) {
                    nodes.value.push({
                        key: key,
                        name: key,
                        status: shard.primary ? NodeItemStatus.PRIMARY : (shard.state === 'UNASSIGNED' ? NodeItemStatus.UNASSIGNED : NodeItemStatus.OTHER)
                    });
                    nodeNames.add(key)
                }
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

function openJsonDialog(shard: Shard | null) {
    if (shard) {
        showJson(`${shard.index}/${shard.node}[${shard.shard}]`, shard);
    }
}

</script>
<style scoped lang="less">
.shard-and-replica {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;

    .header {
    }

    .container {
        position: absolute;
        top: 39px;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex: 1;
        overflow-x: auto;
    }

    .index {
        padding: 7px 14px;

        .info {
            padding: 14px 0;
            height: 120px;

            .name {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 14px;
                white-space: nowrap;
            }

            .size {
                margin-bottom: 14px;
                color: var(--color-text-2);
            }

            .doc_count {
                color: var(--color-text-2);
            }
        }

        .shards {
            display: flex;
            flex-direction: column;

            .shard {
                display: flex;
                flex-direction: row;
            }

            .shard, .shard-title {
                .item {
                    border: 3px solid var(--color-neutral-8);
                    padding: 8px 12px;
                    background-color: rgb(var(--green-3));
                    font-size: 1.2em;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 4px 4px 36px;
                }

                .unassigned {
                    background-color: rgb(var(--color-neutral-3));
                }

                .empty {
                    background-color: rgb(var(--color-bg-1));
                    border: 3px solid var(--color-bg-1);
                }

                .item-title {
                    padding: 11px;
                    font-weight: bold;
                    margin: 4px 4px 24px;
                }

                .icon {
                    font-size: 1.5em;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
