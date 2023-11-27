<template>
    <a-button type="text" @click="showBody()">
        显示查询条件
    </a-button>
</template>
<script lang="ts" setup>
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import MessageUtil from "@/utils/MessageUtil";
import {showJson} from "@/utils/DialogUtil";


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
