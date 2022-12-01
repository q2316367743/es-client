<template>
    <div class="card">
        <div
            class="title"
            v-bind:style="{
                color: index?.state === 'open' ? '#000000' : '#888888',
            }"
        >{{ index?.name }}
        </div>
        <div class="detail">
            <div>
                size:
                {{ index?.size }}
            </div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <div class="option">
            <!-- 索引的详情 -->
            <el-dropdown @command="info">
                <el-button type="primary" size="small">
                    {{ $t('home.index.info.self') }}
                    <el-icon class="el-icon--right">
                        <arrow-down/>
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <!-- 索引状态 -->
                        <el-dropdown-item command="state">{{ $t('home.index.info.index_status') }}</el-dropdown-item>
                        <!-- 索引详情 -->
                        <el-dropdown-item
                            command="cluster_stats"
                        >{{ $t('home.index.info.index_info') }}
                        </el-dropdown-item>
                        <!-- 数据预览 -->
                        <el-dropdown-item command="data">{{ $t('home.index.info.data_preview') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 索引操作 -->
            <el-dropdown style="margin-left: 10px" @command="active">
                <el-button type="primary" size="small">
                    <span>{{ $t('home.index.active.self') }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down/>
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <!-- 新建别名 -->
                        <el-dropdown-item :command="1">{{ $t('home.index.active.new_alias') }}</el-dropdown-item>
                        <!-- 刷新 -->
                        <el-dropdown-item :command="2">{{ $t('home.index.active.refresh') }}</el-dropdown-item>
                        <!-- flush 刷新 -->
                        <el-dropdown-item :command="3">{{ $t('home.index.active.flush_refresh') }}</el-dropdown-item>
                        <!-- ForceMerge -->
                        <el-dropdown-item disabled>{{ $t('home.index.active.ForceMerge') }}</el-dropdown-item>
                        <!-- 网关快照 -->
                        <el-dropdown-item disabled>{{ $t('home.index.active.gateway_snapshot') }}</el-dropdown-item>
                        <!-- 测试分析器 -->
                        <el-dropdown-item disabled>{{ $t('home.index.active.test_profiler') }}</el-dropdown-item>
                        <!-- 关闭 -->
                        <el-dropdown-item
                            :command="7"
                            v-if="index?.state === 'open'"
                        >{{ $t('home.index.active.close') }}
                        </el-dropdown-item>
                        <!-- 打开 -->
                        <el-dropdown-item
                            :command="8"
                            v-if="index?.state === 'close'"
                        >{{ $t('home.index.active.open') }}
                        </el-dropdown-item>
                        <!-- 删除 -->
                        <el-dropdown-item :command="9">{{ $t('home.index.active.delete') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="alias">
            <el-tag
                v-for="(item, idx) in index?.alias"
                :key="idx"
                closable
                style="margin-right: 5px"
                @close="removeAlias(item)"
            >{{ item }}
            </el-tag>
            <el-button size="small" @click="active(1)">新增</el-button>
        </div>
        <div class="expand-btn">
            <el-button link type="primary" @click="showExpand = !showExpand">
                <el-icon v-if="showExpand">
                    <arrow-up></arrow-up>
                </el-icon>
                <el-icon v-else>
                    <ArrowDown></ArrowDown>
                </el-icon>
            </el-button>
        </div>
        <div class="expand" v-show="showExpand">
            <div v-for="(value, key) in index?.shard" :key="key">
                <div
                    class="shard"
                    v-for="(item, idx) in value"
                    :key="idx"
                    @click="showShardOrReplica(item, idx)"
                >{{ key }}
                </div>
            </div>
            <div v-for="(value, key) in index?.replica" :key="key">
                <div
                    class="replica"
                    v-for="(item, idx) in value"
                    :key="idx"
                    @click="showShardOrReplica(item, idx)"
                >{{ key }}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ArrowDown, ArrowUp} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import useIndexStore from '@/store/IndexStore';
import Index from "@/view/Index";
import indexApi from '@/api/IndexApi'
import clusterApi from "@/api/ClusterApi";

export default defineComponent({
    name: 'IndexItem',
    components: {ArrowDown, ArrowUp},
    props: {
        index: Object as PropType<Index>
    },
    emits: ['openDialog'],
    data: () => ({
        state: false,
        showExpand: false,
        open: true,
        showDialog: false,
        dataDialog: false,
    }),
    methods: {
        showShardOrReplica(json: any, idx: number) {
            let title = `${this.index?.name}/${json.allocation_id ? json.allocation_id.id : 'null'}[${idx}]`;
            this.$emit('openDialog', title, json);
        },
        info(command: string) {
            if (command === 'state') {
                let title = this.index?.name!;
                // 实时获取最新的
                clusterApi._stats().then(state => {
                    this.$emit('openDialog', title, state.indices[title]);
                }).catch(() => {
                    ElMessage.error('获取索引状态错误')
                })
            } else if (command === 'cluster_stats') {
                let title = this.index?.name!;
                clusterApi._cluster_state().then(cluster_stats => {
                    this.$emit('openDialog', title, cluster_stats.metadata.indices[title]);
                }).catch(() => {
                    ElMessage.error('获取索引信息错误')
                })
            } else if (command === 'data') {
                indexApi._search(this.index!.name).then((result) => {
                    this.$emit('openDialog', this.index?.name, result);
                })
            } else {
                ElMessage.error('信息：命令不存在')
            }
        },
        active(command: number) {
            switch (command) {
                case 1:
                    this.newAlias();
                    break;
                case 2:
                    this.refreshIndex();
                    break;
                case 3:
                    this.flushIndex();
                    break;
                case 7:
                    this.closeIndex();
                    break;
                case 8:
                    this.openIndex();
                    break;
                case 9:
                    this.removeIndex();
                    break;
                default:
                    ElMessage.error('动作错误，请刷新重试');
            }
        },
        newAlias() {
            ElMessageBox.prompt("请输入新别名", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({value}) => {
                indexApi.new_alias(this.index?.name!, value, (res: object) => {
                    ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
                });
            });
        },
        removeAlias(alias: string) {
            ElMessageBox.confirm("此操作将永久删除该别名, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                indexApi.remove_alias(this.index?.name!, alias, (res: object) => {
                    ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
                });
            });
        },
        removeIndex() {
            ElMessageBox.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                indexApi.remove(this.index?.name!, (res: object) => {
                    ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
                });
            });
        },
        openIndex() {
            indexApi._open(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                useIndexStore().reset();
            })
        },
        closeIndex() {
            indexApi._close(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                useIndexStore().reset();
            })
        },
        flushIndex() {
            indexApi._flush(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                useIndexStore().reset();
            })
        },
        refreshIndex() {
            indexApi._refresh(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                useIndexStore().reset();
            })
        }
    }
});
</script>
<style lang="less">
.index-container {
    .card {
        margin: 5px;
        padding: 10px;
        border: #e3e6ec solid 1px;
        border-radius: 5px;
        position: relative;
        min-width: 700px;

        .title {
            font-size: 24px;
            font-weight: bold;
        }

        .detail {
            margin-top: 10px;
        }

        .option {
            position: absolute;
            top: 28px;
            right: 12px;
        }

        .alias {
            position: absolute;
            top: 28px;
            right: 212px;
        }

        .expand-btn {
            position: absolute;
            top: 63px;
            right: 12px;
        }

        .expand {
            margin-top: 10px;
            display: flex;

            .shard {
                border: #000000 solid 4px;
                background-color: aquamarine;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                margin: 4px;
                cursor: pointer;
            }

            .replica {
                border: #666666 solid 4px;
                background-color: #f2f2f2;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                margin: 4px;
                cursor: pointer;
            }
        }
    }
}
</style>