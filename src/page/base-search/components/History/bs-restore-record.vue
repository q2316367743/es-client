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
            <a-table :data="items" style="height: 100%;" :expandable="expandable" row-key="id" :pagination="false">
                <template #columns>
                    <a-table-column data-index="index" title="索引" :width="150">
                        <template #cell="{ record }">
                            <a-tooltip content="点击复制">
                                <a-link type="primary" target="_blank" @click="execCopy(record.index)">{{
                                        record.index
                                    }}
                                </a-link>
                            </a-tooltip>
                        </template>
                    </a-table-column>
                    <a-table-column data-index="id" title="时间" :width="170">
                        <template #cell="{ record }">
                            {{ prettyDate(new Date(record.id)) }}
                        </template>
                    </a-table-column>
                    <a-table-column :title="$t('common.keyword.operation')" :width="230">
                        <template #cell="{ record }">
                            <a-button type="primary" status="success" size="small" @click="load(record)">
                                加载
                            </a-button>
                            <a-button type="primary" size="small" @click="appendToHistory(record)">
                                新增
                            </a-button>
                            <a-popconfirm content="确认删除此历史记录？" @ok="removeById(record.id)">
                                <a-button type="primary" status="danger" size="small">
                                    删除
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
            <a-pagination v-model:current="current" v-model:page-size="size" :total="total" style="margin-top: 7px;"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, toRaw, watch, h, markRaw} from "vue";
import XEUtils from "xe-utils";
import {TableData, TableExpandable} from "@arco-design/web-vue";

import {baseSearchRecordService} from "@/global/BeanFactory";
// 存储
import useUrlStore from "@/store/UrlStore";
import useBaseSearchHistoryStore from "@/store/BaseSearchHistoryStore";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
// 工具类
import Optional from "@/utils/Optional";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
// 实体类
import {BaseSearchRecord} from "@/entity/record/BaseSearchRecord";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";
// 其他
import JsonView from "@/components/JsonView/index.vue";

const emits = defineEmits(['close']);

const urlId = ref<number | undefined>(useUrlStore().id);
const items = ref(new Array<BaseSearchRecord>());
const clearLoading = ref(false);
const expandable = markRaw<TableExpandable>({
    title: '详情',
    width: 80,
    expandedRowRender: (record: TableData) => {
        return h(JsonView, {
            data: record
        });
    }
});

const current = ref(1);
const size = ref(10);
const total = ref(0);

watch(() => urlId.value, value => search(value));
watch(() => current.value, () => search());

const urls = computed(() => useUrlStore().urls);

const search = (value?: number) => baseSearchRecordService.page(current.value, size.value, value || urlId.value)
    .then(res => {
        items.value = res.records;
        total.value = res.total;
    });

search();

const prettyDate = (date: Date) => XEUtils.toDateString(date);
const execCopy = (url: string) => {
    utools.copyText(url);
    MessageUtil.success("已成功复制到剪切板");
};
const removeById = (id: number) => baseSearchRecordService.removeById(id)
    .then(() => MessageUtil.success("删除成功", () => search()))
    .catch(e => MessageUtil.error("删除失败", e));
const load = (record: BaseSearchRecord) => {
    useBaseSearchStore().loadRecord(record);
    emits('close');
};
const reset = () => urlId.value = undefined;
const clear = () => {
    clearLoading.value = true;
    baseSearchRecordService.clear()
        .then(() => {
            MessageUtil.success("清空成功");
            search();
        })
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
