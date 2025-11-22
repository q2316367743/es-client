<template>
    <div class="field-condition-container">
        <div v-if="current.conditions.length === 0">
            <a-button type="primary" @click="add()">新增</a-button>
        </div>
        <div v-for="(_item, idx) in current.conditions" :key="_item.id" style="margin-bottom: 10px;">
            <field-condition-item v-model="current.conditions[idx]" :index="idx" @add="add" @remove="remove"
                                  @edit-text-area="editTextArea"/>
        </div>
        <a-modal v-model:visible="condition.dialog" title="请输入terms条件" render-to-body unmount-on-close draggable
                 :mask-closable="false" :footer="false">
            <monaco-editor v-model="current.conditions[condition.index].value" language="json" height="200px"/>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import FieldConditionItem from "./item.vue";
import {current} from "@/store/components/BaseSearchStore";
import MonacoEditor from "@/components/monaco-editor/index.vue";

const condition = ref({
    dialog: false,
    index: 0
});


function add() {
    current.value.conditions.push({
        id: new Date().getTime(),
        type: 'must',
        field: '',
        condition: 'term',
        value: '',
        isEnable: true
    });
}

function remove(id: number) {
    if (current.value.conditions.length === 0) {
        return;
    }
    current.value.conditions.splice(current.value.conditions.findIndex(item => item.id === id), 1);
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
