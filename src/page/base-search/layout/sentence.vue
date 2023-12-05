<template>
    <div class="base-search-condition-sentence">
        <show-query-condition/>
        <a-button type="text" @click="jumpToSeniorSearch()">
            跳转到高级查询
        </a-button>
        <a-button type="text" @click="execCopy()">
            复制到剪切板
        </a-button>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import ShowQueryCondition from "@/page/base-search/components/tool/ShowQueryCondition.vue";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

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

</script>
<style scoped>

</style>
