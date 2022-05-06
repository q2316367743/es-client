<template>
    <div class="base-search">
        <el-scrollbar>
            <!-- 查询条件 -->
            <div class="base-option">
                <div class="el-card es-card">
                    <!-- 标题 -->
                    <div class="el-card__header base-option-header">
                        <div>{{ $t('base_search.query_criteria') }}</div>
                        <div class="right">
                            <el-button type="text" @click="show_body">{{ $t('base_search.display_query_statement') }}
                            </el-button>
                            <el-button type="text" @click="search">{{ $t('base_search.refresh') }}</el-button>
                            <el-button type="text" @click="is_show = !is_show">{{ is_show ? $t('base_search.close') :
                                    $t('base_search.open')
                            }}
                            </el-button>
                        </div>
                    </div>
                    <!-- 内容 -->
                    <div class="el-card__body" v-show="is_show">
                        <el-form label-position="top" label-width="80px" style="overflow: auto">
                            <!-- 文档 -->
                            <el-form-item>
                                <el-form-item :label="$t('base_search.document')"
                                    style="margin-right: 100px;margin-bottom: 20px;">
                                    <el-select-v2 v-model="index" filterable :options="indices"
                                        :placeholder="$t('base_search.please_select')" clearable style="width: 360px;">
                                        <template #default="{ item }">
                                            <div style="font-size: var(--el-font-size-base);">{{ item.name }}</div>
                                        </template>
                                    </el-select-v2>
                                    <el-button type="primary" style="margin-left: 10px" @click="search">{{
                                            $t('base_search.search')
                                    }}</el-button>
                                    <el-button style="margin-left: 10px" @click="clear(true)">{{ $t('base_search.clear')
                                    }}
                                    </el-button>
                                </el-form-item>
                                <el-form-item label="视图：" style="margin-right: 100px;margin-bottom: 20px;">
                                    <el-select v-model="view">
                                        <el-option :label="$t('senior_search.base_view')" :value="1"></el-option>
                                        <el-option :label="$t('senior_search.json_view')" :value="2"></el-option>
                                        <el-option :label="$t('senior_search.table_view')" :value="3">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="分页：" style="margin-right: 100px;margin-bottom: 20px;">
                                    <el-pagination background layout="sizes, prev, pager, next" :total="total"
                                        :current-page="page" :page-size="size" @size-change="sizeChange"
                                        @current-change="pageChange"></el-pagination>
                                </el-form-item>
                            </el-form-item>
                            <!-- 条件 -->
                            <el-form-item :label="$t('base_search.condition')" style="min-width: 1100px">
                                <div v-if="field_condition.length === 0">
                                    <el-button type="primary" @click="field_condition_add">{{ $t('base_search.add') }}
                                    </el-button>
                                </div>
                                <div>
                                    <div v-for="(item, idx) in field_condition" :key="idx"
                                        style="margin-bottom: 10px;display: flex;">
                                        <field-condition-item v-model:value="field_condition[idx]" :fields="fields">
                                        </field-condition-item>
                                        <el-button type="primary" style="margin-left: 10px"
                                            @click="field_condition_add">{{ $t('base_search.add') }}</el-button>
                                        <el-button type="danger" @click="field_condition_remove(item.id)">{{
                                                $t('base_search.remove')
                                        }}</el-button>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <!-- 查询结果 -->
            <div class="base-content">
                <el-card shadow="never">
                    <base-viewer v-if="view === 1" :data="result"></base-viewer>
                    <json-viewer v-else-if="view === 2" :value="result" :expand-depth="6" copyable sort expanded>
                    </json-viewer>
                    <table-viewer v-if="view === 3" :data="result" :mapping="mapping"></table-viewer>
                </el-card>
            </div>
        </el-scrollbar>
        <el-backtop target=".el-scrollbar__wrap" />
        <el-dialog :title="$t('base_search.query_criteria')" v-model="condition_dialog" width="70%" append-to-body
            custom-class="es-dialog" :close-on-click-modal="false">
            <json-viewer :value="condition_data" :expand-depth="4" copyable sort expanded preview-mode></json-viewer>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from "vue-json-viewer";
import BaseViewer from "@/components/BaseViewer.vue";
import TableViewer from "@/components/TableViewer/index.vue"
import { ElMessageBox } from "element-plus";
import axios from "@/plugins/axios";
import BaseQuery from '@/entity/BaseQuery';
import QueryConditionBuild from './build/QueryConditionBuild';
import FieldConditionItem from "./components/FieldConditionItem.vue";
import { mapState } from "pinia";
import { useIndexStore } from "@/store/IndexStore";
import { useSettingStore } from "@/store/SettingStore";
import Field from "@/view/Field";

interface Name {
    name: string;
    fields: Array<Field>;
    label: string;
    value: string;
}

// 公共方法
export default defineComponent({
    name: 'BaseSearch',
    components: {
        JsonViewer,
        BaseViewer,
        TableViewer,
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
            mapping: {} as any,
            // 视图
            view: useSettingStore().getDefaultViewer
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
        ...mapState(useSettingStore, ['default_viewer']),
        fields() {
            if (this.index === '') {
                return new Array<Field>();
            }
            // 重置字段
            for (let index of this.indices) {
                if (index.name === this.index) {
                    return index.fields.sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    });
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
        default_viewer() {
            this.view = useSettingStore().getDefaultViewer
        }
    },
    methods: {
        field_condition_add(): void {
            this.field_condition.push({
                id: new Date().getTime(),
                type: 'must',
                field: '',
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
        clear(clear_index: boolean = false) {
            this.page = 1;
            this.size = 10;
            this.total = 0;
            this.field_condition = new Array<BaseQuery>();
            this.result = {};
            if (clear_index) {
                this.index = '';
            }
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
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .base-option {
        .base-option-header {
            display: flex;
            justify-content: space-between;

            .right {
                display: flex;
            }
        }
    }

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