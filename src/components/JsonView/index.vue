<template>
    <div class="json-view hljs">
        <pre>
            <code class="language-json hljs" v-html="value"></code>
        </pre>
        <el-button v-if="copy" type="primary" link class="json-view-copy" @click="execCopy">复制</el-button>
    </div>

</template>
<script lang="ts">
import {defineComponent} from "vue";
import {highlight} from '@/global/BeanFactory';
import BrowserUtil from "@/utils/BrowserUtil";

export default defineComponent({
    name: 'json-view',
    props: {
        data: Object,
        copy: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: () => ({
        value: ''
    }),
    watch: {
        data() {
            let value = JSON.stringify(this.data, null, 4);
            if (value !== '') {
                this.$nextTick(() => {
                    let highlightResult = highlight.highlight(value, {
                        language: 'json'
                    });
                    this.value = highlightResult.value;
                })
            }
        }
    },
    created() {
        let value = JSON.stringify(this.data, null, 4);
        if (value !== '') {
            this.$nextTick(() => {
                let highlightResult = highlight.highlight(value, {
                    language: 'json'
                });
                this.value = highlightResult.value;
            })
        }
    },
    methods: {
        execCopy() {
            BrowserUtil.copy(this.value);
        }
    }
});
</script>
<style scoped lang="less">
.json-view {
    position: relative;

    .json-view-copy {
        position: absolute;
        top: 12px;
        right: 20px;
    }

    .hljs {
        padding-top: 0;
    }
}
</style>