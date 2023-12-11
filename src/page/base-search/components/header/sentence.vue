<template>
    <a-tooltip content="显示查询条件" position="bottom">
        <a-button type="dashed" @click="showBody()">
            <template #icon>
                <icon-search />
            </template>
        </a-button>
    </a-tooltip>
    <a-tooltip content="跳转到高级查询" position="bottom">
        <a-button type="dashed" @click="jumpToSeniorSearch()">
            <template #icon>
                <icon-filter />
            </template>
        </a-button>
    </a-tooltip>
    <a-tooltip content="复制到剪切板" position="bottom">
        <a-button type="dashed" @click="execCopy()">
            <template #icon>
                <icon-copy/>
            </template>
        </a-button>
    </a-tooltip>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {showJson} from "@/utils/DialogUtil";

const current = computed(() => useBaseSearchStore().current);

function jumpToSeniorSearch() {
    if (!current.value.index) {
        MessageUtil.warning("请选择索引再跳转。");
        return;
    }
    try {
        useSeniorSearchStore().loadEvent({
            link: `/${current.value.index}/_search`,
            method: 'POST',
            body: JSON.stringify(
                QueryConditionBuild(current.value.conditions, current.value.page, current.value.size, current.value.orders),
                null,
                4)
        });
    } catch (e) {
        MessageUtil.error('条件构造错误', e);
    }
}

function execCopy() {
    utools.copyText(JSON.stringify(QueryConditionBuild(current.value.conditions, current.value.page, current.value.size, current.value.orders)));
    MessageUtil.success("已成功复制到剪切板");
}

function showBody() {
    try {
        let current = useBaseSearchStore().current;
        showJson("查询条件", QueryConditionBuild(current.conditions,
            current.page,
            current.size,
            current.orders));
    } catch (e) {
        MessageUtil.error('条件构造错误', e);
    }
}

</script>
<style scoped>

</style>
