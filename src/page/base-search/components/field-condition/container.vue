<template>
    <div class="field-condition-container">
        <div v-if="conditions.length === 0">
            <a-button type="primary" @click="add()">{{ $t('common.operation.add') }}
            </a-button>
        </div>
        <div v-for="(_item, idx) in conditions" :key="_item.id" style="margin-bottom: 10px;">
            <field-condition-item v-model="conditions[idx]" :index="idx" @add="add" @remove="remove"
                                  @edit-text-area="editTextArea"/>
        </div>
        <a-modal v-model:visible="condition.dialog" title="请输入terms条件" render-to-body unmount-on-close draggable
                 :mask-closable="false" :footer="false">
            <codemirror v-model="conditions[condition.index].value" placeholder="请在这里输入查询条件，内容为json字符串。"
                        :style="{ height: '400px' }" :autofocus="true" :indent-with-tab="true" :tabSize="4"
                        :extensions="extensions"/>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {markRaw, ref, watch} from "vue";
import {Codemirror} from 'vue-codemirror';
import {json} from '@codemirror/lang-json';

import FieldConditionItem from "./item.vue";
import BaseQuery from "@/entity/BaseQuery";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

const conditions = ref<Array<BaseQuery>>(new Array<BaseQuery>());
const condition = ref({
    dialog: false,
    index: 0
});
const extensions = markRaw<Array<any>>([json()]);

watch(() => conditions.value,
    value => useBaseSearchStore().setCurrentCondition(value),
    {deep: true})

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
