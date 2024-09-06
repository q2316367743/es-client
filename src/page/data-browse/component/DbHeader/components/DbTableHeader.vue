<template>
    <a-trigger trigger="click" :unmount-on-close="false" position="br">
        <db-simple-item :disable="type === ''" tip="筛选">
            <icon-select-all/>
        </db-simple-item>
        <template #content>
            <div class="table-view-trigger">
                <a-list style="width: 250px">
                    <template #header>
                        <a-button long status="danger" type="primary" size="small" @click="useDbResultResetColumn()">重置
                        </a-button>
                    </template>
                    <a-scrollbar style="height: 341px;overflow: auto;width: 250px;">
                            <div v-for="column in useDbResultColumns" style="width: 240px;margin: 5px 5px;">
                                <a-checkbox v-model="column.show">{{ column.title }}</a-checkbox>
                            </div>
                    </a-scrollbar>
                </a-list>
            </div>
        </template>
    </a-trigger>
</template>
<script lang="ts" setup>
import DbSimpleItem from "@/page/data-browse/component/DbSimpleItem.vue";
import {computed} from "vue";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {useDbResultColumns, useDbResultResetColumn} from "@/page/data-browse/store/DbResultStore";

const type = computed(() => useDataBrowseStore().type);
</script>
<style scoped lang="less">

</style>
