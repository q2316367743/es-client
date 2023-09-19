<template>
    <div class="display-history">
        <a-result status="404" title="历史记录" subtitle="正在施工中，敬请期待"></a-result>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {SeniorSearchHistoryIndex} from "@/entity/history/SeniorSearchHistory";

const items = ref<Array<SeniorSearchHistoryIndex>>(new  Array<SeniorSearchHistoryIndex>());

</script>
<style scoped>

</style>
