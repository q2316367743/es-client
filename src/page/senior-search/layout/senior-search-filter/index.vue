<template>
    <div class="senior-search-filter">
        <a-auto-complete v-model="filter" :data="seniorFilterRecords" allow-clear
                         placeholder="JS过滤；示例 “.hiis.hits”、“.hiis.hits[0]”、“.hiis.hits.map(e => e._id)”"
        @clear="clearFilter()">
            <template #prepend>
                this
            </template>
        </a-auto-complete>
        <a-button-group type="text" size="large">
            <a-tooltip content="执行过滤">
                <a-button status="success" @click="execFilter()" style="border: none;">
                    <template #icon>
                        <icon-play-arrow/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="清除过滤器" position="tr">
                <a-button status="danger" @click="clearFilter()">
                    <template #icon>
                        <icon-delete/>
                    </template>
                </a-button>
            </a-tooltip>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {useSeniorFilterRecordStore} from "@/store/record/SeniorFilterRecordStore";

const filter = ref(useSeniorSearchStore().filter);

watch(() => filter.value, value => useSeniorSearchStore().updateFilter(value));
watch(() => useSeniorSearchStore().filter, value => filter.value = value);

const seniorFilterRecords = computed(() => useSeniorFilterRecordStore().seniorFilterRecords);

const execFilter = () => useSeniorSearchStore().execFilter();
const clearFilter = () => useSeniorSearchStore().clearFilter();

</script>
<style scoped>

</style>
