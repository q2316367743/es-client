<template>
    <div>
        <el-empty v-if="is_error" description="结果集解析错误" />
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        hits: Object as PropType<any>
    },
    data: () => ({
        is_error: false,
    }),
    watch: {
        hits() {
            // 当变化时，进行渲染
            // 扁平化数据
            // 扁平化表头
        }
    }
});
</script>
<style scoped>
</style>