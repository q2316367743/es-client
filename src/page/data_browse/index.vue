<template>
    <div class="data-browse">
        <div class="browse-header">
            <div>
                <el-input v-model="keyword" @input="render_index_list" clearable style="width: 375px;"></el-input>
            </div>
            <el-select v-model="view">
                <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
                <el-option :label="$t('senior_search.editor_view')" :value="4"></el-option>
            </el-select>
        </div>
        <div class="browse-main">
            <div class="browse-side" :class="show_side ? 'browse-side-open' : 'browse-side-hide'">
                <el-scrollbar @click="no_choose()">
                    <es-list>
                        <es-list-item v-for="(index, idx) in index_list" :key="idx"
                            :choose="choose_index === index.name" @click.stop="choose(index.name)"
                            :aliases="index.alias">{{
                                    index.name
                            }}</es-list-item>
                    </es-list>
                </el-scrollbar>
            </div>
            <div class="browse-operation" :class="show_side ? 'browse-operation-open' : 'browse-operation-hide'"
                @click="show_side = !show_side">
                <el-icon v-if="show_side" :size="12">
                    <arrow-left />
                </el-icon>
                <el-icon v-else :size="12">
                    <arrow-right />
                </el-icon>
            </div>
            <div class="browse-content" :class="show_side ? 'browse-content-open' : 'browse-content-hide'">
                <div class="operation">
                    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                        :current-page="page" :page-size="size" @size-change="sizeChange" @current-change="pageChange">
                    </el-pagination>
                </div>
                <div class="container">
                    <base-viewer v-if="view === 1" :data="result"></base-viewer>
                    <json-viewer v-else-if="view === 2" :value="result" :expand-depth="6" copyable sort expanded>
                    </json-viewer>
                    <table-viewer v-if="view === 3" :data="result" :mapping="mapping"></table-viewer>
                    <editor-viewer v-if="view === 4" v-model="result" height="calc(100% - 64px)"></editor-viewer>
                </div>
            </div>
        </div>
        <el-backtop :right="40" :bottom="60" target=".browse-content" v-show="show_top" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { mapState } from 'pinia';
import JsonViewer from "vue-json-viewer";

import EsList from '@/components/EsList/index.vue';
import EsListItem from '@/components/EsList/item.vue';
import BaseViewer from "@/components/BaseViewer.vue";
import TableViewer from "@/components/TableViewer/index.vue";
import EditorViewer from "@/components/EditorViewer/index.vue";

import { useIndexStore } from '@/store/IndexStore';
import { useSettingStore } from "@/store/SettingStore";

import axios from "@/plugins/axios";
import mitt from '@/plugins/mitt';

import Index from "@/view/Index";


export default defineComponent({
    name: 'data_browse',
    components: { EsList, EsListItem, ArrowLeft, ArrowRight, JsonViewer, BaseViewer, TableViewer, EditorViewer },
    computed: {
        ...mapState(useIndexStore, ['indices']),
        ...mapState(useSettingStore, ['default_viewer']),
    },
    data: () => ({
        show_side: true,
        choose_index: '',
        view: useSettingStore().getDefaultViewer,
        result: {} as any,
        mapping: {},
        page: 1,
        size: 10,
        total: 0,
        index_list: [] as Array<Index>,
        keyword: '',
        show_top: true
    }),
    watch: {
        default_viewer() {
            this.view = useSettingStore().getDefaultViewer
        }
    },
    created() {
        mitt.on('update_index', () => {
            // 重置条件
            this.no_choose();
            // 重新渲染
            this.render_index_list();
        });
        mitt.on('active_switch', (index) => {
            this.show_top = (index === 'data_browse')
        });
    },
    methods: {
        choose(index_name: string, verify: boolean = true) {
            if (verify) {
                if (this.choose_index !== index_name) {
                    this.choose_index = index_name;
                } else {
                    this.choose_index = '';
                    this.no_choose();
                    return;
                }
            }
            for (let index of this.indices) {
                if (index.name === index_name) {
                    this.mapping = index.mapping
                    break;
                }
            }
            axios({
                url: `/${index_name}/_search`,
                method: "POST",
                data: { from: (this.page - 1) * this.size, size: this.size },
            }).then((response) => {
                this.result = response;
                if (this.result.hits) {
                    if (parseInt(this.result.hits.total)) {
                        this.total = parseInt(this.result.hits.total)
                    } else if (parseInt(this.result.hits.total.value)) {
                        this.total = parseInt(this.result.hits.total.value);
                    } else {
                        this.total = 0;
                    }
                } else {
                    this.total = 0;
                }
            });
        },
        no_choose() {
            this.choose_index = '';
            this.result = {} as any;
            this.mapping = {};
            this.page = 1;
            this.size = 10;
            this.total = 0;
        },
        render_index_list() {
            // 第一步，过滤
            let index_list = [] as Array<Index>;
            for (let index of this.indices) {
                if (this.keyword === '' || index.name.indexOf(this.keyword) > -1) {
                    index_list.push(index);
                }
            }
            this.index_list = index_list.sort((a, b) => {
                return a.name.localeCompare(b.name, "zh-CN");
            });
        },
        sizeChange(size: number) {
            this.size = size;
            this.choose(this.choose_index, false);
        },
        pageChange(page: number) {
            this.page = page;
            this.choose(this.choose_index, false);
        }
    }
});
</script>
<style lang="less">
.data-browse {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid #e4e7ed;

    .browse-header {
        padding: 18px 20px;
        border-bottom: 1px solid #e4e7ed;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        display: flex;
        justify-content: space-between;
    }

    .browse-main {
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;

        .browse-side {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            border-right: #f2f2f2 solid 1px;
        }

        .browse-side-hide {
            width: 0;

        }

        .browse-side-open {
            width: 400px;
        }

        .browse-operation {
            position: absolute;
            top: 45%;
            background-color: #e3e9ed;
            width: 12px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            cursor: pointer;
            z-index: 1;

            &:hover {
                background-color: #ebf0f2;
            }

        }

        .browse-operation-hide {
            left: 0;

        }

        .browse-operation-open {
            left: 400px;
        }

        .browse-content {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            padding: 0 10px;
            overflow: auto;

            .operation {
                position: absolute;
                top: 10px;
                left: 15px;
                right: 0;
                height: 32px;
                z-index: 1;
            }

            .container {
                position: absolute;
                top: 10px;
                left: 20px;
                right: 0;
                bottom: 10px;

                .base-viewer {
                    .base-viewer-show {
                        padding-top: 40px;
                    }
                }

                .jv-container {
                    padding-top: 20px;
                }

                .editor-viewer {
                    padding-top: 50px;
                }
            }
        }

        .browse-content-hide {
            left: 0;
        }

        .browse-content-open {
            left: 400px;
        }
    }
}
</style>