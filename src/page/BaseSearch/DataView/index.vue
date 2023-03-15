<template>
    <div class="base-search-data-view hljs" :class="mainClass"
        :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }">
        <pre v-if="view === ViewTypeEnum.BASE">{{ pretty }}</pre>
        <pre v-else-if="view === ViewTypeEnum.JSON" class="data-scroll language-json hljs" v-html="value" />
        <table-viewer v-else-if="view === ViewTypeEnum.TABLE" :data="data" :index="index" />
        <div v-show="view === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs" />
        <a-back-top target-container=".base-search-data-view .arco-scrollbar-container" />
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {renderJSONTreeView} from "@/components/JsonTree";

import {highlight} from '@/global/BeanFactory';
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableViewer from "@/components/TableViewer/index.vue";
import BrowserUtil from "@/utils/BrowserUtil";

export default defineComponent({
    name: 'base-search-data-view',
    components: {TableViewer},
    props: {
        view: Number,
        data: Object,
        index: {
            type: String,
            required: false,
            default: ''
        }
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
        ...mapState(useSettingStore, ['instance']),
        mainClass() {
            let classItem = new Array<string>();
            if (this.view === ViewTypeEnum.TABLE) {
                classItem.push('table-viewer-show')
            }
            if (this.instance.jsonWrap) {
                classItem.push('json-wrap')
            }
            return classItem.join(' ')
        }
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
            this.pretty = JSON.stringify(this.data, null, 4);
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

    &.json-wrap {
        .CompCssDJsonViewTree {
            .wjv-line {
                flex-flow: wrap;
            }
        }
        pre.hljs {
            white-space: pre-wrap;       /* css-3 */
            white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
            white-space: -o-pre-wrap;    /* Opera 7 */
            word-wrap: break-word;       /* Internet Explorer 5.5+ */
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
        border: 0px;
    }
}
</style>