<template>
    <div class="base-search-data-view hljs" :class="mainClass"
         :style="{ fontSize: Optional.ofNullable(jsonFontSize).orElse(16) + 'px' }">
        <base-view v-if="defaultView === ViewTypeEnum.BASE" :value="current.result"/>
        <json-view v-else-if="defaultView === ViewTypeEnum.JSON" :data="current.result"/>
        <table-viewer v-else-if="defaultView === ViewTypeEnum.TABLE" :data="current.result" :index="current.index"/>
        <monaco-view v-else-if="defaultView === ViewTypeEnum.EDITOR" :value="current.result" :height="height"/>
        <json-tree-view v-else-if="defaultView === ViewTypeEnum.JSON_TREE" :value="current.result"/>
    </div>
</template>
<script lang="ts">
import {computed, defineComponent} from "vue";
import {mapState} from "pinia";
import {useWindowSize} from "@vueuse/core";

import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import {current} from "@/store/components/BaseSearchStore";
import TableViewer from "@/components/view/TableViewer/index.vue";
import JsonTreeView from "@/components/view/JsonTreeView/index.vue";
import JsonView from "@/components/view/JsonView/index.vue";
import BaseView from "@/components/view/BaseView/index.vue";
import MonacoView from "@/components/view/MonacoView/index.vue";


export default defineComponent({
    name: 'base-search-data-view',
    components: {MonacoView, BaseView, JsonView, JsonTreeView, TableViewer},
    data: () => ({
        Optional,
        ViewTypeEnum
    }),
    computed: {
        ...mapState(useGlobalSettingStore, ['jsonFontSize', 'jsonWrap']),
        ...mapState(useBaseSearchSettingStore, ['defaultView']),
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
    setup() {
        const size = useWindowSize();
        const height = computed(() => (size.height.value - 120) + 'px');

        return {
            height, current
        }
    },
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
