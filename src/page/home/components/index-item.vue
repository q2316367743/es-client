<template>
    <div class="home-index-card">
        <!-- 标题 -->
        <div class="title" :style="{maxWidth: maxWidth}">
            <div class="index-item-title" type="primary" :style="{ color: indexStateTitle }" @click="indexInfo()"
                 :title="index?.name">{{ index?.name }}
            </div>
            <a-button shape="round" type="dashed" size="small" @click="execCopy(index?.name)">复制</a-button>
        </div>
        <!-- 别名 -->
        <div class="alias">
            <a-space>
                <span class="arco-tag arco-tag-size-medium arco-tag-blue arco-tag-checked"
                      v-for="(item, idx) in index?.alias" :key="idx">
                {{ item }}
                <icon-close :size="16" @click="removeAlias(item)" class="alias-close"/>
            </span>
            </a-space>
            <a-button type="primary" status="normal" size="mini" @click="newAlias()">{{ $t('common.operation.add') }}
            </a-button>
        </div>
        <!-- 详细 -->
        <div class="detail">
            <div> size: {{ index?.size }}</div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <!-- 操作 -->
        <div class="option">
            <a-tooltip :effect="theme" :content="indexStateTooltip" placement="bottom">
                <a-popconfirm :content="`确认${indexStateTooltip}索引？`" @ok="indexOperation"
                              :ok-text="indexStateTooltip">
                    <a-button type="text" :status="indexStateBtn">
                        <template #icon>
                            <icon-pause v-if="indexStateBtn === 'danger'"/>
                            <icon-play-arrow v-else/>
                        </template>
                    </a-button>
                </a-popconfirm>
            </a-tooltip>
            <a-tooltip :effect="theme" content="删除索引" placement="bottom">
                <a-button type="text" @click="removeIndex()">
                    <template #icon>
                        <icon-delete/>
                    </template>
                </a-button>
            </a-tooltip>
        </div>
        <!-- 拓展面板按钮 -->
        <div class="expand-btn">
            <!-- 查询跳转 -->
            <a-button-group type="text" status="success">
                <a-tooltip :effect="theme" content="跳转到数据浏览" placement="bottom">
                    <a-button @click="jumpToDataBrowser()" style="border: none">
                        <template #icon>
                            <icon-apps/>
                        </template>
                    </a-button>
                </a-tooltip>
                <a-tooltip :effect="theme" content="跳转到基础查询" placement="bottom">
                    <a-button @click="jumpToBaseSearch()" style="border: none">
                        <template #icon>
                            <icon-search/>
                        </template>
                    </a-button>
                </a-tooltip>
                <a-tooltip :effect="theme" content="跳转到高级查询" placement="bottom">
                    <a-button @click="jumpToSeniorSearch()" style="border: none">
                        <template #icon>
                            <icon-filter/>
                        </template>
                    </a-button>
                </a-tooltip>
            </a-button-group>
            <a-button type="text" @click="showExpand = !showExpand" size="small">
                <template #icon>
                    <icon-up v-if="showExpand"/>
                    <icon-down v-else/>
                </template>
            </a-button>
        </div>
        <!-- 拓展面板 -->
        <div class="expand" v-if="showExpand">
            <div style="display: flex;">
                <div v-for="(value, key) in index?.shard" :key="key">
                    <div class="shard" v-for="(item, idx) in value" :key="idx" @click="showShardOrReplica(item, idx)">{{
                            key
                        }}
                    </div>
                </div>
            </div>
            <div style="display: flex;">
                <div v-for="(value, key) in index?.replica" :key="key">
                    <div class="replica" v-for="(item, idx) in value" :key="idx" @click="showShardOrReplica(item, idx)">
                        {{
                            key
                        }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";

import IndexApi from '@/components/es/api/IndexApi'

import Optional from "@/utils/Optional";

import BaseOrder from "@/entity/BaseOrder";
import {BaseQuery} from "@/entity/BaseQuery";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import IndexView from "@/view/index/IndexView";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import useIndexStore from "@/store/IndexStore";
import {useIndexManageEvent} from "@/global/BeanFactory";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {getDefaultDocumentSearchQueryStr} from "@/components/es/domain/DocumentSearchQuery";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";

export default defineComponent({
    name: 'index-item',
    props: {
        index: Object as PropType<IndexView>
    },
    emits: ['openDialog'],
    data: () => ({
        state: false,
        showExpand: false,
        open: true,
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'width']),
        maxWidth() {
            return (this.width - 210) + 'px'
        },
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
            useIndexManageEvent.emit(this.index?.name);
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
            useIndexStore().reset();
        },
        execCopy(url?: string) {
            utools.copyText(Optional.ofNullable(url).orElse(''));
            MessageUtil.success("已成功复制到剪切板");
        },
        jumpToBaseSearch() {
            if (this.index) {
                useBaseSearchStore().loadEvent({
                    index: this.index.name,
                    conditions: new Array<BaseQuery>(),
                    orders: new Array<BaseOrder>(),
                    execute: true
                })
            }
        },
        jumpToDataBrowser() {
            if (this.index) {
                useDataBrowseStore().loadEvent(this.index);
            }
        },
        jumpToSeniorSearch() {
            if (this.index) {
                useSeniorSearchStore().loadEvent({
                    link: `/${this.index.name}/_search`,
                    method: 'POST',
                    body: getDefaultDocumentSearchQueryStr()
                })
            }
        }
    }
});
</script>
<style lang="less">
.home-index-card {
    margin: 0;
    padding: 10px;
    border: var(--color-border-2) solid 1px;
    border-radius: 2px;
    position: relative;
    min-width: 700px;

    .title {
        display: flex;
        height: 40px;

        .index-item-title {
            font-size: 24px;
            font-weight: bold;

            padding: 1px 4px;
            color: rgb(var(--link-6));
            line-height: 1.5715;
            text-decoration: none;
            background-color: transparent;
            border-radius: var(--border-radius-small);
            cursor: pointer;
            transition: all .1s cubic-bezier(0, 0, 1, 1);

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
                color: rgb(var(--link-6));
                background-color: var(--color-fill-2);
            }
        }

        .arco-btn {
            margin: 6px;
        }

    }

    .alias {
        margin-top: 7px;
        flex-wrap: wrap;

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

    .detail {
        margin-top: 14px;
        color: var(--color-text-1);
    }

    .option {
        position: absolute;
        top: 8px;
        right: 12px;
    }

    .expand-btn {
        position: absolute;
        top: 114px;
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
