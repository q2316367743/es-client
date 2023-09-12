<template>
    <div class="file-order-container">
        <div v-if="orders.length === 0">
            <a-button type="primary" @click="add()">
                新增
            </a-button>
        </div>
        <div style="display: flex;margin-bottom: 10px;width: 100%;" v-for="(_order, idx) in orders" :key="idx">
            <field-order-item v-model="orders[idx]" @add="add" @remove="remove"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import FieldOrderItem from "./item.vue";
import BaseOrder from "@/entity/BaseOrder";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

const orders = ref<Array<BaseOrder>>(new Array<BaseOrder>());

watch(() => orders.value, value => useBaseSearchStore().setCurrentOrders(value), {deep: true});

const add = () => orders.value.push({
    id: new Date().getTime(),
    field: '',
    type: 'asc',
    isEnable: true
});

const remove = (id: number) => {
    if (orders.value.length === 0) {
        return;
    }
    orders.value = orders.value.filter((item) => {
        return item.id !== id;
    });
}

orders.value = useBaseSearchStore().current.orders;

</script>
<style scoped></style>
