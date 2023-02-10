<template>
    <a-select v-model="order.field" filterable
               :placeholder="$t('baseSearch.placeholder.order')"
               style="margin-left: 10px">
        <a-option v-for="(field, idx1) in fields" :key="idx1" :label="field.name"
                   :value="field.name"></a-option>
    </a-select>
    <a-select v-model="order.type" filterable
               :placeholder="$t('baseSearch.placeholder.order')"
               style="margin-left: 10px;width: 80px;">
        <a-option label="asc" value="asc"></a-option>
        <a-option label="desc" value="desc"></a-option>
    </a-select>
    <a-button type="primary" style="margin-left: 10px" @click="add">{{
            $t('common.operation.add')
        }}
    </a-button>
    <a-button type="danger" @click="remove(order.id)">{{
            $t('common.operation.delete')
        }}
    </a-button>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseOrder from "@/entity/BaseOrder";
import Field from "@/view/Field";

export default defineComponent({
    name: 'field-order-item',
    emits: ['update:modelValue', 'add', 'remove'],
    props: {
        modelValue: Object as PropType<BaseOrder>,
        fields: Array<Field>
    },
    data: () => ({
        order: {
            id: new Date().getTime(),
            field: '',
            type: ''
        } as BaseOrder
    }),
    created() {
        if (this.modelValue) {
            this.order = this.modelValue;
        }
    },
    watch: {
        modelValue(newValue: BaseOrder) {
            this.order = newValue;
        },
        order: {
            handler(newValue: BaseOrder) {
                this.$emit('update:modelValue', newValue);
            },
            deep: true
        }
    },
    methods: {
        add() {
            this.$emit('add');
        },
        remove(id: number) {
            this.$emit('remove', id);
        }
    }
});
</script>
<style scoped>

</style>