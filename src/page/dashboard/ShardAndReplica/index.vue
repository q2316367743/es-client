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
                    <a-typography v-for="node in nodes" class="shard-title">
                        <a-typography-paragraph class="icon">
                            <a-tooltip content="主节点" v-if="ArrayUtil.contains(node.types, NodeItemType.PRIMARY)">
                                <icon-star-fill style="color: rgb(var(--arcoblue-6));"/>
                            </a-tooltip>
                            <a-tooltip content="未分配的节点"
                                       v-else-if="ArrayUtil.contains(node.types, NodeItemType.UNASSIGNED)">
                                <icon-exclamation-circle-fill style="color: rgb(var(--red-6));"/>
                            </a-tooltip>
                            <!-- 标准节点 -->
                            <a-tooltip content="工作节点"
                                       v-else-if="ArrayUtil.contains(node.types, NodeItemType.STARTED)">
                                <icon-info-circle-fill/>
                            </a-tooltip>
                        </a-typography-paragraph>
                        <a-typography-paragraph bold>
                            <a-link v-if="ArrayUtil.contains(node.types, NodeItemType.UNASSIGNED)">
                                {{ node.name }}
                            </a-link>
                            <a-dropdown-button position="bl" v-else type="text">
                                {{ node.name }}
                                <template #icon>
                                    <icon-down/>
                                </template>
                                <template #content>
                                    <a-doption>集群节点信息</a-doption>
                                    <a-doption>节点信息</a-doption>
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
                    <div class="shard" v-for="node in nodes">
                        <div class="item" v-for="(shard, idx) in index.nodes[node.name]" @click="openJsonDialog(shard)"
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
import {showJson} from "@/utils/DialogUtil";
import ArrayUtil from '@/utils/ArrayUtil';
import {computed, ref, watch} from "vue";
import {Shard} from "@/components/es/domain/ClusterState";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useIndexManageEvent} from "@/global/BeanFactory";
import {OrderType} from "@/store/components/HomeStore";

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
const order = ref(useIndexStore().order);
// 节点信息
const nodes = ref(new Array<NodeItem>());
// 索引信息
const indices = computed(() => {
    nodes.value.length = 0;
    nodeNames.clear();
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
                    item.nodes[key] = new Array<Shard | null>();
                    temp = item.nodes[key];
                }
                temp.push(shard)
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
                margin-bottom: 14px;
                white-space: nowrap;

                .link {
                    font-size: 1.3em;
                    font-weight: bold;
                }
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
                height: 83px;

                .item {
                    border: 3px solid var(--color-neutral-6);
                    padding: 8px 12px;
                    background-color: rgb(var(--green-3));
                    font-size: 1.2em;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 18px 4px 24px;
                    user-select: none;

                    &:first-child {
                        margin-left: 0;
                    }

                    &:last-child {
                        margin-right: 0;
                    }

                    &.primary {
                        border: 3px solid rgb(var(--arcoblue-6));
                    }

                    &.unassigned {
                        background-color: rgb(var(--color-neutral-3));
                    }

                    &.empty {
                        background-color: var(--color-bg-1);
                        border: 3px solid var(--color-bg-1);
                        cursor: default;
                        color: var(--color-bg-1) !important;
                    }
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
