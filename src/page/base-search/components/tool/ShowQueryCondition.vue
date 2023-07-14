<template>
    <a-button type="text" @click="showBody">
        {{ $t('baseSearch.form.displayQueryStatement') }}
    </a-button>
    <json-dialog v-model:value="condition.dialog" :title="$t('baseSearch.dialog.statement')" :json="condition.data"/>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import MessageUtil from "@/utils/MessageUtil";
import JsonDialog from "@/components/json-dialog/index.vue";

const condition = ref({
    dialog: false,
    data: {}
})

function showBody() {
    try {
        let current = useBaseSearchStore().current;
        condition.value = {
            dialog: true,
            data: QueryConditionBuild(current.conditions,
                    current.page,
                    current.size,
                    current.orders)
        }
    } catch (e) {
        MessageUtil.error('条件构造错误', e);
    }
}
</script>
<style scoped>

</style>
