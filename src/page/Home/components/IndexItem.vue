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
            <el-tooltip :effect="theme" content="跳转到基础查询" placement="bottom">
                <el-button link type="primary" :icon="searchIcon" @click="jumpToBaseSearch"/>
            </el-tooltip>
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
import {defineComponent, markRaw, PropType} from "vue";
import {ArrowDown, ArrowUp, DataAnalysis, Delete, Search, SwitchButton} from '@element-plus/icons-vue';
import {ElMessageBox} from "element-plus";

import IndexApi from '@/api/IndexApi'
import clusterApi from "@/api/ClusterApi";

import BrowserUtil from "@/utils/BrowserUtil";
import Optional from "@/utils/Optional";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import emitter from "@/plugins/mitt";
import {isDark, useBaseSearchEvent, usePageJumpEvent} from "@/global/BeanFactory";
import IndexItemView from "@/view/IndexItemView";

import BaseOrder from "@/entity/BaseOrder";
import BaseQuery from "@/entity/BaseQuery";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'IndexItem',
    components: {ArrowDown, ArrowUp},
    props: {
        index: Object as PropType<IndexItemView>
    },
    emits: ['openDialog', 'openManage'],
    data: () => ({
        state: false,
        showExpand: false,
        open: true,
        isDark,
        // 图标
        deleteIcon: markRaw(Delete),
        switchButtonIcon: markRaw(SwitchButton),
        dataAnalysisIcon: markRaw(DataAnalysis),
        searchIcon: markRaw(Search)
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
            }).catch(e => {
                MessageUtil.error('获取索引状态错误', e);
            })
        },
        indexInfo() {
            this.$emit('openManage', this.index?.name);
        },
        newAlias() {
            ElMessageBox.prompt("请输入新别名", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({value}) => IndexApi(this.index?.name!).newAlias(value)
                .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('新建别名错误', e)));
        },
        removeAlias(alias: string) {
            ElMessageBox.confirm("此操作将永久删除该别名, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => IndexApi(this.index?.name!).removeAlias(alias)
                .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('删除别名错误', e)));
        },
        removeIndex() {
            ElMessageBox.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => IndexApi(this.index?.name!).delete()
                .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('索引删除错误', e)));
        },
        indexOperation() {
            if (this.index?.state === 'open') {
                this.closeIndex();
            } else if (this.index?.state === 'close') {
                this.openIndex();
            } else {
                MessageUtil.warning(`未知索引状态【${this.index?.state}】，无法完成操作`);
            }
        },
        openIndex() {
            IndexApi(this.index?.name!)._open()
                .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('打开索引失败', e));
        },
        closeIndex() {
            IndexApi(this.index?.name!)._close()
                .then((res: any) => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('关闭索引失败', e));
        },
        reset() {
            emitter.emit(MessageEventEnum.REFRESH_URL);
        },
        execCopy(url?: string) {
            BrowserUtil.copy(Optional.ofNullable(url).orElse(''));
        },
        jumpToBaseSearch() {
            if (this.index) {
                usePageJumpEvent.emit(PageNameEnum.BASE_SEARCH);
                useBaseSearchEvent.emit({
                    name: this.index.name,
                    index: this.index.name,
                    conditions: new Array<BaseQuery>(),
                    orders: new Array<BaseOrder>(),
                    execute: true
                })
            }
        }
    }
});
</script>
<style lang="less">
.home-index-card {
    margin: 5px;
    padding: 10px;
    border: var(--border-color) solid 1px;
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
</style>