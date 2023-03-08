<template>
    <div class="senior-search-data-view hljs">
        <div class="base-scroll">
            <a-scrollbar class="scrollbar"
                         :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }">
                <pre v-if="show === ViewTypeEnum.BASE">{{ pretty }}</pre>
                <pre v-else-if="show === ViewTypeEnum.JSON" class="data-scroll language-json hljs" v-html="value"></pre>
                <div v-show="show === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs"/>
            </a-scrollbar>
        </div>
        <table-viewer v-if="show === ViewTypeEnum.TABLE" :data="data"/>
        <a-button type="text" link class="json-view-copy" v-show="view !== ViewTypeEnum.TABLE"
                  @click="execCopy">复制
        </a-button>
        <a-back-top target-container=".senior-search-data-view .arco-scrollbar-container"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {renderJSONTreeView} from "@/components/JsonTree";

import {highlight} from '@/global/BeanFactory';
import BrowserUtil from "@/utils/BrowserUtil";
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default defineComponent({
    name: 'senior-search-data-view',
    props: {
        view: Number,
        data: Object,
    },
    data: () => ({
        jsonTreeId: 'json-tree-view-' + new Date().getTime(),
        value: '',
        pretty: '',
        copyable: {copyText: "复制", copiedText: "复制成功", timeout: 2000},
        Optional,
        ViewTypeEnum,
        show: ViewTypeEnum.JSON
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
            if (typeof this.data === 'object') {
                let value = JSON.stringify(this.data, null, 4);
                this.pretty = value;
                if (this.pretty === '') {
                    this.pretty = '{}';
                }
                this.show = this.view || ViewTypeEnum.JSON;
                if (this.view === ViewTypeEnum.JSON) {
                    this.renderJsonView()
                } else if (this.view === ViewTypeEnum.JSON_TREE) {
                    this.renderJsonTreeView();
                }
            } else if (typeof this.data === 'string') {
                // 字符串，直接展示
                this.pretty = this.data;
                this.show = ViewTypeEnum.BASE;
            } else if (typeof this.data !== 'undefined') {
                this.pretty = '没有相应体';
                this.show = ViewTypeEnum.BASE;
            } else {
                this.pretty = `${this.data}`;
                this.show = ViewTypeEnum.BASE;

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
.senior-search-data-view {
    height: 100%;
    width: 100%;
    position: relative;

    .base-scroll {
        .arco-scrollbar {
            position: absolute;
            top: 4px;
            left: 6px;
            right: 6px;
            bottom: 4px;

            .scrollbar {
                overflow: auto;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;

            }
        }
    }


    .json-view-copy {
        position: absolute;
        top: 0;
        right: 15px;
    }
}
</style>