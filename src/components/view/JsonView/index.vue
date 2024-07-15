<template>
    <div class="json-view hljs" :style="{ fontSize: Optional.ofNullable(jsonFontSize).orElse(16) + 'px' }">
        <pre class="language-json hljs" v-html="pretty"></pre>
        <a-button v-if="copy" type="text" link class="json-view-copy" @click="execCopy">复制</a-button>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {highlight} from '@/global/BeanFactory';
import {mapState} from "pinia";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import Optional from "@/utils/Optional";
import {jsonFormat} from "@/algorithm/json";
import MessageUtil from "@/utils/MessageUtil";
import {JSON_REGEX} from "@/data/EsUrl";

export default defineComponent({
    name: 'json-view',
    props: {
        value: {
            type: [Object, String],
            default: '{}'
        },
        copy: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: () => ({
        pretty: '',
        origin: '',
        Optional
    }),
    computed: {
        ...mapState(useGlobalSettingStore, ['jsonFontSize'])
    },
    watch: {
        value(value) {
            this.pretty = this.render(value);
        }
    },
    created() {
        this.pretty = this.render(this.value);
    },
    methods: {
        execCopy() {
            utools.copyText(this.origin);
            MessageUtil.success("成功复制到剪切板");
        },
        render(data: object | string): string {
            let value = '';
            let needPretty = true;
            if (typeof data === 'string') {
                if (JSON_REGEX.test(data)) {
                    try {
                        value = jsonFormat(data)
                    }catch (e) {
                        MessageUtil.error("格式化JSON失败", e);
                        value = this.value as string;
                        needPretty = false;
                    }
                } else {
                    value = this.value as string;
                    needPretty = false;
                }
            } else if (typeof data === 'object'){
                value = JSON.stringify(data, null, 4);
            }else {
                value = '';
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
