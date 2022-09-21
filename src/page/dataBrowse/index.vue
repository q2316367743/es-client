<template>
    <div class="data-browse">
        <div class="browse-header">
            <div>
                <el-input v-model="keyword" @input="renderIndexList" clearable style="width: 375px;"></el-input>
            </div>
            <el-select v-model="view">
                <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
                <el-option :label="$t('senior_search.editor_view')" :value="4"></el-option>
            </el-select>
        </div>
        <div class="browse-main">
            <div class="browse-side" :class="showSide ? 'browse-side-open' : 'browse-side-hide'">
                <el-scrollbar @click="clearChoose">
                    <es-list>
                        <es-list-item v-for="(index, idx) in index_list" :key="idx"
                                      :choose="chooseIndex === index.name" @click.stop="choose(index.name)"
                                      :aliases="index.alias">{{
                                index.name
                            }}
                        </es-list-item>
                    </es-list>
                </el-scrollbar>
            </div>
            <div class="browse-operation" :class="showSide ? 'browse-operation-open' : 'browse-operation-hide'"
                 @click="showSide = !showSide">
                <el-icon v-if="showSide" :size="12">
                    <arrow-left/>
                </el-icon>
                <el-icon v-else :size="12">
                    <arrow-right/>
                </el-icon>
            </div>
            <div class="browse-content" :class="showSide ? 'browse-content-open' : 'browse-content-hide'">
                <div class="operation">
                    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                                   :current-page="page" :page-size="size" @size-change="sizeChange"
                                   @current-change="pageChange">
                    </el-pagination>
                </div>
                <div class="container">
                    <base-viewer v-if="view === 1" :data="data_browse_result"></base-viewer>
                    <json-viewer v-else-if="view === 2" :value="data_browse_result" :expand-depth="6" copyable sort
                                 expanded>
                    </json-viewer>
                    <table-viewer v-if="view === 3" :data="data_browse_result" :mapping="mapping"></table-viewer>
                    <base-browse-editor-viewer v-if="view === 4"
                                               v-model="data_browse_result"></base-browse-editor-viewer>
                </div>
            </div>
        </div>
        <el-backtop :right="40" :bottom="60" target=".browse-content" v-show="showTop"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import {mapState} from 'pinia';
import JsonViewer from "vue-json-viewer";

import EsList from '@/components/EsList/index.vue';
import EsListItem from '@/components/EsList/item.vue';
import BaseViewer from "@/components/BaseViewer.vue";
import TableViewer from "@/components/TableViewer/index.vue";
import BaseBrowseEditorViewer from "@/components/EditorViewer/base-browse.vue";

import {useIndexStore} from '@/store/IndexStore';
import {useSettingStore} from "@/store/SettingStore";

import axios from "@/plugins/axios";
import mitt from '@/plugins/mitt';

import Index from "@/view/Index";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";


export default defineComponent({
    name: 'data-browse',
    components: {
        EsList,
        EsListItem,
        ArrowLeft,
        ArrowRight,
        JsonViewer,
        BaseViewer,
        TableViewer,
        BaseBrowseEditorViewer
    },
    computed: {
        ...mapState(useIndexStore, ['indices']),
    },
    data: () => ({
        defaultViewer: useSettingStore().instance.defaultViewer,
        showSide: true,
        chooseIndex: '',
        view: useSettingStore().getDefaultViewer,
        data_browse_result: {} as any,
        mapping: {},
        page: 1,
        size: 10,
        total: 0,
        index_list: [] as Array<Index>,
        keyword: '',
        showTop: true
    }),
    watch: {
        default_viewer() {
            this.view = useSettingStore().getDefaultViewer
        }
    },
    created() {
        mitt.on(MessageEventEnum.INDEX_CONNECT, () => {
            // 直接渲染列表
            this.renderIndexList();
        });
        mitt.on(MessageEventEnum.INDEX_CLEAN, () => {
            // 重置条件
            this.clearChoose();
            // 重新渲染
            this.renderIndexList();
        });
        mitt.on(MessageEventEnum.INDEX_REFRESH, () => {
            // 重新渲染
            this.renderIndexList();
        });
        mitt.on(MessageEventEnum.PAGE_ACTIVE, (page) => {
            this.showTop = (page === PageNameEnum.DATA_BROWSER)
        });
    },
    methods: {
        choose(index_name: string, verify: boolean = true) {
            if (verify) {
                if (this.chooseIndex !== index_name) {
                    this.chooseIndex = index_name;
                } else {
                    this.chooseIndex = '';
                    this.clearChoose();
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
                data: {from: (this.page - 1) * this.size, size: this.size},
            }).then((response) => {
                this.data_browse_result = response;
                if (this.data_browse_result.hits) {
                    if (parseInt(this.data_browse_result.hits.total)) {
                        this.total = parseInt(this.data_browse_result.hits.total)
                    } else if (parseInt(this.data_browse_result.hits.total.value)) {
                        this.total = parseInt(this.data_browse_result.hits.total.value);
                    } else {
                        this.total = 0;
                    }
                } else {
                    this.total = 0;
                }
            });
        },
        clearChoose() {
            this.chooseIndex = '';
            this.data_browse_result = {} as any;
            this.mapping = {};
            this.page = 1;
            this.size = 10;
            this.total = 0;
        },
        renderIndexList() {
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
            this.choose(this.chooseIndex, false);
        },
        pageChange(page: number) {
            this.page = page;
            this.choose(this.chooseIndex, false);
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