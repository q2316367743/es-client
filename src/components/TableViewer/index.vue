<template>
    <div>
        <el-empty v-if="is_error" description="结果集解析错误" />
        <el-table :data="items" border stripe>
            <el-table-column v-for="(mapping, index) in mappings" :prop="mapping" :key="index" :label="mapping">
                <template #default="scope">
                    <div class="column">
                        {{ (typeof scope.row[mapping] === 'string') ? scope.row[mapping] :
                            JSON.stringify(scope.row[mapping])
                    }}
                    </div>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: 'table-viewer',
    props: {
        data: Object as PropType<any>,
        mapping: Object as PropType<any>
    },
    data: () => ({
        is_error: false,
        items: [] as Array<any>,
        mappings: [] as Array<string>
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
                this.is_error = true;
                return;
            } else {
                this.is_error = false;
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
                let i = {};
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
}
</style>