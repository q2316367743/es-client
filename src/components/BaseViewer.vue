<!-- 基础视图 -->
<template>
    <code style="font-size: 14px;">
        <pre style="margin-left: 12px;margin-right: 12px;">{{ data }}</pre>
    </code>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        data: {
            required: false,
            default: '暂无内容',
            type: Object
        }
    },
    data: () => ({
        content: ''
    }),
    created() {
        try {
            this.content = JSON.stringify(this.data, null, 4);
        } catch {
            this.content = String(this.data);
        }
    }
});
</script>
<style scoped>
</style>