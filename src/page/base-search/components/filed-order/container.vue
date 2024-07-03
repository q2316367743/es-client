<template>
    <div class="file-order-container">
        <div v-if="current.orders.length === 0">
            <a-button type="primary" @click="add()">
                新增
            </a-button>
        </div>
        <div style="display: flex;margin-bottom: 10px;width: 100%;" v-for="(_order, idx) in current.orders" :key="_order.id">
            <field-order-item v-model="current.orders[idx]" @add="add" @remove="remove"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import FieldOrderItem from "./item.vue";
import {current} from "@/store/components/BaseSearchStore";


const add = () => current.value.orders.push({
    id: new Date().getTime(),
    field: '',
    type: 'asc',
    isEnable: true
});

const remove = (id: number) => {
    if (current.value.orders.length === 0) {
        return;
    }
    current.value.orders = current.value.orders.filter((item) => {
        return item.id !== id;
    });
}


</script>
<style scoped></style>
