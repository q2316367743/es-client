<template>
    <div v-if="conditions.length === 0">
        <a-button type="primary" @click="init">{{ $t('common.operation.add') }}
        </a-button>
    </div>
    <div v-for="(item, idx) in conditions" :key="idx"
         style="margin-bottom: 10px;display: flex;">
        <field-condition-item v-model="conditions[idx]" :fields="fields"
                              @add="add" @remove="remove"/>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import FieldConditionItem from "@/page/BaseSearch/FieldCondition/FieldConditionItem.vue";
import BaseQuery from "@/entity/BaseQuery";
import Field from "@/view/Field";

export default defineComponent({
    name: 'field-condition-container',
    components: {FieldConditionItem},
    props: {
        modelValue: Object as PropType<Array<BaseQuery>>,
        fields: Object as PropType<Array<Field>>
    },
    data: () => ({
        conditions: new Array<BaseQuery>
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
                value: ''
            });
        },
        add() {
            this.conditions.push({
                id: new Date().getTime(),
                type: 'must',
                field: '',
                condition: 'term',
                value: ''
            });
        },
        remove(id: number) {
            if (this.conditions.length === 0) {
                return;
            }
            this.conditions.splice(this.conditions.findIndex(item => item.id === id), 1);
        },
    }
});
</script>
<style scoped>

</style>