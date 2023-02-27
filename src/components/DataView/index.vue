<template>
    <div class="data-view hljs">
        <a-scrollbar class="scrollbar" :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }">
            <pre v-if="view === ViewTypeEnum.BASE">{{ pretty }}</pre>
            <pre class="data-scroll language-json hljs" v-html="value" v-else-if="view === ViewTypeEnum.JSON"></pre>
            <div v-show="view === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs" />
        </a-scrollbar>
        <table-viewer v-if="view === ViewTypeEnum.TABLE" :data="data" />
        <a-button type="text" link class="json-view-copy" v-show="view !== ViewTypeEnum.TABLE"
            @click="execCopy">复制</a-button>
        <a-back-top target-container=".data-view .arco-scrollbar-container" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { renderJSONTreeView } from "@/components/JsonTree";
import '@/components/JsonTree/index.less';

import { highlight } from '@/global/BeanFactory';
import BrowserUtil from "@/utils/BrowserUtil";
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default defineComponent({
    name: 'data-view',
    props: {
        view: Number,
        data: Object,
    },
    data: () => ({
        jsonTreeId: 'json-tree-view-' + new Date().getTime(),
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
            let value = JSON.stringify(this.data, null, 4);
            this.pretty = value;
            if (this.view === ViewTypeEnum.JSON) {
                this.renderJsonView()
            } else if (this.view === ViewTypeEnum.JSON_TREE) {
                this.renderJsonTreeView();
            }
        },
        renderJsonView() {
            if (this.pretty === '') {
                this.pretty = '{}';
            }
            this.$nextTick(() => {
                let highlightResult = highlight.highlight(this.pretty, {
                    language: 'json'
                });
                this.value = highlightResult.value;
            });
        },
        renderJsonTreeView() {
            renderJSONTreeView(this.data!, document.getElementById(this.jsonTreeId)!, {
                expanded: true
            })
        }
    }
});
</script>
<style lang="less">
.data-view {
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


    .json-view-copy {
        position: absolute;
        top: 0;
        right: 15px;
    }
}
</style>