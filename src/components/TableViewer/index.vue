<template>
    <div>
        <el-empty v-if="flag == 0" description="数据为空" />
        <json-viewer v-else-if="flag == 1" :value="data" :expand-depth="10" copyable sort expanded></json-viewer>
        <el-table v-else :data="items" stripe>
            <el-table-column type="expand">
                <template #default="props">
                    <json-viewer :value="props.row.__self__" :expand-depth="10" copyable sort expanded></json-viewer>
                </template>
            </el-table-column>
            <el-table-column sortable v-for="(mapping, index) in mappings" :prop="mapping" :key="index" :label="mapping"
                v-if="mapping !== '__self__'" width="200">
                <template #default="scope">
                    <div class="column">
                        {{ (typeof scope.row[mapping] === 'string') ? scope.row[mapping] :
                                JSON.stringify(scope.row[mapping])
                        }}
                        <div class="dialog-open" @click="json_data = scope.row[mapping]; json_dialog = true" :expanded="true">
                            <el-icon>
                                <zoom-in />
                            </el-icon>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <json-dialog title="数据预览" :json="json_data" :open="true" v-model="json_dialog">
        </json-dialog>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ZoomIn } from "@element-plus/icons-vue";
import JsonDialog from "@/components/JsonDialog.vue";
import JsonViewer from 'vue-json-viewer';

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
        mappings: [] as Array<string>,
        json_dialog: false,
        json_data: {} as any
    }),
    watch: {
        data() {
            this.render();
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
            this.mappings = ['_id', '_index', '_score'];
            let verify_mapping = this.verify_mapping();
            if (verify_mapping) {
                for (let key in this.mapping._doc.properties) {
                    this.mappings.push(key);
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
                                if (this.mappings.indexOf(source) === -1) {
                                    this.mappings.push(source);
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