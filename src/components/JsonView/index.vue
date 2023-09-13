<template>
    <div class="json-view hljs" :style="{ fontSize: Optional.ofNullable(jsonFontSize).orElse(16) + 'px' }">
        <pre class="language-json hljs" v-html="value"></pre>
        <a-button v-if="copy" type="text" link class="json-view-copy" @click="execCopy">复制</a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { highlight } from '@/global/BeanFactory';
import { mapState } from "pinia";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import Optional from "@/utils/Optional";

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
        pretty: '',
        Optional
    }),
    computed: {
        ...mapState(useGlobalSettingStore, ['jsonFontSize'])
    },
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
            utools.copyText(this.pretty);
        }
    }
});
</script>
<style lang="less">
.json-view {
    position: relative;

    .json-view-copy {
        position: absolute;
        top: 12px;
        right: 20px;
    }

    .hljs {
        padding-top: 0;

        span {
            cursor: text;
        }
    }
}
</style>
