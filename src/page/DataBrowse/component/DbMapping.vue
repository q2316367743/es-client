<template>
    <el-drawer v-model="drawer" direction="rtl" :title="title" size="50%"
               append-to-body>
        <el-tabs v-model="active">
            <el-tab-pane label="映射结构" name="mapping" style="height: calc(100vh - 54px - 41px - 80px);">
                <el-scrollbar>
                    <json-view :data="mapping"/>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="索引设置" name="settings" style="height: calc(100vh - 54px - 41px - 80px);">
                <el-scrollbar>
                    <json-view :data="settings"/>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonView from "@/components/JsonView/index.vue";

export default defineComponent({
    name: 'db-mapping',
    components: {JsonView},
    props: {
        modelValue: Boolean,
        mapping: Object,
        settings: Object,
        title: String
    },
    data: () => ({
        drawer: false,
        active: 'mapping'
    }),
    watch: {
        modelValue(newValue: boolean) {
            this.drawer = newValue;
        },
        drawer(newValue: boolean) {
            this.$emit('update:modelValue', newValue);
        }
    }
});
</script>
<style scoped>

</style>