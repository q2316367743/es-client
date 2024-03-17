<template>
    <div class="field-condition-container">
        <div v-if="conditions.length === 0">
            <a-button type="primary" @click="add()">新增</a-button>
        </div>
        <div v-for="(_item, idx) in conditions" :key="_item.id" style="margin-bottom: 10px;">
            <field-condition-item v-model="conditions[idx]" :index="idx" @add="add" @remove="remove"
                                  @edit-text-area="editTextArea"/>
        </div>
        <a-modal v-model:visible="condition.dialog" title="请输入terms条件" render-to-body unmount-on-close draggable
                 :mask-closable="false" :footer="false">
            <monaco-editor v-model="conditions[condition.index].value" language="json" height="200px"/>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";

import FieldConditionItem from "./item.vue";
import {BaseQuery} from "@/entity/BaseQuery";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import MonacoEditor from "@/components/monaco-editor/index.vue";

const conditions = ref<Array<BaseQuery>>(new Array<BaseQuery>());
const condition = ref({
    dialog: false,
    index: 0
});

watch(() => conditions.value,
    value => useBaseSearchStore().setCurrentCondition(value),
    {deep: true})

watch(() => useBaseSearchStore().current.conditions,
    value => conditions.value = value,
    {deep: true});

conditions.value = useBaseSearchStore().current.conditions;

function add() {
    conditions.value.push({
        id: new Date().getTime(),
        type: 'must',
        field: '',
        condition: 'term',
        value: '',
        isEnable: true
    });
}

function remove(id: number) {
    if (conditions.value.length === 0) {
        return;
    }
    conditions.value.splice(conditions.value.findIndex(item => item.id === id), 1);
}

function editTextArea(index: number) {
    condition.value.dialog = true;
    condition.value.index = index;
}

</script>
<style scoped>
.field-condition-container {
    display: block;
}
</style>
