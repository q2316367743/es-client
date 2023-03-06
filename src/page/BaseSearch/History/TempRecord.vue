<template>
    <div class="temp-record">
        <div class="temp-record-head">
            <div>
                <a-input v-model="index" style="width: 200px;" placeholder="索引" @input="loadData" clearable />
            </div>
            <div>
                <a-button type="primary" status="danger" @click="reset">
                    <template #icon>
                        <icon-delete />
                    </template>
                    清空
                </a-button>
            </div>
        </div>
        <div class="temp-record-body">
            <a-table :data="tempRecords" style="height: 100%;">
                <template #columns>
                    <a-table-column data-index="index" :title="$t('common.keyword.index')" :width="250">
                        <template #cell="{ record }">
                            <a-link type="primary" target="_blank">{{ record.index }}</a-link>
                            <div class="url-copy" @click="execCopy(record.index)">{{ $t('common.operation.copy') }}</div>
                        </template>
                    </a-table-column>
                    <a-table-column data-index="id" title="时间" :width="200">
                        <template #cell="{ record }">
                            {{ prettyDate(new Date(record.id)) }}
                        </template>
                    </a-table-column>
                    <a-table-column :title="$t('common.keyword.operation')" :width="190">
                        <template #cell="{ record }">
                            <a-button type="primary" status="success" size="small" @click="load(record)">{{
                                $t('common.operation.load')
                            }}
                            </a-button>
                            <a-button type="primary" size="small" @click="appendToHistory(record)">新增到历史记录
                            </a-button>
                            <a-button type="primary" status="danger" size="small" @click="removeById(record.id)">
                                {{ $t('common.operation.delete') }}
                            </a-button>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";

import BaseSearchHistory from "@/entity/BaseSearchHistory";
import BrowserUtil from "@/utils/BrowserUtil";
import { baseSearchHistoryService, useBaseSearchEvent } from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import { stringContain } from "@/utils/SearchUtil";
import useUrlStore from "@/store/UrlStore";
import Optional from "@/utils/Optional";
import useBaseTempRecordStore from "@/store/BaseTempRecordStore";
import XEUtils from "xe-utils";
import { mapState } from "pinia";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: 'bsh-temp-record',
    emits: ['load'],
    data: () => ({
        index: ''
    }),
    computed: {
        ...mapState(useBaseTempRecordStore, ['tempRecords']),
    },
    watch: {
        tempRecords: {
            handler() {
                this.loadData();
            },
            deep: true
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        prettyDate(date: Date) {
            return XEUtils.toDateString(date)
        },
        renderRecord(showTempRecords: Array<BaseSearchHistory>): Array<BaseSearchHistory> {
            showTempRecords = showTempRecords.sort((e1, e2) => e2.id! - e1.id!);
            if (this.index !== '') {
                showTempRecords = showTempRecords.filter(e => stringContain(e.index, this.index));
            }
            return showTempRecords;
        },
        loadData() {
            let showTempRecords = this.tempRecords
            if (this.index !== '') {
                showTempRecords = showTempRecords.filter(e => stringContain(e.index, this.index));
            }
            showTempRecords = this.tempRecords.sort((e1, e2) => e2.id! - e1.id!);
        },
        execCopy(url: string) {
            BrowserUtil.copy(url);
        },
        load(history: BaseSearchHistory) {
            this.$emit('load');
            useBaseSearchEvent.emit({
                name: history.name,
                index: history.index,
                conditions: history.conditions,
                orders: history.orders,
                execute: true
            });
        },
        removeById(id: number) {
            useBaseTempRecordStore().removeById(id);
        },
        appendToHistory(history: BaseSearchHistory) {
            // 输入名字
            MessageBoxUtil.prompt('请为此次查询命名', '新增历史记录', {
                confirmButtonText: '新增',
                cancelButtonText: '取消',
                inputPattern: /.+/,
                inputErrorMessage: '名称为必填'
            }).then((value) => {
                baseSearchHistoryService.save({
                    name: value,
                    index: history.index,
                    conditions: toRaw(history.conditions),
                    orders: toRaw(history.orders),
                    urlId: Optional.ofNullable(useUrlStore().id).orElse(0)
                }).then(() => MessageUtil.success('新增成功', () => {
                    emitter.emit(MessageEventEnum.BASE_HISTORY_UPDATE);
                    // 删除此条记录
                    this.removeById(history.id!);
                })).catch(e => MessageUtil.error('新增失败', e));
            });
        },
        reset() {
            useBaseTempRecordStore().reset();
        }
    }
});
</script>
<style lang="less">
.temp-record {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .temp-record-head {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.55em;
    }

    .temp-record-body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;

        .temp-record-params {
            display: flex;

            .temp-record-params-value {
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