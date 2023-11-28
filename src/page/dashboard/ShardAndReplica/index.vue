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
                        <a-typography v-for="node in nodes">
                            <a-typography-paragraph class="icon">
                                <a-tooltip content="主节点" v-if="ArrayUtil.contains(node.types, NodeItemType.PRIMARY)">
                                    <icon-star-fill style="color: rgb(var(--arcoblue-6));"/>
                                </a-tooltip>
                                <a-tooltip content="无效的节点"
                                           v-else-if="ArrayUtil.contains(node.types, NodeItemType.UNASSIGNED)">
                                    <icon-exclamation-circle-fill style="color: rgb(var(--red-6));"/>
                                </a-tooltip>
                                <!-- 标准节点 -->
                                <icon-info-circle-fill
                                        v-else-if="ArrayUtil.contains(node.types, NodeItemType.STARTED)"/>
                            </a-typography-paragraph>
                            <a-typography-paragraph bold>
                                <a-dropdown position="bl">
                                    <a-button type="text">
                                        <template #icon>
                                            <icon-down />
                                        </template>
                                        {{ node.name }}
                                    </a-button>
                                    <template #content>
                                        <a-doption>集群节点信息</a-doption>
                                        <a-doption>节点信息</a-doption>
                                    </template>
                                </a-dropdown>
                            </a-typography-paragraph>
                        </a-typography>
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
                             :class="shard ? (shard.state ==='UNASSIGNED' ?  'unassigned' : '') : 'empty'">
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
import ArrayUtil from '@/utils/ArrayUtil';
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
    types: Array<NodeItemType>;
}

enum NodeItemType {
    UNASSIGNED = 1,
    PRIMARY = 2,
    STARTED = 3
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
                    const node: NodeItem = {
                        key: key,
                        name: key,
                        types: new Array<NodeItemType>()
                    };
                    if (shard.primary) {
                        node.types.push(NodeItemType.PRIMARY);
                    }
                    if (shard.state === 'UNASSIGNED') {
                        node.types.push(NodeItemType.UNASSIGNED);
                    } else if (shard.state === 'STARTED') {
                        node.types.push(NodeItemType.STARTED);
                    }
                    nodes.value.push(node);
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
        showJson(`${shard.index}/${shard.node}[${shard.shard}]`, shard, {
            width: '600px'
        });
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
        overflow: auto;
    }

    .index {
        margin: 7px 14px;

        .info {
            padding: 14px 0;
            height: 120px;

            .name {
                font-size: 1.6em;
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
                    margin: 18px 4px 24px;
                    &:first-child{
                        margin-left: 0;
                    }
                    &:last-child {
                        margin-right: 0;
                    }
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
                    margin-bottom: 7px;
                }
            }
        }
    }
}
</style>
