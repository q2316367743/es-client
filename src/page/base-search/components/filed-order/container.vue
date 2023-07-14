<template>
    <div class="file-order-container">
        <div v-if="orders.length === 0">
            <a-button type="primary" @click="add">{{ $t('common.operation.add') }}
            </a-button>
        </div>
        <div style="display: flex;margin-bottom: 10px;width: 100%;" v-for="(_order, idx) in orders" :key="idx">
            <field-order-item v-model="orders[idx]" @add="add" @remove="remove" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import FieldOrderItem from "./item.vue";
import BaseOrder from "@/entity/BaseOrder";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";


export default defineComponent({
    name: 'field-order-container',
    components: { FieldOrderItem },
    data: () => ({
        orders: new Array<BaseOrder>()
    }),
    watch: {
        orders: {
            handler(newValue: Array<BaseOrder>) {
                useBaseSearchStore().setCurrentOrders(newValue);
            },
            deep: true
        }
    },
    methods: {
        add() {
            this.orders.push({
                id: new Date().getTime(),
                field: '',
                type: 'asc',
                isEnable: true
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
<style scoped></style>
