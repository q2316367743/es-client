<template>
    <div class="card">
        <div
            class="title"
            v-bind:style="{
                color: index?.state === 'open' ? '#000000' : '#888888',
            }"
        >{{ index?.name }}</div>
        <div class="detail">
            <div>
                size:
                {{ index?.size }}
            </div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <div class="option">
            <el-dropdown @command="info">
                <el-button type="primary" size="small">
                    {{ $t('home.index.info.self') }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="state">{{ $t('home.index.info.index_status') }}</el-dropdown-item>
                        <el-dropdown-item
                            command="cluster_stats"
                        >{{ $t('home.index.info.index_info') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown style="margin-left: 10px" @command="active">
                <el-button type="primary" size="small">
                    <span>{{ $t('home.index.active.self') }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :command="1">{{ $t('home.index.active.new_alias') }}</el-dropdown-item>
                        <el-dropdown-item :command="2">{{ $t('home.index.active.refresh') }}</el-dropdown-item>
                        <el-dropdown-item :command="3">{{ $t('home.index.active.flush_refresh') }}</el-dropdown-item>
                        <el-dropdown-item disabled>{{ $t('home.index.active.ForceMerge') }}</el-dropdown-item>
                        <el-dropdown-item disabled>{{ $t('home.index.active.gateway_snapshot') }}</el-dropdown-item>
                        <el-dropdown-item disabled>{{ $t('home.index.active.test_profiler') }}</el-dropdown-item>
                        <el-dropdown-item  :command="7"
                            v-if="index?.state === 'open'"
                        >{{ $t('home.index.active.close') }}</el-dropdown-item>
                        <el-dropdown-item  :command="8"
                            v-if="index?.state === 'close'"
                        >{{ $t('home.index.active.open') }}</el-dropdown-item>
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
                @close="remove_alias(item)"
            >{{ item }}</el-tag>
        </div>
        <div class="expand_btn">
            <el-button type="text" @click="show_expand = !show_expand">
                <el-icon v-if="show_expand">
                    <arrow-up></arrow-up>
                </el-icon>
                <el-icon v-else>
                    <ArrowDown></ArrowDown>
                </el-icon>
            </el-button>
        </div>
        <div class="expand" v-show="show_expand">
            <div v-for="(value, key) in index?.shard" :key="key">
                <div
                    class="shard"
                    v-for="(item, idx) in value"
                    :key="idx"
                    @click="showShardOrReplica(item, idx)"
                >{{ key }}</div>
            </div>
            <div v-for="(value, key) in index?.replica" :key="key">
                <div
                    class="replica"
                    v-for="(item, idx) in value"
                    :key="idx"
                    @click="showShardOrReplica(item, idx)"
                >{{ key }}</div>
            </div>
        </div>
        <json-dialog :title="title" :json="json" :open="open" v-model="show_dialog"></json-dialog>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { useIndexStore } from '@/store/IndexStore';
import Index from "@/view/Index";
import JsonDialog from "@/component/JsonDialog.vue";
import indexApi from '@/api/IndexApi'
import cluster_api from "@/api/clusterApi";

export default defineComponent({
    components: { ArrowDown, ArrowUp, JsonDialog },
    props: {
        index: Object as PropType<Index>
    },
    data: () => ({
        state: false,
        show_expand: false,
        title: '',
        open: true,
        json: {},
        show_dialog: false
    }),
    methods: {
        showShardOrReplica(json: any, idx: number) {
            this.title = `${this.index?.name}/${json.allocation_id ? json.allocation_id.id : 'null'}[${idx}]`;
            this.json = json;
            this.show_dialog = true;
        },
        info(command: string) {
            if (command === 'state') {
                this.title = this.index?.name!;
                // 实时获取最新的
                cluster_api._stats().then(state => {
                    this.json = state.indices[this.title];
                    this.show_dialog = true;
                }).catch(() => {
                    ElMessage.error('获取索引状态错误')
                })
            } else if (command === 'cluster_stats') {
                this.title = this.index?.name!;
                cluster_api._cluster_state().then(cluster_stats => {
                    this.json = cluster_stats.metadata.indices[this.title];
                    this.show_dialog = true;
                }).catch(() => {
                    ElMessage.error('获取索引信息错误')
                })
            } else {
                ElMessage.error('信息：命令不存在')
            }
        },
        active(command: number) {
            switch (command) {
                case 1:
                    this.new_alias();
                    break;
                case 2:
                    this.refresh_index();
                    break;
                case 3:
                    this.flush_index();
                    break;
                case 7:
                    this.close_index();
                    break;
                case 8:
                    this.open_index();
                    break;
                case 9:
                    this.remove_index();
                    break;
                default:
                    ElMessage.error('动作错误，请刷新重试');
            }
        },
        /**
         * 新建索引别名
         * @param name 索引名称
         */
        new_alias() {
            ElMessageBox.prompt("请输入新别名", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                indexApi.new_alias(this.index?.name!, value, (res: object) => {
                    ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
                });
            });
        },
        /**
         * 移除索引别名
         * 
         * @param name 索引名称
         * @param alias 别名
         */
        remove_alias(alias: string) {
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
        remove_index() {
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
        open_index() {
            indexApi._open(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
            })
        },
        close_index() {
            indexApi._close(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
            })
        },
        flush_index() {
            indexApi._flush(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
            })
        },
        refresh_index() {
            indexApi._refresh(this.index?.name!, (res: any) => {
                ElMessage.info(JSON.stringify(res));
                    useIndexStore().reset();
            })
        }
    }
});
</script>
<style lang="less">
.home-main {
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

        .expand_btn {
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