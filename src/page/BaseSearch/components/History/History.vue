<template>
    <div class="bs-history">
        <div class="bs-history-toolbar">
            <a-input v-model="name" :placeholder="$t('common.keyword.name')" style="width: 200px;"
                @input="search"></a-input>
            <a-switch v-model="onlyCurrent" @change="search" style="margin-left: 12px;" type="round">
                <template #checked>当前链接</template>
                <template #unchecked>全部</template>
            </a-switch>
        </div>
        <div class="bs-history-body">
            <a-table :data="histories" class="data" style="height: 100%;">
                <template #columns>
                    <a-table-column data-index="name" :title="$t('common.keyword.name')"></a-table-column>
                    <a-table-column data-index="index" :title="$t('common.keyword.index')">
                        <template #cell="{ record }">
                            <a-link type="primary" target="_blank">{{ record.index }}</a-link>
                            <div class="url-copy" @click="execCopy(record.index)">{{ $t('common.operation.copy') }}</div>
                        </template>
                    </a-table-column>
                    <a-table-column :title="$t('common.keyword.operation')" :width="200" fixed="right">
                        <template #cell="{ record }">
                            <a-button type="primary" status="success" size="small" @click="load(record)">
                                {{ $t('common.operation.load') }}
                            </a-button>
                            <a-popconfirm content="确认删除此条记录？" ok-text="删除" cancel-text="取消" @ok="removeById(record.id)"
                                width="200px">
                                <a-button type="primary" status="danger" size="small">
                                    {{ $t('common.operation.delete') }}
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import useUrlStore from "@/store/UrlStore";
import { baseSearchHistoryService, useBaseSearchEvent } from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

// 工具类
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import { stringContain } from "@/utils/SearchUtil";

export default defineComponent({
    name: 'bsh-history',
    emits: ['load'],
    data: () => ({
        histories: new Array<BaseSearchHistory>(),
        name: '',
        onlyCurrent: true,
    }),
    mounted() {
        this.search();
        emitter.on(MessageEventEnum.BASE_HISTORY_UPDATE, () => {
            // 历史记录变更，也要进行重新查询历史
            this.search();
        });
    },
    methods: {
        execCopy(url: string) {
            utools.copyText(url);
        },
        load(history: BaseSearchHistory) {
            this.$emit('load');
            useBaseSearchEvent.emit({
                id: history.id,
                name: history.name,
                index: history.index,
                conditions: history.conditions,
                orders: history.orders,
                execute: false
            });
        },
        search() {
            if (!useUrlStore().id && this.onlyCurrent) {
                this.histories = new Array<BaseSearchHistory>();
                return;
            }
            baseSearchHistoryService.list(this.onlyCurrent ? useUrlStore().id : undefined)
                .then(records => {
                    this.histories = records.filter(e => stringContain(e.name!, this.name))
                        .sort((a, b) =>
                            Optional.ofNullable(b.id).orElse(0) - Optional.ofNullable(a.id).orElse(0));
                }).catch(e => MessageUtil.error('历史查询失败', e));
        },
        removeById(id: number) {
            baseSearchHistoryService.removeById(id)
                .then(() => MessageUtil.success('删除成功', this.search))
                .catch(e => MessageUtil.error('删除失败', e));
        },
    }
});
</script>
<style scoped lang="less">
.bs-history {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .bs-history-body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;

        .bs-history-params {
            display: flex;

            .bs-history-params-value {
                width: 200px;
                overflow: hidden;
                white-space: nowrap; //不折行
                text-overflow: ellipsis; //溢出显示省略号
            }
        }

        .url-copy {
            display: inline;
        }
    }
}
</style>