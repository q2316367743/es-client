<template>
    <div class="field-condition-container">
        <div v-if="conditions.length === 0">
            <a-button type="primary" @click="init">{{ $t('common.operation.add') }}
            </a-button>
        </div>
        <div v-for="(item, idx) in conditions" :key="idx" style="margin-bottom: 10px;">
            <field-condition-item v-model="conditions[idx]" :fields="fields" :index="idx" @add="add" @remove="remove"
                @edit-text-area="editTextArea" />
        </div>
        <a-modal v-model:visible="condition.dialog" title="请输入terms条件" render-to-body unmount-on-close draggable
            :mask-closable="false" :footer="false">
            <!-- @ts-ignore -->
            <codemirror v-model="conditions[condition.index].value" placeholder="请在这里输入查询条件" :style="{ height: '400px' }"
                :autofocus="true" :indent-with-tab="true" :tabSize="4" :extensions="extensions" />
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';

import FieldConditionItem from "@/page/BaseSearch/FieldCondition/FieldConditionItem.vue";
import BaseQuery from "@/entity/BaseQuery";
import Field from "@/view/Field";

export default defineComponent({
    name: 'field-condition-container',
    components: { FieldConditionItem, Codemirror },
    props: {
        modelValue: Object as PropType<Array<BaseQuery>>,
        fields: Object as PropType<Array<Field>>
    },
    data: () => ({
        conditions: new Array<BaseQuery>,
        condition: {
            dialog: false,
            index: 0
        },
        extensions: [json()] as Array<any>
    }),
    watch: {
        modelValue(newValue: Array<BaseQuery>) {
            this.conditions = newValue;
        },
        conditions: {
            handler(newValue: Array<BaseQuery>) {
                this.$emit('update:modelValue', newValue);
            },
            deep: true
        }
    },
    methods: {
        init() {
            this.conditions.push({
                id: new Date().getTime(),
                type: 'must',
                field: '',
                condition: 'term',
                value: '',
                isEnable: true
            });
        },
        add() {
            this.conditions.push({
                id: new Date().getTime(),
                type: 'must',
                field: '',
                condition: 'term',
                value: '',
                isEnable: true
            });
        },
        remove(id: number) {
            if (this.conditions.length === 0) {
                return;
            }
            this.conditions.splice(this.conditions.findIndex(item => item.id === id), 1);
        },
        editTextArea(index: number) {
            this.condition.dialog = true;
            this.condition.index = index;
        }
    }
});
</script>
<style scoped>
.field-condition-container {
    display: block;
}
</style>