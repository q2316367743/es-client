<template>
    <div class="base-search-data-view hljs" :class="mainClass"
         :style="{ fontSize: Optional.ofNullable(jsonFontSize).orElse(16) + 'px' }">
        <pre v-if="defaultView === ViewTypeEnum.BASE">{{ pretty }}</pre>
        <pre v-else-if="defaultView === ViewTypeEnum.JSON" class="data-scroll language-json hljs" v-html="value"/>
        <table-viewer v-else-if="defaultView === ViewTypeEnum.TABLE" :data="current.result" :index="current.index"/>
        <monaco-editor v-else-if="defaultView === ViewTypeEnum.EDITOR" :model-value="pretty" language="json" :height="height" read-only/>
        <div v-show="defaultView === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs"/>
        <a-back-top target-container=".base-search-data-view .arco-scrollbar-container"/>
    </div>
</template>
<script lang="ts">
import {computed, defineComponent} from "vue";
import {mapState} from "pinia";
import {renderJSONTreeView} from "@/components/JsonTree";

import {highlight} from '@/global/BeanFactory';
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableViewer from "@/components/TableViewer/index.vue";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import {useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {useWindowSize} from "@vueuse/core";

export default defineComponent({
    name: 'base-search-data-view',
    components: {MonacoEditor, TableViewer},
    data: () => ({
        jsonTreeId: 'json-tree-view-' + new Date().getTime(),
        value: '',
        pretty: '',
        copyable: {copyText: "复制", copiedText: "复制成功", timeout: 2000},
        Optional,
        ViewTypeEnum
    }),
    computed: {
        ...mapState(useGlobalSettingStore, ['jsonFontSize', 'jsonWrap']),
        ...mapState(useBaseSearchSettingStore, ['defaultView']),
        ...mapState(useBaseSearchStore, ['current']),
        mainClass() {
            let classItem = new Array<string>();
            if (this.defaultView === ViewTypeEnum.TABLE) {
                classItem.push('table-viewer-show')
            }
            if (this.jsonWrap) {
                classItem.push('json-wrap')
            }
            return classItem.join(' ')
        }
    },
    watch: {
        'current.result'() {
            this.render();
        },
        view() {
            this.render();
        }
    },
    setup() {
        const size = useWindowSize();
        const height = computed(() => (size.height.value - 120) + 'px');
        return {
            height
        }
    },
    mounted() {
        this.render();
    },
    methods: {
        execCopy() {
            utools.copyText(this.pretty);
            MessageUtil.success("已成功复制到剪切板");
        },
        render() {
            this.pretty = JSON.stringify(this.current.result, null, 4);
            if (this.pretty === '') {
                this.pretty = '{}';
            }
            if (this.defaultView === ViewTypeEnum.JSON) {
                this.renderJsonView()
            } else if (this.defaultView === ViewTypeEnum.JSON_TREE) {
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
            renderJSONTreeView(this.current.result, document.getElementById(this.jsonTreeId)!, {
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

    &.json-wrap {
        .CompCssDJsonViewTree {
            .wjv-line {
                flex-flow: wrap;
            }
        }

        pre.hljs {
            white-space: pre-wrap; /* css-3 */
            white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
            white-space: -o-pre-wrap; /* Opera 7 */
            word-wrap: break-word; /* Internet Explorer 5.5+ */
            word-break: break-all;
        }
    }

    .json-view-copy {
        position: absolute;
        top: 0;
        right: 15px;
    }

    &.table-viewer-show {
        height: calc(100vh - 108px);
        overflow: hidden;
        padding: 0;
        border: 0;
    }
}
</style>
