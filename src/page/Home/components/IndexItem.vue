<template>
    <div class="home-index-card">
        <!-- 标题 -->
        <div class="title">
            <el-link :type="indexStateTitle" @click="indexInfo">{{ index?.name }}</el-link>
            <div class="url-copy" @click="execCopy(index?.name)">复制</div>
        </div>
        <!-- 详细 -->
        <div class="detail">
            <div> size: {{ index?.size }}</div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <!-- 操作 -->
        <div class="option">
            <el-tooltip :effect="theme" content="状态" placement="bottom">
                <el-button link type="primary" :icon="dataAnalysisIcon" @click="indexState"/>
            </el-tooltip>
            <el-tooltip :effect="theme" :content="indexStateTooltip" placement="bottom">
                <el-button link :type="indexStateBtn" :icon="switchButtonIcon" @click="indexOperation"/>
            </el-tooltip>
            <el-tooltip :effect="theme" content="删除索引" placement="bottom">
                <el-button link type="danger" :icon="deleteIcon" @click="removeIndex"/>
            </el-tooltip>
        </div>
        <!-- 别名 -->
        <div class="alias">
            <el-tag
                v-for="(item, idx) in index?.alias"
                :key="idx"
                closable
                style="margin-right: 5px"
                @close="removeAlias(item)"
            >{{ item }}
            </el-tag>
            <el-button size="small" @click="newAlias">新增</el-button>
        </div>
        <!-- 拓展面板按钮 -->
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
        <!-- 拓展面板 -->
        <div class="expand" v-if="showExpand">
            <div class="info">
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
            <div class="btn">
                <el-button type="primary" size="small" @click="refreshIndex">刷新</el-button>
                <el-button type="primary" size="small" @click="flushIndex">flush刷新</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw, PropType} from "vue";
import {ArrowDown, ArrowUp, Delete, SwitchButton, DataAnalysis} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import IndexView from "@/view/index/IndexView";
import indexApi from '@/api/IndexApi'
import clusterApi from "@/api/ClusterApi";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import BrowserUtil from "@/utils/BrowserUtil";
import {isDark} from "@/global/BeanFactory";

export default defineComponent({
    name: 'IndexItem',
    components: {ArrowDown, ArrowUp},
    props: {
        index: Object as PropType<IndexView>
    },
    emits: ['openDialog'],
    data: () => ({
        state: false,
        showExpand: false,
        open: true,
        showDialog: false,
        dataDialog: false,
        isDark,
        deleteIcon: markRaw(Delete),
        switchButtonIcon: markRaw(SwitchButton),
        dataAnalysisIcon: markRaw(DataAnalysis)
    }),
    computed: {
        indexStateBtn(): 'danger' | 'success' | 'info' {
            if (this.index?.state === 'open') {
                return 'danger';
            } else if (this.index?.state === 'close') {
                return 'success';
            } else {
                return 'info'
            }
        },

        indexStateTooltip(): string {
            if (this.index?.state === 'open') {
                return '关闭';
            } else if (this.index?.state === 'close') {
                return '打开';
            } else {
                return '未知状态'
            }
        },
        indexStateTitle(): 'primary' | 'info' | 'warning' {
            if (this.index?.state === 'open') {
                return 'primary';
            } else if (this.index?.state === 'close') {
                return 'info';
            } else {
                return 'warning'
            }
        },
        theme() {
            return this.isDark ? 'dark' : 'light';
        }
    },
    methods: {
        showShardOrReplica(json: any, idx: number) {
            let title = `${this.index?.name}/${json.allocation_id ? json.allocation_id.id : 'null'}[${idx}]`;
            this.$emit('openDialog', title, json);
        },
        indexState() {
            let title = this.index?.name!;
            clusterApi._stats().then(state => {
                this.$emit('openDialog', title, state.indices[title]);
            }).catch(() => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '获取索引状态错误'
                })
            })
        },
        indexInfo() {
            let title = this.index?.name!;
            clusterApi._cluster_state().then(cluster_stats => {
                this.$emit('openDialog', title, cluster_stats.metadata.indices[title]);
            }).catch(() => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '获取索引信息错误'
                })
            })
        },
        newAlias() {
            ElMessageBox.prompt("请输入新别名", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({value}) => {
                indexApi.new_alias(this.index?.name!, value, (res: object) => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: JSON.stringify(res)
                    })
                    this.reset();
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
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: JSON.stringify(res)
                    })
                    this.reset();
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
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: JSON.stringify(res)
                    })
                    this.reset();
                });
            });
        },
        indexOperation() {
            if (this.index?.state === 'open') {
                this.closeIndex();
            } else if (this.index?.state === 'close') {
                this.openIndex();
            } else {
                ElMessage({
                    showClose: true,
                    type: 'warning',
                    message: `未知索引状态【${this.index?.state}】，无法完成操作`
                })
            }
        },
        openIndex() {
            indexApi._open(this.index?.name!, (res: any) => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: JSON.stringify(res)
                })
                this.reset();
            })
        },
        closeIndex() {
            indexApi._close(this.index?.name!, (res: any) => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: JSON.stringify(res)
                })
                this.reset();
            })
        },
        flushIndex() {
            indexApi._flush(this.index?.name!, (res: any) => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: JSON.stringify(res)
                })
                this.reset();
            })
        },
        refreshIndex() {
            indexApi._refresh(this.index?.name!, (res: any) => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: JSON.stringify(res)
                })
                this.reset();
            })
        },
        reset() {
            emitter.emit(MessageEventEnum.REFRESH_URL);
        },
        execCopy(url: string) {
            BrowserUtil.copy(url);
        }
    }
});
</script>
<style lang="less">
.home-index-card {
    margin: 5px;
    padding: 10px;
    border: #e3e6ec solid 1px;
    border-radius: 5px;
    position: relative;
    min-width: 700px;

    .title {
        display: flex;

        .el-link {
            font-size: 24px;
            font-weight: bold;
        }

        .url-copy {
            margin-top: 4px;
        }
    }

    .detail {
        margin-top: 10px;
        color: var(--text-color);
    }

    .option {
        position: absolute;
        top: 8px;
        right: 12px;
    }

    .alias {
        position: absolute;
        top: 36px;
        right: 102px;
    }

    .expand-btn {
        position: absolute;
        top: 75px;
        right: 12px;
    }

    .expand {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        position: relative;

        .info {
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

        .btn {
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }
}
</style>