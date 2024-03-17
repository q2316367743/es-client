<template>
    <!-- 是否启用 -->
    <a-switch :checked-value="true" :unchecked-value="false" type="round" v-model="order.isEnable"
              checked-color="rgb(var(--green-6))" unchecked-color="rgb(var(--red-6))" style="margin: 4px 10px 4px 0;">
        <template #checked>启用</template>
        <template #unchecked>禁用</template>
    </a-switch>
    <a-select v-model="order.field" allow-search allow-create allow-clear placeholder="请选择排序字段"
              style="width: 250px;">
        <a-option v-for="(field, idx1) in fields" :key="idx1" :label="field.name" :value="field.name"></a-option>
    </a-select>
    <a-select v-model="order.type" filterable placeholder="请选择排序条件"
              style="margin-left: 10px;width: 80px;">
        <a-option label="asc" value="asc"></a-option>
        <a-option label="desc" value="desc"></a-option>
    </a-select>
    <a-button type="primary" style="margin-left: 10px" @click="add()">
        <template #icon>
            <icon-plus/>
        </template>
    </a-button>
    <a-button type="primary" status="danger" @click="remove(order.id)">
        <template #icon>
            <icon-minus/>
        </template>
    </a-button>
    <a-button type="primary" status="success" style="margin-left:10px;margin-right: 20px;" @click="search()">
        <template #icon>
            <icon-search/>
        </template>
    </a-button>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseOrder from "@/entity/BaseOrder";
import {mapState} from "pinia";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

export default defineComponent({
    name: 'field-order-item',
    emits: ['update:modelValue', 'add', 'remove'],
    props: {
        modelValue: Object as PropType<BaseOrder>,
    },
    data: () => ({
        order: {
            id: new Date().getTime(),
            field: '',
            type: 'asc'
        } as BaseOrder
    }),
    computed: {
        ...mapState(useBaseSearchStore, ['fields'])
    },
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
        },
        search() {
            useBaseSearchStore().search();
        }
    }
});
</script>
<style scoped></style>
