<template>
    <div class="dashboard-cat">
        <a-spin dot tip="数据加载中..." :loading="loading">
            <a-tabs v-model:active-key="activeKey" hide-content>
                <template #extra>
                    <a-tooltip content="跳转到高级查询" position="br">
                        <a-button type="text" @click="jumpTo()">
                            <template #icon>
                                <icon-filter />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-button type="text" @click="refresh()" :loading="loading">
                        <template #icon>
                            <icon-refresh/>
                        </template>
                    </a-button>
                </template>
                <a-tab-pane v-for="tab in tabs" :title="tab.title" :key="tab.key"/>
            </a-tabs>
            <div class="container">
                <a-table :columns="columns" :data="records" :virtual-list-props="virtualListProps" :pagination="false"
                         :scroll="{minWidth: width}"/>
            </div>
        </a-spin>
    </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {TableColumnData, TableData} from "@arco-design/web-vue";
import {useWindowSize} from "@vueuse/core";
import {cat, tabs} from "@/page/dashboard/Cat/func";
import MessageUtil from "@/utils/MessageUtil";
import useUrlStore from "@/store/UrlStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

const size = useWindowSize();

const loading = ref(false);

const activeKey = ref('/_cat/allocation?v');
const columns = ref(new Array<TableColumnData>());
const records = ref(new Array<TableData>());
const width = ref(0);

const virtualListProps = ref({
    height: size.height.value - 90 - 36 - 4
})

watch(() => activeKey.value, (key) => handler(key), {immediate: true});

watch(() => useUrlStore().current, refresh);

function refresh() {
    handler(activeKey.value);
}

function handler(url: string) {
    // 清空数据
    columns.value = new Array<TableColumnData>();
    records.value = new Array<TableData>();
    width.value = 0;
    // 未选择链接不处理
    if (useUrlStore().current.trim() === '') {
        return;
    }
    loading.value = true;
    cat(url).then(data => {
        columns.value = data.columns;
        records.value = data.records;
        width.value = data.width;
    }).catch(e => MessageUtil.error("获取数据失败！", e))
        .finally(() => loading.value = false);
}

function jumpTo() {
    useSeniorSearchStore().loadEvent({
        method: 'GET',
        link: activeKey.value,
    })
}

</script>
<style scoped lang="less">
.dashboard-cat {
    position: absolute;
    top: 0;
    left: 7px;
    right: 7px;
    bottom: 7px;

    .container {
        position: absolute;
        top: 43px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
}
</style>
