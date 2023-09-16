<template>
    <div class="senior-search-filter">
        <a-input v-model="filter" placeholder="JS过滤；示例 “.hiis.hits”、“.hiis.hits[0]”、“.hiis.hits.map(e => e._id)”">
            <template #prepend>
                this
            </template>
        </a-input>
        <a-button-group type="text" size="large">
            <a-button>
                <template #icon>
                    <icon-play-arrow/>
                </template>
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

const filter = ref(useSeniorSearchStore().filter);

watch(() => filter.value, value => useSeniorSearchStore().updateFilter(value));
watch(() => useSeniorSearchStore().filter, value => filter.value = value);

</script>
<style scoped>

</style>
