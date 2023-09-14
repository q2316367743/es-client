<template>
    <a-button type="primary" status="warning" @click="load" title="历史">
        <template #icon>
            <icon-history/>
        </template>
    </a-button>
    <a-drawer v-model:visible="visible" width="60%" render-to-body unmount-on-close :footer="false"
              popup-container="#main">
        <template #header>
            <h2>恢复</h2>
            <a-radio-group v-model="tab" type="button" style="margin-left: 14px;">
                <a-radio value="1">历史记录</a-radio>
                <a-radio value="2">历史存储</a-radio>
            </a-radio-group>
        </template>
        <bs-restore-record v-show="tab === '1'" />
        <bs-restore-history v-show="tab === '2'"/>
    </a-drawer>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import BsRestoreHistory from "./bs-restore-history.vue";
import BsRestoreRecord from "@/page/base-search/components/History/bs-restore-record.vue";

const visible = ref(false);
const tab = ref("1");

const load = () => visible.value = true

</script>
<style scoped lang="less">
</style>
