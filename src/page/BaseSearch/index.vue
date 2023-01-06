<template>
    <div class="base-search">
        <!-- 顶部菜单栏 -->
        <div class="base-option el-card es-card">
            <div class="left">
                <el-select-v2 v-model="index" filterable :options="indices"
                              :placeholder="$t('base_search.please_select')" clearable style="width: 360px;">
                    <template #default="{ item }">
                        <div style="font-size: var(--el-font-size-base);">{{ item.name }}</div>
                    </template>
                </el-select-v2>
                <!-- 搜索 -->
                <el-button type="success" style="margin-left: 10px" @click="search">{{
                        $t('base_search.search')
                    }}
                </el-button>
                <!-- 清空 -->
                <el-button style="margin-left: 10px" @click="clear(true)">{{
                        $t('base_search.clear')
                    }}
                </el-button>
            </div>
            <div class="right">
                <el-select v-model="view">
                    <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                    <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                    <el-option :label="$t('senior_search.table_view')" :value="3"></el-option>
                </el-select>
            </div>
        </div>
        <!-- 核心查询区 -->
        <div class="base-display">
            <el-scrollbar style="height: 100%">
                <!-- 查询条件 -->
                <div class="base-condition el-card">
                    <el-form label-position="top" label-width="80px" style="overflow: auto">
                        <!-- 条件 -->
                        <el-form-item :label="$t('base_search.condition')" style="min-width: 1100px">
                            <div v-if="fieldConditions.length === 0">
                                <el-button type="primary" @click="fieldConditionAdd">{{ $t('base_search.add') }}
                                </el-button>
                            </div>
                            <div v-for="(item, idx) in fieldConditions" :key="idx"
                                 style="margin-bottom: 10px;display: flex;">
                                <field-condition-item v-model="fieldConditions[idx]" :fields="fields">
                                </field-condition-item>
                                <el-button type="primary" style="margin-left: 10px" @click="fieldConditionAdd">{{
                                        $t('base_search.add')
                                    }}
                                </el-button>
                                <el-button type="danger" @click="fieldConditionRemove(item.id)">{{
                                        $t('base_search.remove')
                                    }}
                                </el-button>
                            </div>
                        </el-form-item>
                        <!-- 排序 -->
                        <el-form-item :label="$t('base_search.order')">
                            <div v-if="orders.length === 0">
                                <el-button type="primary" @click="order_add">{{ $t('base_search.add') }}
                                </el-button>
                            </div>
                            <div style="display: flex;margin-bottom: 10px;width: 100%;" v-for="(order, idx) in orders"
                                 :key="idx">
                                <el-select v-model="orders[idx].field" filterable
                                           :placeholder="$t('base_search.select_placeholder')"
                                           style="margin-left: 10px">
                                    <el-option v-for="(field, idx1) in fields" :key="idx1" :label="field.name"
                                               :value="field.name"></el-option>
                                </el-select>
                                <el-select v-model="orders[idx].type" filterable
                                           :placeholder="$t('base_search.select_placeholder')"
                                           style="margin-left: 10px">
                                    <el-option label="asc" value="asc"></el-option>
                                    <el-option label="desc" value="desc"></el-option>
                                </el-select>
                                <el-button type="primary" style="margin-left: 10px" @click="order_add">{{
                                        $t('base_search.add')
                                    }}
                                </el-button>
                                <el-button type="danger" @click="order_remove(order.id)">{{
                                        $t('base_search.remove')
                                    }}
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div class="base-search-condition-sentence">
                        <el-button link type="primary" @click="showBody">{{ $t('base_search.display_query_statement') }}
                        </el-button>
                        <el-button link type="primary" @click="jumpToSeniorSearch">跳转到高级查询</el-button>
                    </div>
                </div>
                <!-- 查询结果 -->
                <div class="base-content">
                    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                                   v-model:current-page="page" v-model:page-size="size"></el-pagination>
                    <data-view :view="view" :result="result" :mapping="mapping"/>
                </div>
            </el-scrollbar>
            <el-backtop :right="40" :bottom="60" target=".base-display .el-scrollbar__wrap" v-show="show_top"/>
        </div>
        <el-dialog :title="$t('base_search.query_criteria')" v-model="condition_dialog" width="70%" append-to-body
                   class="es-dialog" :close-on-click-modal="false">
            <json-viewer :value="condition_data" :expand-depth="4" copyable sort expanded preview-mode></json-viewer>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ElMessageBox} from "element-plus";
import {mapState} from "pinia";

import JsonViewer from "vue-json-viewer";
import BaseViewer from "@/components/BaseViewer.vue";
import TableViewer from "@/components/TableViewer/index.vue"

import IndexApi from "@/api/IndexApi";

import mitt from '@/plugins/mitt';

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";

import BaseQuery from '@/domain/BaseQuery';
import BaseOrder from "@/domain/BaseOrder";

import QueryConditionBuild from './build/QueryConditionBuild';
import FieldConditionItem from "./components/FieldConditionItem.vue";
import Field from "@/view/Field";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import DataView from "@/components/DataView/index.vue";
import PageNameEnum from "@/enumeration/PageNameEnum";
import {usePageJumpEvent, useSeniorSearchEvent} from "@/global/BeanFactory";

interface Name {
    name: string;
    fields: Array<Field>;
    label: string;
    value: string;
}

// 公共方法
export default defineComponent({
    name: 'base-search',
    components: {
        DataView,
        JsonViewer,
        BaseViewer,
        TableViewer,
        FieldConditionItem
    },
    data: () => {
        return {
            // 选择的索引名称
            index: '',
            // 条件
            fieldConditions: new Array<BaseQuery>(),
            // 分页
            page: 1,
            size: useSettingStore().getPageSize,
            total: 0,
            // 条件对话框
            condition_dialog: false,
            // 渲染后的数据
            condition_data: {},
            // 查询结果
            result: {} as any,
            mapping: {} as any,
            // 视图
            view: useSettingStore().getDefaultViewer,
            orders: new Array<BaseOrder>(),
            show_top: true
        };
    },
    computed: {
        ...mapState(useIndexStore, {
            indices: (state) => {
                let names = new Array<Name>();
                let indices = state.indices;
                indices.forEach(e => {
                    names.push({
                        name: e.name,
                        fields: e.fields,
                        label: e.name,
                        value: e.name
                    });
                    e.alias.forEach(a => names.push({
                        name: a,
                        fields: e.fields,
                        label: e.name,
                        value: a
                    }))
                });
                return names.sort((a, b) => {
                    return a.name.localeCompare(b.name, "zh-CN");
                });
            }
        }),
        ...mapState(useSettingStore, ["instance"]),
        fields() {
            if (this.index === '') {
                return new Array<Field>();
            }
            // 重置字段
            for (let index of this.indices) {
                if (index.name === this.index) {
                    return [...index.fields.sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    }), {
                        name: '_doc._id',
                        type: 'text'
                    }];
                }
            }
            return new Array<Field>();
        },
    },
    watch: {
        index() {
            // 索引变化，重置查询
            this.clear();
            if (this.index !== '') {
                this.search();
            }
        },
        instance() {
            this.view = useSettingStore().getDefaultViewer
        },
        size(newValue: number) {
            this.size = newValue;
            this.search();
        },
        page(newValue: number) {
            this.page = newValue;
            this.search();
        },
    },
    created() {
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置条件
            this.clear(true);
        });
        mitt.on(MessageEventEnum.PAGE_ACTIVE, (index) => {
            this.show_top = (index === PageNameEnum.BASE_SEARCH)
        });
    },
    methods: {
        fieldConditionAdd(): void {
            this.fieldConditions.push({
                id: new Date().getTime(),
                type: 'must',
                field: '',
                condition: 'term',
                value: '',
                extra_left_condition: '',
                extra_left_value: '',
                extra_right_condition: '',
                extra_right_value: ''
            });
        },
        fieldConditionRemove(id: number): void {
            console.log(this.fieldConditions, id);
            if (this.fieldConditions.length === 0) {
                return;
            }
            this.fieldConditions = this.fieldConditions.filter((item) => {
                return item.id !== id;
            });
            console.log(this.fieldConditions, id);
        },
        showBody() {
            this.condition_data = QueryConditionBuild(this.fieldConditions, this.page, this.size, this.orders);
            this.condition_dialog = true;
        },
        search() {
            if (this.index.length === 0) {
                ElMessageBox.alert(this.$t('base_search.please_select_an_index'));
                return;
            }
            IndexApi._search(
                this.index,
                QueryConditionBuild(this.fieldConditions, this.page, this.size, this.orders)
            ).then((response) => {
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
            }).catch((e) => {
                this.result = e.response.data;
            });
        },
        clear(clear_index: boolean = false) {
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.total = 0;
            this.fieldConditions = new Array<BaseQuery>();
            this.orders = new Array<BaseOrder>();
            this.result = {};
            if (clear_index) {
                this.index = '';
            }
        },
        order_add() {
            this.orders.push({
                id: new Date().getTime(),
                field: '',
                type: 'asc'
            });
        },
        order_remove(id: number) {
            if (this.orders.length === 0) {
                return;
            }
            this.orders = this.orders.filter((item) => {
                return item.id !== id;
            });
        },
        jumpToSeniorSearch() {
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            useSeniorSearchEvent.emit({
                url: `/${this.index}/_search`,
                method: 'POST',
                param: JSON.stringify(
                    QueryConditionBuild(this.fieldConditions, this.page, this.size, this.orders),
                    null,
                    4),
                execute: true
            })
        }
    },
});
</script>

<style lang="less">
.base-search {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .base-option {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 9px 10px 0 10px;
        display: flex;
        justify-content: space-between;
        height: 50px;

        .left .right {
            display: flex;
        }
    }

    .base-display {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;

        .base-condition {
            padding: 18px 20px;
            margin-top: 12px;
            position: relative;

            .base-search-condition-sentence {
                position: absolute;
                top: 30px;
                right: 20px;
            }
        }

        .base-content {
            margin-top: 20px;
            position: relative;

            .el-pagination {
                padding: 2px 0;
            }

            .page {
                width: 100%;
                text-align: center;
                margin-top: 10px;
            }

            .base-search-table-view {
                position: absolute;
            }

            .editor-viewer {
                margin-top: 10px;
            }
        }
    }
}
</style>