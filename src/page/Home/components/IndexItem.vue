<template>
    <div class="home-index-card">
        <!-- 标题 -->
        <div class="title">
            <a-link :type="indexStateTitle" @click="indexInfo">{{ index?.name }}</a-link>
            <div class="url-copy" @click="execCopy(index?.name)">复制</div>
        </div>
        <!-- 详细 -->
        <div class="detail">
            <div> size: {{ index?.size }}</div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <!-- 操作 -->
        <div class="option">
            <a-tooltip :effect="theme" content="跳转到基础查询" placement="bottom">
                <a-button type="text" @click="jumpToBaseSearch">
                    <template #icon>
                        <icon-search/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :effect="theme" :content="indexStateTooltip" placement="bottom">
                <a-button type="text" :status="indexStateBtn" @click="indexOperation">
                    <template #icon>
                        <icon-pause v-if="indexStateBtn === 'danger'"/>
                        <icon-play-arrow v-else/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :effect="theme" content="删除索引" placement="bottom">
                <a-button type="text" @click="removeIndex">
                    <template #icon>
                        <icon-delete/>
                    </template>
                </a-button>
            </a-tooltip>
        </div>
        <!-- 别名 -->
        <div class="alias">
            <a-tag
                v-for="(item, idx) in index?.alias"
                :key="idx"
                closable
                color="blue"
                style="margin-right: 5px"
                @close="removeAlias(item)"
            >{{ item }}
            </a-tag>
            <a-button type="primary" status="normal" size="mini" @click="newAlias">新增</a-button>
        </div>
        <!-- 拓展面板按钮 -->
        <div class="expand-btn">
            <a-button type="text" @click="showExpand = !showExpand" size="small">
                <template #icon>
                    <icon-up v-if="showExpand"/>
                    <icon-down v-else/>
                </template>
            </a-button>
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
import {defineComponent, PropType} from "vue";

import IndexApi from '@/api/IndexApi'

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
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: 'IndexItem',
    props: {
        index: Object as PropType<IndexItemView>
    },
    emits: ['openDialog', 'openManage'],
    data: () => ({
        state: false,
        showExpand: false,
        open: true,
        isDark,
    }),
    computed: {
        indexStateBtn(): 'danger' | 'success' | 'normal' {
            if (this.index?.state === 'open') {
                return 'danger';
            } else if (this.index?.state === 'close') {
                return 'success';
            } else {
                return 'normal'
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
        indexInfo() {
            this.$emit('openManage', this.index?.name);
        },
        newAlias() {
            MessageBoxUtil.prompt("请输入新别名", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then((value) => IndexApi(this.index?.name!).newAlias(value)
                .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('新建别名错误', e)));
        },
        removeAlias(alias: string) {
            MessageBoxUtil.confirm("此操作将永久删除该别名, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(() => IndexApi(this.index?.name!).removeAlias(alias)
                .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                .catch(e => MessageUtil.error('删除别名错误', e)));
        },
        removeIndex() {
            MessageBoxUtil.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
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

        .arco-link {
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
        top: 40px;
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
        position: relative;


        .shard {
            border: #000000 solid 4px;
            background-color: aquamarine;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 34px;
            margin: 4px;
            cursor: pointer;
        }

        .replica {
            border: #666666 solid 4px;
            background-color: #f2f2f2;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 34px;
            margin: 4px;
            cursor: pointer;
        }

    }
}
</style>