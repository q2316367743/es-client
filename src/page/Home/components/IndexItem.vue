<template>
    <div class="home-index-card">
        <!-- 标题 -->
        <div class="title">
            <a-link type="primary" :style="{ color: indexStateTitle }" @click="indexInfo">{{ index?.name }}</a-link>
            <a-button shape="round" type="dashed" size="small" @click="execCopy(index?.name)">复制</a-button>
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
                        <icon-search />
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :effect="theme" :content="indexStateTooltip" placement="bottom">
                <a-popconfirm :content="`确认${indexStateTooltip}索引？`" @ok="indexOperation" :ok-text="indexStateTooltip">
                    <a-button type="text" :status="indexStateBtn">
                        <template #icon>
                            <icon-pause v-if="indexStateBtn === 'danger'" />
                            <icon-play-arrow v-else />
                        </template>
                    </a-button>
                </a-popconfirm>
            </a-tooltip>
            <a-tooltip :effect="theme" content="删除索引" placement="bottom">
                <a-button type="text" @click="removeIndex">
                    <template #icon>
                        <icon-delete />
                    </template>
                </a-button>
            </a-tooltip>
        </div>
        <!-- 别名 -->
        <div class="alias">
            <span class="arco-tag arco-tag-size-medium arco-tag-blue arco-tag-checked" v-for="(item, idx) in index?.alias"
                :key="idx" style="margin-right: 5px">
                {{ item }}
                <icon-close :size="16" @click="removeAlias(item)" class="alias-close" />
            </span>
            <a-button type="primary" status="normal" size="mini" @click="newAlias">{{ $t('common.operation.add') }}
            </a-button>
        </div>
        <!-- 拓展面板按钮 -->
        <div class="expand-btn">
            <a-button type="text" @click="showExpand = !showExpand" size="small">
                <template #icon>
                    <icon-up v-if="showExpand" />
                    <icon-down v-else />
                </template>
            </a-button>
        </div>
        <!-- 拓展面板 -->
        <div class="expand" v-if="showExpand">
            <div style="display: flex;">
                <div v-for="(value, key) in index?.shard" :key="key">
                    <div class="shard" v-for="(item, idx) in value" :key="idx" @click="showShardOrReplica(item, idx)">{{ key
                    }}
                    </div>
                </div>
            </div>
            <div style="display: flex;">
                <div v-for="(value, key) in index?.replica" :key="key">
                    <div class="replica" v-for="(item, idx) in value" :key="idx" @click="showShardOrReplica(item, idx)">{{
                        key }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

import IndexApi from '@/api/IndexApi'

import Optional from "@/utils/Optional";

import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";

import emitter from "@/plugins/mitt";
import { isDark, useBaseSearchEvent, usePageJumpEvent } from "@/global/BeanFactory";
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
        indexStateTitle(): 'gray' | '' {
            if (this.index?.state === 'close') {
                return 'gray';
            } else {
                return ''
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
            })
                .then(() => IndexApi(this.index?.name!).removeAlias(alias)
                    .then(res => {
                        MessageUtil.success(JSON.stringify(res), this.reset);
                    })
                    .catch(e => MessageUtil.error('删除别名错误', e)))
                .catch(() => console.log('取消删除'));
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
            utools.copyText(Optional.ofNullable(url).orElse(''));
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
    margin: 5px 0;
    padding: 10px;
    border: var(--color-border-2) solid 1px;
    border-radius: 5px;
    position: relative;
    min-width: 700px;

    .title {
        display: flex;
        height: 40px;

        .arco-link {
            font-size: 24px;
            font-weight: bold;
        }

        .arco-btn {
            margin: 6px;
        }

    }

    .detail {
        margin-top: 24px;
        color: var(--color-text-1);
    }

    .option {
        position: absolute;
        top: 8px;
        right: 12px;
    }

    .alias {
        position: absolute;
        top: 50px;
        right: 102px;

        .alias-close {
            margin-left: 4px;
            padding: 2px;

            &:hover {
                background-color: var(--color-fill-3);
                border-radius: 50%;
                cursor: pointer;
            }
        }
    }

    .expand-btn {
        position: absolute;
        top: 74px;
        right: 12px;
    }

    .expand {
        margin-top: 10px;
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