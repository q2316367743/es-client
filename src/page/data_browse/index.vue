<template>
    <div class="data-browse">
        <div class="browse-header">
            <div>数据浏览</div>
            <el-select v-model="view">
                <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
            </el-select>
        </div>
        <div class="browse-main">
            <el-scrollbar class="browse-side" :class="show_side ? 'browse-side-open' : 'browse-side-hide'"
                @click="no_choose()">
                <es-list>
                    <es-list-item v-for="(index, idx) in indices" :key="idx" :choose="choose_index === index.name"
                        @click.stop="choose(index.name)">{{
                                index.name
                        }}</es-list-item>
                </es-list>
            </el-scrollbar>
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
                <el-scrollbar>
                    <base-viewer v-if="view === 1" :data="result"></base-viewer>
                    <json-viewer v-else-if="view === 2" :value="result" :expand-depth="6" copyable sort expanded>
                    </json-viewer>
                    <table-viewer v-if="view === 3" :data="result" :mapping="mapping"></table-viewer>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import EsList from '@/components/EsList/index.vue';
import EsListItem from '@/components/EsList/item.vue';
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { mapState } from 'pinia';

import { useIndexStore } from '@/store/IndexStore';
import axios from "@/plugins/axios";

import JsonViewer from "vue-json-viewer";
import BaseViewer from "@/components/BaseViewer.vue";
import TableViewer from "@/components/TableViewer/index.vue"

export default defineComponent({
    name: 'data_browse',
    components: { EsList, EsListItem, ArrowLeft, ArrowRight, JsonViewer, BaseViewer, TableViewer },
    computed: {
        ...mapState(useIndexStore, ['indices']),
    },
    data: () => ({
        show_side: true,
        choose_index: '',
        view: 2,
        result: {} as any,
        mapping: {},
        from: 0,
        size: 10,
        total: 0
    }),
    methods: {
        choose(index_name: string) {
            this.choose_index = index_name;
            for (let index of this.indices) {
                if (index.name === index_name) {
                    this.mapping = index.mapping
                    break;
                }
            }
            axios({
                url: `/${index_name}/_search`,
                method: "POST",
                data: { from: this.from, size: this.size },
            }).then((response) => {
                this.result = response;
                if (this.result.hits) {
                    this.total = this.result.hits.total
                } else {
                    this.total = 0;
                }
            });
        },
        no_choose() {
            this.choose_index = '';
            this.result = {} as any;
            this.mapping = {};
            this.from = 0;
            this.size = 10;
            this.total = 0;
        }
    }
});
</script>
<style scoped lang="less">
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
        top: 69px;
        left: 0;
        right: 0;
        bottom: 0;

        .browse-side {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 400px;
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