<!-- 基础视图 -->
<template>
    <code class="base-viewer">
        <pre class="base-viewer-show">{{ data }}</pre>
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
.base-viewer {
    font-size: 14px;
}

.base-viewer-show {
    margin-left: 12px;
    margin-right: 12px;
}
</style>