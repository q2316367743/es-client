<template>
    <div class="base-search-data-view hljs" :class="view === ViewTypeEnum.TABLE ? 'table-viewer-show' : ''"
        :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }">
        <pre v-if="view === ViewTypeEnum.BASE">{{ pretty }}</pre>
        <pre v-else-if="view === ViewTypeEnum.JSON" class="data-scroll language-json hljs" v-html="value" />
        <table-viewer v-else-if="view === ViewTypeEnum.TABLE" :data="data" />
        <div v-show="view === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs" />
        <a-back-top target-container=".base-search-data-view .arco-scrollbar-container" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { renderJSONTreeView } from "@/components/JsonTree";

import { highlight } from '@/global/BeanFactory';
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default defineComponent({
    name: 'base-search-data-view',
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
        render() {
            let value = JSON.stringify(this.data, null, 4);
            this.pretty = value;
            if (this.pretty === '') {
                this.pretty = '{}';
            }
            if (this.view === ViewTypeEnum.JSON) {
                this.renderJsonView()
            } else if (this.view === ViewTypeEnum.JSON_TREE) {
                this.renderJsonTreeView();
            }
        },
        renderJsonView() {
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
.base-search-data-view {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    position: relative;
    border-left: 1px solid var(--color-border-2);
    border-right: 1px solid var(--color-border-2);
    border-top: 1px solid var(--color-border-2);
    overflow-x: auto;

    .json-view-copy {
        position: absolute;
        top: 0;
        right: 15px;
    }
    &.table-viewer-show {
        height: calc(100vh - 108px);
        overflow: hidden;
        padding: 0;
        border: 0px;
    }
}
</style>