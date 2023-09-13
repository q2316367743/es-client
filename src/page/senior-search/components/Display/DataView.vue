<template>
    <div class="senior-search-data-view hljs">
        <!-- 标签 -->
        <div class="tabs">
            <div class="tab" :class="itemActive === -1 ? 'active' : ''" @click="itemActive = -1">
                <a-tooltip content="固定">
                    <icon-subscribe-add @click.stop="fixAdd" />
                </a-tooltip>
                <span class="ssd-v-title">结果</span>
            </div>
            <div class="tab fix" v-for="(item, index) in items" :class="itemActive === index ? 'active' : ''"
                @click="itemActive = index">
                <a-tooltip content="取消后将会关闭">
                    <icon-subscribe @click.stop="fixDelete(index)" />
                </a-tooltip>
                <span class="ssd-v-title">结果{{ item.title }}</span>
            </div>
        </div>
        <!-- 内容 -->
        <div class="base-scroll" :class="globalSetting.jsonWrap ? 'json-wrap' : ''">
            <!-- 固定的标签 -->
            <div class="fix-scroll" v-for="(item, index) in items" v-show="itemActive === index">
                <a-scrollbar class="scrollbar"
                    :style="{ fontSize: Optional.ofNullable(globalSetting.jsonFontSize).orElse(16) + 'px' }">
                    <pre v-if="item.view === ViewTypeEnum.BASE">{{ item.pretty }}</pre>
                    <pre v-else-if="item.view === ViewTypeEnum.JSON" class="data-scroll language-json hljs"
                        v-html="item.value" />
                    <div v-else-if="item.view === ViewTypeEnum.JSON_TREE" :ref="`jsonTree${item.title}`"
                        class="data-scroll hljs CompCssDJsonViewTree" v-html="item.value" />
                </a-scrollbar>
                <table-viewer v-if="item.view === ViewTypeEnum.TABLE" :data="item.data" />
            </div>
            <!-- 当前的标签 -->
            <div class="current-scroll" v-show="itemActive === -1">
                <!-- 可以滚动的视图 -->
                <div class="json-scroll">
                    <a-scrollbar class="scrollbar"
                        :style="{ fontSize: Optional.ofNullable(globalSetting.jsonFontSize).orElse(16) + 'px' }">
                        <!-- 基础视图 -->
                        <pre v-if="show === ViewTypeEnum.BASE">{{ pretty }}</pre>
                        <!-- JSON视图 -->
                        <pre v-else-if="show === ViewTypeEnum.JSON" class="data-scroll language-json hljs" v-html="value" />
                        <!-- JSON树视图 -->
                        <div v-show="show === ViewTypeEnum.JSON_TREE" :id="jsonTreeId" class="data-scroll hljs" />
                    </a-scrollbar>
                </div>
                <!-- 表格视图 -->
                <table-viewer v-if="show === ViewTypeEnum.TABLE" :data="wrapper" />
            </div>
        </div>
        <a-button type="text" link class="json-view-copy" v-show="view !== ViewTypeEnum.TABLE" @click="execCopy">复制
        </a-button>
        <a-back-top target-container=".json-scroll .arco-scrollbar-container" v-show="itemActive === -1"/>
        <a-back-top target-container=".fix-scroll .arco-scrollbar-container" v-show="itemActive !== -1"/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { renderJSONTreeView } from "@/components/JsonTree";
import useSettingStore from "@/store/setting/GlobalSettingStore";

import { highlight } from '@/global/BeanFactory';
// 工具
import Optional from "@/utils/Optional";
// 枚举
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableViewer from "@/components/TableViewer/index.vue";
import { jsonFormat } from "@/algorithm/jsonFormat";

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
    components: { TableViewer },
    props: {
        view: Number,
        data: String,
    },
    data: () => ({
        jsonTreeId: 'json-tree-view-' + new Date().getTime(),
        value: '',
        pretty: '',
        wrapper: {} as any,
        copyable: { copyText: "复制", copiedText: "复制成功", timeout: 2000 },
        Optional,
        ViewTypeEnum,
        show: ViewTypeEnum.JSON as ViewTypeEnum,
        items: new Array<Item>(),
        index: 0,
        // 活动的标签页
        itemActive: -1
    }),
    computed: {
        ...mapState(useSettingStore, ['globalSetting'])
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
            utools.copyText(this.pretty);
        },
        render() {
            // 渲染后的视图
            this.pretty = this.data || "{}";
            try {
                // 尝试解析JSON视图
                this.wrapper = JSON.parse(this.pretty);
                // 可以解析，是JSON
                this.pretty = jsonFormat(this.pretty);
            } catch (e) {
                // 解析失败
                this.wrapper = {};
                console.error(e);
            }
            // 视图
            this.show = this.view || ViewTypeEnum.JSON;
            if (this.view === ViewTypeEnum.JSON) {
                this.renderJsonView()
            } else if (this.view === ViewTypeEnum.JSON_TREE) {
                this.renderJsonTreeView();
            } else if (this.view === ViewTypeEnum.TABLE) {
                // 表格，需要判断是否满足
                this.renderTableView();
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
            renderJSONTreeView(this.wrapper, document.getElementById(this.jsonTreeId)!, {
                expanded: true
            });
        },
        renderTableView() {
            // 判断是否满足
            if (!(this.wrapper.hits && this.wrapper.hits.hits)) {
                this.show = ViewTypeEnum.BASE;
                // MessageUtil.warning("结果数据不满足结构，使用基础视图展示");
            }
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
        top: 3px;
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
                white-space: pre-wrap;
                /* css-3 */
                white-space: -moz-pre-wrap;
                /* Mozilla, since 1999 */
                white-space: -o-pre-wrap;
                /* Opera 7 */
                word-wrap: break-word;
                /* Internet Explorer 5.5+ */
                word-break: break-all;
            }
        }

        .fix-scroll {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

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

        .current-scroll {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

        }

        .json-scroll {
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
    }


    .json-view-copy {
        position: absolute;
        top: 0;
        right: 15px;
    }
}
</style>
