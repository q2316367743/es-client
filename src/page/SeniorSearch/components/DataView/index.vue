<template>
    <div class="senior-search-data-view hljs">
        <div class="tabs">
            <div class="tab fix" v-for="(item, index) in items" :class="itemActive === index ? 'active' : ''"
                 @click="itemActive = index">
                <a-tooltip content="取消后将会关闭">
                    <icon-subscribe @click.stop="fixDelete(index)"/>
                </a-tooltip>
                <span class="ssd-v-title">结果{{ item.title }}</span>
            </div>
            <div class="tab" :class="itemActive === -1 ? 'active' : ''" @click="itemActive = -1">
                <a-tooltip content="固定">
                    <icon-subscribe-add @click.stop="fixAdd"/>
                </a-tooltip>
                <span class="ssd-v-title">结果</span>
            </div>
        </div>
        <div class="base-scroll" :class="instance.jsonWrap ? 'json-wrap' : ''">
            <div class="fix-scroll" v-for="(item, index) in items" v-show="itemActive === index">
                <a-scrollbar class="scrollbar"
                             :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }">
                    <pre v-if="item.view === ViewTypeEnum.BASE">{{ item.pretty }}</pre>
                    <pre v-else-if="item.view === ViewTypeEnum.JSON" class="data-scroll language-json hljs"
                         v-html="item.value"/>
                    <div v-else-if="item.view === ViewTypeEnum.JSON_TREE" :ref="`jsonTree${item.title}`"
                         class="data-scroll hljs CompCssDJsonViewTree" v-html="item.value"/>
                </a-scrollbar>
                <table-viewer v-if="item.view === ViewTypeEnum.TABLE" :data="item.data"/>
            </div>
            <div class="current-scroll" v-show="itemActive === -1">
                <a-scrollbar class="scrollbar"
                             :style="{ fontSize: Optional.ofNullable(instance.jsonFontSize).orElse(16) + 'px' }">
                    <pre v-if="show === ViewTypeEnum.BASE">{{ pretty }}</pre>
                    <pre v-else-if="show === ViewTypeEnum.JSON" class="data-scroll language-json hljs"
                         v-html="value"/>
                    <div v-show="show === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs"/>
                </a-scrollbar>
                <table-viewer v-if="show === ViewTypeEnum.TABLE" :data="data"/>
            </div>
        </div>
        <a-button type="text" link class="json-view-copy" v-show="view !== ViewTypeEnum.TABLE"
                  @click="execCopy">复制
        </a-button>
        <a-back-top target-container=".senior-search-data-view .arco-scrollbar-container"/>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {mapState} from "pinia";
import {renderJSONTreeView} from "@/components/JsonTree";
import useSettingStore from "@/store/SettingStore";

import {highlight} from '@/global/BeanFactory';
// 工具
import BrowserUtil from "@/utils/BrowserUtil";
import Optional from "@/utils/Optional";
// 枚举
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableViewer from "@/components/TableViewer/index.vue";

/**
 * 每一项
 */
interface Item {

    /**
     * 标题
     */
    title: string;

    /**
     * 视图
     */
    view: ViewTypeEnum;

    /**
     * 数据
     */
    data: any;

    /**
     * 渲染后的数据
     */
    pretty: string;

    /**
     * HTML渲染后的数据
     */
    value: string;

}

export default defineComponent({
    name: 'senior-search-data-view',
    components: {TableViewer},
    props: {
        view: Number,
        data: Object as PropType<Record<string, any> | string>,
    },
    data: () => ({
        jsonTreeId: 'json-tree-view-' + new Date().getTime(),
        value: '',
        pretty: '',
        copyable: {copyText: "复制", copiedText: "复制成功", timeout: 2000},
        Optional,
        ViewTypeEnum,
        show: ViewTypeEnum.JSON as ViewTypeEnum,
        items: new Array<Item>(),
        index: 0,
        itemActive: -1
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
                this.pretty = JSON.stringify(this.data, null, 4);
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
            renderJSONTreeView(this.data as any, document.getElementById(this.jsonTreeId)!, {
                expanded: true
            });
        },
        fixAdd() {
            this.index += 1;
            let item = {
                title: this.index + '',
                view: this.show + 0,
                pretty: this.pretty + ' ',
                data: typeof this.data === 'object' ? this.data : {},
                value: this.value + ' '
            };
            if (this.show === ViewTypeEnum.JSON_TREE) {
                let source = document.getElementById(this.jsonTreeId)! as HTMLDivElement;
                item.value = source.innerHTML;
            }
            this.items.push(item);
        },
        fixDelete(index: number) {
            this.items.splice(index, 1);
            if (index === this.itemActive) {
                this.itemActive = -1;
            }
        }
    }
});
</script>
<style lang="less">
.senior-search-data-view {
    height: 100%;
    width: 100%;
    position: relative;

    .tabs {
        position: absolute;
        top: 0;
        left: 6px;
        right: 6px;
        height: 26px;
        display: flex;
        border-bottom: var(--color-neutral-3);

        .tab {
            margin: 0 5px;
            cursor: pointer;
            padding: 6px 8px;

            &.active {
                background-color: var(--color-neutral-4);

                &:hover {
                    background-color: var(--color-neutral-4);
                }
            }

            &:hover {
                background-color: var(--color-neutral-2);
            }

            &.fix {
                .arco-icon {
                    color: rgb(var(--arcoblue-6));
                }
            }

            .arco-icon {
                &:hover {
                    color: rgb(var(--arcoblue-5));
                }
            }

            .ssd-v-title {
                margin-left: 4px;
            }
        }
    }

    .base-scroll {
        position: absolute;
        top: 30px;
        left: 6px;
        right: 6px;
        bottom: 4px;

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

        .fix-scroll {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .current-scroll {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

        }

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