<template>
    <div class="display-record">
        <div class="display-record-head">
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
        <div class="display-record-body">
            <a-table :data="records" :expandable="expandable" row-key="date">
                <template #columns>
                    <a-table-column data-index="date" :width="150" title="查询时间">
                        <template #cell="{ record }">{{ formatter(record.date) }}</template>
                    </a-table-column>
                    <a-table-column data-index="success" :width="100" title="查询状态">
                        <template #cell="{ record }">
                            <div style="display: flex;">
                                <div class="dot" :style="{ backgroundColor: record.success ? 'green' : 'red' }"/>
                                <div>{{ record.success ? '成功' : '失败' }}</div>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column data-index="time" :width="100" title="执行时间">
                        <template #cell="{ record }">
                            {{ record.time }}ms
                        </template>
                    </a-table-column>
                    <a-table-column data-index="method" :width="100" title="请求方式"/>
                    <a-table-column data-index="link" :width="150" title="请求连接"/>
                    <a-table-column :width="85" title="操作" fixed="right">
                        <template #cell="{ record }">
                            <a-button type="primary" @click="load(record)">载入</a-button>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
            <a-pagination v-model:current="current" v-model:page-size="size" :total="total" style="margin-top: 7px;"/>
        </div>
    </div>

</template>
<script lang="ts" setup>
import {TableData, TableExpandable} from "@arco-design/web-vue";
import {computed, h, ref, watch} from "vue";
import JsonView from "@/components/JsonView/index.vue";
import XEUtils from "xe-utils";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {SeniorSearchRecord} from "@/entity/record/SeniorSearchRecord";
import { seniorSearchRecordService} from "@/global/BeanFactory";
import useUrlStore from "@/store/UrlStore";
import MessageUtil from "@/utils/MessageUtil";

const urlId = ref<number | undefined>(useUrlStore().id);
const records = ref(new Array<SeniorSearchRecord>());
const clearLoading = ref(false);

const current = ref(1);
const size = ref(10);
const total = ref(0);


watch(() => urlId.value, value => search(value));
watch(() => current.value, () => search());

const urls = computed(() => useUrlStore().urls);

const expandable = ref<TableExpandable>({
    title: '请求体',
    width: 80,
    expandedRowRender: (record: TableData) => {
        try {
            return h(JsonView, {
                data: JSON.parse(record.params)
            });
        } catch (e) {
            return h('pre', {}, record.params);
        }
    }
});


const search = (value?: number) => seniorSearchRecordService.page(current.value, size.value, value || urlId.value)
    .then(res => {
        records.value = res.records;
        total.value = res.total;
    });

const formatter = (column: Date) => XEUtils.toDateString(column, 'yyyy-MM-dd HH:ss:mm');

function load(record: SeniorSearchRecord) {
    useSeniorSearchStore().loadEvent({
        link: record.link,
        method: record.method,
        body: record.body
    })
}

const clear = () => {
    clearLoading.value = true;
    seniorSearchRecordService.clear()
        .then(() => {
            MessageUtil.success("清空成功");
            search();
        })
        .catch(e => MessageUtil.error("清空失败", e))
        .finally(() => clearLoading.value = false);
}
</script>
<style lang="less">
.display-record {

    .display-record-head {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.55em;
    }

    .display-record-body {
        margin-top: 7px;

    }
}
</style>
