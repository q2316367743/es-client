<template>
    <div class="json-view hljs" :style="{ fontSize: Optional.ofNullable(jsonFontSize).orElse(16) + 'px' }">
        <pre class="language-json hljs" v-html="value"></pre>
        <a-button v-if="copy" type="text" link class="json-view-copy" @click="execCopy">复制</a-button>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {highlight} from '@/global/BeanFactory';
import {mapState} from "pinia";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import Optional from "@/utils/Optional";
import {jsonFormat} from "@/algorithm/jsonFormat";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'json-view',
    props: {
        data: [Object, String],
        copy: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: () => ({
        value: '',
        origin: '',
        Optional
    }),
    computed: {
        ...mapState(useGlobalSettingStore, ['jsonFontSize'])
    },
    watch: {
        data(value) {
            this.value = this.render(value);
        }
    },
    created() {
        this.value = this.render(this.data);
    },
    methods: {
        execCopy() {
            utools.copyText(this.origin);
            MessageUtil.success("成功复制到剪切板");
        },
        render(data: any): string {
            let value = '';
            let needPretty = true;
            if (typeof data === 'string') {
                if (/^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/.test(data)) {
                    try {
                        value = jsonFormat(data)
                    }catch (e) {
                        MessageUtil.error("格式化JSON失败", e);
                        value = this.data as string;
                        needPretty = false;
                    }
                } else {
                    value = this.data as string;
                    needPretty = false;
                }
            } else {
                value = JSON.stringify(data, null, 4);
            }
            // 原始值
            this.origin = value;
            if (needPretty && value !== '') {
                let highlightResult = highlight.highlight(value, {
                    language: 'json'
                });
                return highlightResult.value;
            }else {
                return value
            }
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
