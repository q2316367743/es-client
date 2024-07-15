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
            <a-table :data="records" :expandable="expandable" :pagination="false" row-key="id">
                <template #columns>
                    <a-table-column data-index="method" :width="100" title="请求方式"/>
                    <a-table-column data-index="link" :width="150" title="请求连接"/>
                    <a-table-column :width="85" title="操作" fixed="right">
                        <template #cell="{ record }">
                            <a-tooltip content="载入">
                                <a-button type="primary" @click="load(record)">
                                    <template #icon>
                                        <icon-import />
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-popconfirm content="是否删除此记录？">
                                <a-button type="primary" status="danger">
                                    <template #icon>
                                        <icon-delete />
                                    </template>
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
import {TableData, TableExpandable} from "@arco-design/web-vue";
import {computed, h, ref, watch} from "vue";
import JsonView from "@/components/view/JsonView/index.vue";
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
                data: JSON.parse(record.body)
            });
        } catch (e) {
            return h('pre', {}, record.body);
        }
    }
});


const search = (value?: number) => seniorSearchRecordService.page(current.value, size.value, value || urlId.value)
    .then(res => {
        records.value = res.records;
        total.value = res.total;
    });


function load(record: SeniorSearchRecord) {
    useSeniorSearchStore().loadEvent({
        link: record.link,
        method: record.method,
        body: record.body
    }, false);
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

search();
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
