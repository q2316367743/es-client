<template>
    <div class="senior-search-data-view">
        <a-scrollbar class="scrollbar">
            <pre :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }"
                class="senior-search-data-scroll language-json hljs" v-html="value" v-if="view === ViewTypeEnum.JSON"></pre>
            <div v-show="view === ViewTypeEnum.JSON_TREE" id="senior-search-json-tree-view"
                class="senior-search-data-scroll hljs" />
        </a-scrollbar>
        <table-viewer v-if="view === ViewTypeEnum.TABLE" :data="data" />
        <a-button type="text" link class="senior-search-json-view-copy" v-show="view === ViewTypeEnum.JSON"
            @click="execCopy">复制</a-button>
        <a-back-top target-container=".senior-search-data-view .arco-scrollbar-container" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from 'vue-json-viewer';
import { mapState } from "pinia";
import { renderJSONTreeView } from "@/components/JsonTree";
import '@/components/JsonTree/index.less';

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
            this.render();
        },
        view() {
            this.render();
        }
    },
    mounted() {
        this.render();
    },
    methods: {
        execCopy() {
            BrowserUtil.copy(this.pretty);
        },
        render() {
            if (this.view === ViewTypeEnum.JSON) {
                this.renderJsonView()
            } else if (this.view === ViewTypeEnum.JSON_TREE) {
                this.renderJsonTreeView();
            }
        },
        renderJsonView() {
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
        renderJsonTreeView() {
            renderJSONTreeView(this.data!, document.getElementById("senior-search-json-tree-view")!, {
                expanded: true
            })
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