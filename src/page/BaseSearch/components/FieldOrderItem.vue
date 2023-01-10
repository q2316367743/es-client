<template>
    <el-select v-model="order.field" filterable
               :placeholder="$t('base_search.select_placeholder')"
               style="margin-left: 10px">
        <el-option v-for="(field, idx1) in fields" :key="idx1" :label="field.name"
                   :value="field.name"></el-option>
    </el-select>
    <el-select v-model="order.type" filterable
               :placeholder="$t('base_search.select_placeholder')"
               style="margin-left: 10px">
        <el-option label="asc" value="asc"></el-option>
        <el-option label="desc" value="desc"></el-option>
    </el-select>
    <el-button type="primary" style="margin-left: 10px" @click="add">{{
            $t('base_search.add')
        }}
    </el-button>
    <el-button type="danger" @click="remove(order.id)">{{
            $t('base_search.remove')
        }}
    </el-button>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseOrder from "@/domain/BaseOrder";
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