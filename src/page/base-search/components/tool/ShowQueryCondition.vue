<template>
    <a-button type="text" @click="showBody">
        {{ $t('baseSearch.form.displayQueryStatement') }}
    </a-button>
    <a-modal :title="$t('baseSearch.dialog.statement')" v-model:visible="condition.dialog" width="70%"
             render-to-body class="es-dialog" :mask-closable="false">
        <json-view :data="condition.data"/>
    </a-modal>
</template>
<script lang="ts" setup>
import JsonView from "@/components/JsonView/index.vue";
import {ref} from "vue";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import MessageUtil from "@/utils/MessageUtil";

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
