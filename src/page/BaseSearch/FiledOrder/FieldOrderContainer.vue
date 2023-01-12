<template>
    <div v-if="orders.length === 0">
        <el-button type="primary" @click="orderInit">{{ $t('base_search.add') }}
        </el-button>
    </div>
    <div style="display: flex;margin-bottom: 10px;width: 100%;" v-for="(order, idx) in orders"
         :key="idx">
        <field-order-item v-model="orders[idx]" :fields="fields" @add="add" @remove="remove"/>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import FieldOrderItem from "@/page/BaseSearch/FiledOrder/FieldOrderItem.vue";
import Field from "@/view/Field";
import BaseOrder from "@/domain/BaseOrder";

export default defineComponent({
    name: 'field-order-container',
    components: {FieldOrderItem},
    props: {
        modelValue: Object as PropType<Array<BaseOrder>>,
        fields: Object as PropType<Array<Field>>
    },
    data: () => ({
        orders: new Array<BaseOrder>()
    }),
    watch: {
        modelValue(newValue: Array<BaseOrder>) {
            this.orders = newValue;
        },
        orders: {
            handler(newValue: Array<BaseOrder>) {
                this.$emit('update:modelValue', newValue);
            },
            deep: true
        }
    },
    methods: {
        orderInit() {
            this.orders.push({
                id: new Date().getTime(),
                field: '',
                type: 'asc'
            });
        },
        add() {
            this.orders.push({
                id: new Date().getTime(),
                field: '',
                type: 'asc'
            });
        },
        remove(id: number) {
            if (this.orders.length === 0) {
                return;
            }
            this.orders = this.orders.filter((item) => {
                return item.id !== id;
            });
        },
    }
});
</script>
<style scoped>

</style>