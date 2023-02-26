<template>
    <div class="senior-search-data-view">
        <a-scrollbar class="scrollbar">
            <pre :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }"
                class="language-json hljs" v-html="value" v-if="view === ViewTypeEnum.JSON"></pre>
            <json-viewer v-else-if="view === ViewTypeEnum.JSON_TREE" :value="data" :expand-depth=5 :copyable="copyable" sort
                preview-mode theme="es-awesome-json-theme" style="margin-top: 8px;" />
        </a-scrollbar>
        <table-viewer v-if="view === ViewTypeEnum.TABLE" :data="data" />
        <a-button type="text" link class="senior-search-json-view-copy" v-show="view === ViewTypeEnum.JSON"
            @click="execCopy">复制</a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from 'vue-json-viewer';
import { mapState } from "pinia";

import { highlight } from '@/global/BeanFactory';
import BrowserUtil from "@/utils/BrowserUtil";
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default defineComponent({
    name: 'senior-search-data-view',
    components: { JsonViewer },
    props: {
        view: Number,
        data: Object,
    },
    data: () => ({
        value: '',
        pretty: '',
        copyable: { copyText: "复制", copiedText: "复制成功", timeout: 2000 },
        Optional,
        ViewTypeEnum
    }),
    computed: {
        ...mapState(useSettingStore, ['instance'])
    },
    watch: {
        data() {
            if (this.view === ViewTypeEnum.JSON) {
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
        view(newValue: number) {
            if (newValue === ViewTypeEnum.JSON) {
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
        }
    },
    created() {
        if (this.view === ViewTypeEnum.JSON) {
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
    methods: {
        execCopy() {
            BrowserUtil.copy(this.pretty);
        }
    }
});
</script>
<style lang="less">
.senior-search-data-view {
    height: 100%;
    width: 100%;
    position: relative;

    .arco-scrollbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .scrollbar {
            overflow: auto;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

        }
    }


    .senior-search-json-view-copy {
        position: absolute;
        top: 0;
        right: 20px;
    }
}
</style>