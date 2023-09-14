<template>
    <div class="temp-record">
        <div class="temp-record-head">
            <a-input-group>
                <a-select v-model="urlId" style="width: 200px" placeholder="选择所属链接" allow-clear allow-search>
                    <a-option v-for="url in urls" :key="url.id" :value="url.id">{{ url.name }}</a-option>
                </a-select>
                <a-button type="primary" @click="search()">
                    <template #icon>
                        <icon-search/>
                    </template>
                </a-button>
            </a-input-group>
            <a-popconfirm content="此操作将清空全部历史记录，是否继续" ok-text="清空"
                          :ok-button-props="{status: 'danger'}" @ok="clear()">
                <a-button type="primary" status="danger" :loading="clearLoading">
                    <template #icon>
                        <icon-delete/>
                    </template>
                </a-button>
            </a-popconfirm>
        </div>
        <div class="temp-record-body">
            <a-table :data="items" style="height: 100%;">
                <template #columns>
                    <a-table-column data-index="index" :title="$t('common.keyword.index')" :width="250">
                        <template #cell="{ record }">
                            <a-link type="primary" target="_blank">{{ record.index }}</a-link>
                            <div class="url-copy" @click="execCopy(record.index)">{{
                                    $t('common.operation.copy')
                                }}
                            </div>
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
                            <a-button type="primary" size="small" @click="appendToHistory(record)">新增
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
<script lang="ts" setup>
import {computed, ref, toRaw, watch} from "vue";

import BaseSearchHistory from "@/entity/BaseSearchHistory";
import {baseSearchRecordService} from "@/global/BeanFactory";
import useUrlStore from "@/store/UrlStore";
import Optional from "@/utils/Optional";
import useBaseTempRecordStore from "@/store/BaseSearchHistoryStore";
import XEUtils from "xe-utils";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import useBaseSearchHistoryStore from "@/store/BaseSearchHistoryStore";
import {BaseSearchRecord} from "@/entity/record/BaseSearchRecord";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

const urlId = ref<number | undefined>(useUrlStore().id);
const items = ref(new Array<BaseSearchRecord>());
const clearLoading = ref(false);

watch(() => urlId.value, value => search(value));

const urls = computed(() => useUrlStore().urls);

const search = (value?: number) => baseSearchRecordService.list(value || urlId.value).then(res => items.value = res);

search()

const prettyDate = (date: Date) => XEUtils.toDateString(date);
const execCopy = (url: string) => utools.copyText(url);
const removeById = (id: number) => useBaseTempRecordStore().removeById(id);
const load = (record: BaseSearchRecord) => useBaseSearchStore().loadRecord(record);
const reset = () => urlId.value = undefined;
const clear = () => {
    clearLoading.value = true;
    baseSearchRecordService.clear()
        .then(() => MessageUtil.success("清空成功"))
        .catch(e => MessageUtil.error("清空失败", e))
        .finally(() => clearLoading.value = false);
}

function appendToHistory(history: BaseSearchHistory) {
    // 输入名字
    MessageBoxUtil.prompt('请为此次查询命名', '新增历史记录', {
        confirmButtonText: '新增',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '名称为必填'
    }).then((value) => {
        useBaseSearchHistoryStore().add({
            name: value,
            index: history.index,
            conditions: toRaw(history.conditions),
            orders: toRaw(history.orders),
            urlId: Optional.ofNullable(useUrlStore().id).orElse(0)
        }).then(() => MessageUtil.success('新增成功'))
            .catch(e => MessageUtil.error('新增失败', e));
    });
}

</script>
<style lang="less">
.temp-record {

    .temp-record-head {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.55em;
    }

    .temp-record-body {
        margin-top: 7px;

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
