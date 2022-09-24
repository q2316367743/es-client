<template>
    <div>
        <el-empty v-if="flag === 0" :description="$t('app.component.data_is_empty')"/>
        <json-viewer v-else-if="flag === 1" :value="data" :expand-depth="10" copyable sort expanded></json-viewer>
        <div v-else class="table-viewer-show">
            <div class="table-viewer-column">
                <el-button style="margin-right: 6px" type="primary">新增</el-button>
                <el-popover placement="bottom" trigger="click">
                    <template #reference>
                        <el-button style="margin-right: 16px">{{ $t('app.component.display_column') }}</el-button>
                    </template>
                    <el-checkbox v-model="check_all" :indeterminate="isIndeterminate" @change="handle_check_all_change">
                        {{ $t('app.component.check_all') }}
                    </el-checkbox>
                    <div v-for="(mapping, index) in mappings" :key="index">
                        <el-checkbox :label="mapping.field" v-model="mapping.is_show"></el-checkbox>
                    </div>
                </el-popover>
            </div>
            <el-table :data="items" stripe class="table-viewer-table">
                <el-table-column type="expand">
                    <template #default="props">
                        <json-viewer :value="props.row.__self__" :expand-depth="10" copyable sort expanded>
                        </json-viewer>
                    </template>
                </el-table-column>
                <el-table-column sortable v-for="(mapping, index) in cols" :prop="mapping.field" :key="index"
                                 :label="mapping.field" width="200" show-overflow-tooltip>
                    <template #default="scope">
                        <div class="column">
                            {{
                                (typeof scope.row[mapping.field] === 'string') ? scope.row[mapping.field] :
                                    JSON.stringify(scope.row[mapping.field])
                            }}
                            <div class="dialog-open" @click="json_data = scope.row[mapping.field]; json_dialog = true">
                                <el-icon>
                                    <zoom-in/>
                                </el-icon>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <json-dialog :title="$t('home.index.info.data_preview')" :json="json_data" :open="true" v-model="json_dialog">
        </json-dialog>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ZoomIn} from "@element-plus/icons-vue";
import JsonDialog from "@/components/JsonDialog.vue";
import JsonViewer from 'vue-json-viewer';

interface Col {

    field: string;
    is_show: boolean;

}

export default defineComponent({
    name: 'table-viewer',
    props: {
        data: Object as PropType<any>,
        mapping: Object as PropType<any>
    },
    components: {ZoomIn, JsonDialog, JsonViewer},
    data: () => ({
        flag: 0,
        items: [] as Array<any>,
        mappings: [] as Array<Col>,
        json_dialog: false,
        json_data: {} as any,
        check_all: true
    }),
    watch: {
        data() {
            this.render();
        }
    },
    computed: {
        cols() {
            return this.mappings.filter(e => e.is_show);
        },
        isIndeterminate() {
            // 展示的
            let temp = this.mappings.filter(e => e.is_show);
            return temp.length > 0 && temp.length < this.mappings.length;
        }
    },
    created() {
        this.render();
    },
    methods: {
        render() {
            // 当变化时，进行渲染
            if (!this.verify_index()) {
                this.flag = 0;
                if (this.data?.status) {
                    this.flag = 1;
                }
                return;
            } else {
                this.flag = 2;
            }
            this.items = [];
            this.mappings = [{
                field: '_id',
                is_show: true
            }, {
                field: '_index',
                is_show: true
            }, {
                field: '_score',
                is_show: true
            }];
            let verify_mapping = this.verify_mapping();
            // 原生映射
            if (verify_mapping) {
                for (let key in this.mapping._doc.properties) {
                    this.mappings.push({
                        field: key,
                        is_show: true
                    });
                }
            }
            for (let item of this.data.hits.hits) {
                let i = {} as any;
                for (let key in item) {
                    if (key !== '_source') {
                        i[key] = item[key];
                    } else {
                        for (let source in item[key]) {
                            i[source] = item[key][source];
                            if (!verify_mapping) {
                                if (this.mappings.map(mapping => mapping.field).indexOf(source) === -1) {
                                    // 渲染映射
                                    this.mappings.push({
                                        field: source,
                                        is_show: true
                                    });
                                }

                            }
                        }
                    }
                }
                i['__self__'] = item;
                this.items.push(i);
            }
            // 每次渲染清空状态
            this.check_all = true;
        },
        verify_index(): boolean {
            if (!this.data) {
                return false;
            }
            if (!this.data.hits) {
                return false;
            }
            return this.data.hits.hits;

        },
        verify_mapping() {
            if (!this.mapping) {
                return false;
            }

            if (!this.mapping._doc) {
                return false;
            }

            return this.mapping._doc.properties;

        },
        handle_check_all_change() {
            if (this.isIndeterminate) {
                // 如果处于中间态，则全选
                this.mappings.forEach(e => e.is_show = true);
                this.check_all = true;
            } else {
                // 如果不是处于中间态
                if (!this.check_all) {
                    // 如果全选，则改为全不选
                    this.mappings.forEach(e => e.is_show = false);
                    this.check_all = false;
                } else {
                    // 如果全不选，则改为全选
                    this.mappings.forEach(e => e.is_show = true);
                    this.check_all = true;
                }
            }
        }
    }
});
</script>
<style scoped lang="less">
.table-viewer-show {
    overflow: auto;
}

.table-viewer-column {
    z-index: 10;
    position: absolute;
    right: 20px;
    top: 0;
}

.table-viewer-table {
    position: absolute;
    top: 50px;
    right: 10px;
    left: 0;
}

.column {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .dialog-open {
        display: none;
        position: absolute;
        top: 8px;
        right: 0;
        height: 23px;
        width: 23px;
        cursor: pointer;
    }

    &:hover .dialog-open {
        display: block;
    }
}
</style>