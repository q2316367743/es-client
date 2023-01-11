<template>
    <div class="json-view">
        <pre>
            <code class="language-json" ref="jsonView" v-html="value"></code>
        </pre>
        <el-button type="primary" link class="json-view-copy" @click="copy">复制</el-button>
    </div>

</template>
<script lang="ts">
import {defineComponent} from "vue";
import highlight from 'highlight.js';
import BrowserUtil from "@/utils/BrowserUtil";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'json-view',
    props: {
        data: Object
    },
    data: () => ({
        value: ''
    }),
    watch: {
        data() {
            this.value = JSON.stringify(this.data, null, 4);
            this.$nextTick(() => {
                let jsonView = this.$refs['jsonView'] as HTMLElement;
                highlight.highlightElement(jsonView);
            })
        }
    },
    created() {
        this.value = JSON.stringify(this.data, null, 4);
        this.$nextTick(() => {
            let jsonView = this.$refs['jsonView'] as HTMLElement;
            highlight.highlightElement(jsonView);
        })
    },
    methods: {
        copy() {
            BrowserUtil.copy(this.value);
            ElMessage({
                showClose: true,
                type: "success",
                message: '已复制到剪切板'
            })
        }
    }
});
</script>
<style scoped lang="less">
.json-view {
    position: relative;

    .json-view-copy {
        position: absolute;
        top: 30px;
        right: 20px;
    }
}
</style>