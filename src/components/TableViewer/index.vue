<template>
    <div>
        <el-empty v-if="flag == 0" description="数据为空" />
        <json-viewer v-else-if="flag == 1" :value="data" :expand-depth="10" copyable sort expanded></json-viewer>
        <div v-else>
            <div style="text-align: right;padding-right: 40px;padding-bottom: 20px;">
                <el-popover placement="bottom" trigger="click">
                    <template #reference>
                        <el-button style="margin-right: 16px">显示列</el-button>
                    </template>
                    <div v-for="(mapping, index) in mappings" :prop="mapping" :key="index">
                        <el-checkbox :label="mapping.field" v-model="mapping.is_show"></el-checkbox>
                    </div>
                </el-popover>
            </div>
            <el-table :data="items" stripe>
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
                            {{ (typeof scope.row[mapping.field] === 'string') ? scope.row[mapping.field] :
                                    JSON.stringify(scope.row[mapping.field])
                            }}
                            <div class="dialog-open" @click="json_data = scope.row[mapping.field]; json_dialog = true"
                                :expanded="true">
                                <el-icon>
                                    <zoom-in />
                                </el-icon>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <json-dialog title="数据预览" :json="json_data" :open="true" v-model="json_dialog">
        </json-dialog>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ZoomIn } from "@element-plus/icons-vue";
import JsonDialog from "@/components/JsonDialog.vue";
import JsonViewer from 'vue-json-viewer';

interface Col {

    field: string;
    is_show: true;

}

export default defineComponent({
    name: 'table-viewer',
    props: {
        data: Object as PropType<any>,
        mapping: Object as PropType<any>
    },
    components: { ZoomIn, JsonDialog, JsonViewer },
    data: () => ({
        flag: 0,
        items: [] as Array<any>,
        mappings: [] as Array<Col>,
        json_dialog: false,
        json_data: {} as any
    }),
    watch: {
        data() {
            this.render();
        }
    },
    computed: {
        cols() {
            return this.mappings.filter(e => e.is_show);
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
        },
        verify_index(): boolean {
            if (!this.data) {
                return false;
            }
            if (!this.data.hits) {
                return false;
            }
            if (!this.data.hits.hits) {
                return false;
            }
            return true;
        },
        verify_mapping() {
            if (!this.mapping) {
                return false;
            }

            if (!this.mapping._doc) {
                return false;
            }

            if (!this.mapping._doc.properties) {
                return false;
            }
            return true;
        },
    }
});
</script>
<style scoped lang="less">
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