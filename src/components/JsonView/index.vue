<template>
    <div class="json-view hljs">
        <pre>
            <code class="language-json hljs" v-html="value"></code>
        </pre>
        <a-button v-if="copy" type="text" link class="json-view-copy" @click="execCopy">复制</a-button>
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
        value: '',
        pretty: ''
    }),
    watch: {
        data() {
            let value = JSON.stringify(this.data, null, 4);
            this.pretty = value;
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
        this.pretty = value;
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
            BrowserUtil.copy(this.pretty);
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