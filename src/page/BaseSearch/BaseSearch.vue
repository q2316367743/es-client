<template>
    <div class="base-search">
        <div class="base-option">
            <div class="el-card es-card is-always-shadow">
                <div class="el-card__header">
                    <span>{{$t('base_search.query_criteria')}}</span>
                    <el-button
                        style="
							float: right;
							padding: 3px 13px 3px 0;
							margin-left: 10px;
						"
                        type="text"
                        @click="is_show = !is_show"
                    >{{ is_show ? $t('base_search.close') : $t('base_search.open') }}</el-button>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="search">{{$t('base_search.refresh')}}</el-button>
                    <el-button
                        style="float: right; padding: 3px 0"
                        type="text"
                        @click="show_body"
                    >{{$t('base_search.display_query_statement')}}</el-button>
                </div>
                <div class="el-card__body" v-show="is_show">
                    <el-form label-position="top" label-width="80px" style="overflow: auto">
                        <el-form-item :label="$t('base_search.document')">
                            <el-select v-model="index" filterable :placeholder="$t('base_search.please_select')" clearable>
                                <el-option
                                    v-for="item, idx in indices"
                                    :key="idx"
                                    :label="item.name"
                                    :value="item.name"
                                ></el-option>
                            </el-select>
                            <el-button type="primary" style="margin-left: 10px" @click="search">{{$t('base_search.search')}}</el-button>
                            <el-button style="margin-left: 10px" @click="clear">{{$t('base_search.clear')}}</el-button>
                        </el-form-item>
                        <el-form-item label="条件：" style="min-width: 1100px">
                            <div v-if="field_condition.length === 0">
                                <el-button type="primary" @click="field_condition_add">{{$t('base_search.add')}}</el-button>
                            </div>
                            <div>
                                <div
                                    v-for="(item, idx) in field_condition"
                                    :key="idx"
                                    style="margin-bottom: 10px;display: flex;"
                                >
                                    <field-condition-item
                                        v-model:value="field_condition[idx]"
                                        :fields="fields"
                                    ></field-condition-item>
                                    <el-button
                                        type="primary"
                                        style="margin-left: 10px"
                                        @click="field_condition_add"
                                    >{{$t('base_search.add')}}</el-button>
                                    <el-button
                                        type="danger"
                                        @click="field_condition_remove(item.id)"
                                    >{{$t('base_search.remove')}}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="base-content">
            <el-card>
                <json-viewer :value="result" :expand-depth="4" copyable sort></json-viewer>
                <div class="page">
                    <el-pagination
                        background
                        layout="sizes, prev, pager, next"
                        hide-on-single-page
                        :total="total"
                        :current-page="page"
                        :page-size="size"
                        @size-change="sizeChange"
                        @current-change="pageChange"
                    ></el-pagination>
                </div>
            </el-card>
        </div>
        <el-dialog
            :title="$t('base_search.query_criteria')"
            v-model="condition_dialog"
            width="70%"
            append-to-body
            custom-class="es-dialog"
            :close-on-click-modal="false"
        >
            <json-viewer
                :value="condition_data"
                :expand-depth="4"
                copyable
                sort
                expanded
                preview-mode
            ></json-viewer>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from "vue-json-viewer";
import { ElMessageBox } from "element-plus";
import axios from "@/plugins/axios";
import BaseQuery from '@/entity/BaseQuery';
import QueryConditionBuild from './build/QueryConditionBuild';
import FieldConditionItem from "./component/FieldConditionItem.vue";
import { mapState } from "pinia";
import { useIndexStore } from "@/store/IndexStore";
import Field from "@/view/Field";

// 公共方法

export default defineComponent({
    components: {
        JsonViewer,
        FieldConditionItem
    },
    data: () => {
        return {
            // 是否显示查询语句
            is_show: true,
            // 选择的索引名称
            index: '',
            // 条件
            field_condition: new Array<BaseQuery>(),
            // 分页
            page: 1,
            size: 10,
            total: 0,
            // 条件对话框
            condition_dialog: false,
            // 渲染后的数据
            condition_data: {},
            // 查询结果
            result: {} as any,
        };
    },
    computed: {
        ...mapState(useIndexStore, ['indices']),
        fields() {
            if (this.index === '') {
                return new Array<Field>();
            }
            // 重置字段
            for (let index of this.indices) {
                if (index.name === this.index) {
                    return index.fields;
                }
            }
            return new Array<Field>();
        }
    },
    watch: {
        index() {
            // 索引变化，重置查询
            this.clear();
            if(this.index !== '') {
                this.search();
            }
        }
    },
    methods: {
        field_condition_add(): void {
            this.field_condition.push({
                id: new Date().getTime(),
                type: '',
                field: {
                    name: '',
                    type: ''
                },
                condition: '',
                value: '',
                extra_left_cindition: '',
                extra_left_value: '',
                extra_right_cindition: '',
                extra_right_value: ''
            });
        },
        field_condition_remove(id: number): void {
            if (this.field_condition.length === 0) {
                return;
            }
            this.field_condition = this.field_condition.filter((item) => {
                return item.id !== id;
            });
        },
        show_body() {
            this.condition_data = QueryConditionBuild(this.field_condition, this.page, this.size);
            this.condition_dialog = true;
        },
        search() {
            if (this.index.length === 0) {
                ElMessageBox.alert(this.$t('base_search.please_select_an_index'));
                return;
            }
            axios({
                url: `/${this.index}/_search`,
                method: "POST",
                data: QueryConditionBuild(this.field_condition, this.page, this.size),
            }).then((response) => {
                this.result = response;
                if (this.result.hits) {
                    this.total = this.result.hits.total
                } else {
                    this.total = 0;
                }
            });
        },
        clear() {
            this.page = 1,
            this.size = 10;
            this.total = 0;
            this.field_condition = new Array<BaseQuery>();
            this.result = {};
        },
        sizeChange(size: number) {
            this.size = size;
            this.search();
        },
        pageChange(page: number) {
            this.page = page;
            this.search();
        }
    },
});
</script>

<style lang="less">
.base-search {
    padding: 10px;

    .base-content {
        margin-top: 20px;
        .page {
            width: 100%;
            text-align: center;
            margin-top: 10px;
        }
    }
}
</style>