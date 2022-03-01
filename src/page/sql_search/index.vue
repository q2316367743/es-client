<template>
    <el-card class="sql-search">
        <template #header>{{ $t('app.menu.sql_search') }}</template>
        <el-empty description="敬请期待"></el-empty>
    </el-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data: () => ({

    }),
});
</script>
<style lang="less">
.sql-search {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
}
</style>