<template>
    <div class="dashboard-cat abs-07">
        <a-spin dot tip="数据加载中..." :loading="loading">
            <div class="header">
                <a-input-group>
                    <a-select v-model="activeKey" allow-search>
                        <a-option v-for="tab in tabs" :key="tab.key" :value="tab.key">
                            {{ tab.title }}
                        </a-option>
                    </a-select>
                    <a-select v-model="index" allow-search v-if="needIndex" allow-clear>
                        <a-option v-for="idx in indices" :key="idx" :value="idx">{{ idx }}</a-option>
                    </a-select>
                </a-input-group>
                <div>
                    <a-tooltip content="跳转到高级查询" position="br">
                        <a-button type="text" @click="jumpTo()">
                            <template #icon>
                                <icon-filter/>
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-button type="text" @click="refresh()" :loading="loading">
                        <template #icon>
                            <icon-refresh/>
                        </template>
                    </a-button>
                </div>
            </div>
            <a-table :columns="columns" :data="records" :virtual-list-props="virtualListProps" :pagination="false"
                     :scroll="{minWidth: width}"/>
        </a-spin>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {TableColumnData, TableData} from "@arco-design/web-vue";
import {useWindowSize} from "@vueuse/core";
import {cat, tabs} from "@/page/dashboard/Cat/func";
import MessageUtil from "@/utils/MessageUtil";
import useUrlStore from "@/store/UrlStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {useRouter} from "vue-router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import useIndexStore from "@/store/IndexStore";
import {statistics} from "@/global/BeanFactory";

const size = useWindowSize();
const router = useRouter();

const loading = ref(false);

const activeKey = ref('/_cat/allocation?v');
const index = ref('');

const columns = ref(new Array<TableColumnData>());
const records = ref(new Array<TableData>());
const width = ref(0);

const virtualListProps = computed(() => ({
    height: size.height.value - 90 - 36 - 4
}));
const indices = computed(() => useIndexStore().indices.map(e => e.name));
const needIndex = computed(() => activeKey.value.indexOf('{index}') > -1);

watch(() => activeKey.value, (key) => handler(key), {immediate: true});
watch(() => index.value, refresh);

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
    // 需要索引，但是没选择
    if (needIndex.value) {
        if (index.value === '') {
            return;
        }else {
            url = url.replace('{index}', index.value);
        }
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
    router.push(PageNameEnum.SENIOR_SEARCH);
    useSeniorSearchStore().loadEvent({
        method: 'GET',
        link: activeKey.value,
    }, false);
}

statistics.access("功能统计", "仪表盘-_cat");
</script>
<style scoped lang="less">
.dashboard-cat {

    .header {
        display: flex;
        justify-content: space-between;
        padding: 7px 0;
    }

}
</style>
