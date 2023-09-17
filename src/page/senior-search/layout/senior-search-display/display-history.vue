<template>
    <div class="display-history">
        历史记录
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {SeniorSearchHistoryIndex} from "@/entity/history/SeniorSearchHistory";

const items = ref<Array<SeniorSearchHistoryIndex>>(new  Array<SeniorSearchHistoryIndex>());

</script>
<style scoped>

</style>
