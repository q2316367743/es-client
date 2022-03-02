<template>
    <el-dialog title="模板编辑" v-model="defaultDialog" fullscreen custom-class="template-edit">
        <div class="source">
            <div></div>
            <div></div>
        </div>
        <div class="target">
            <code>
                <pre>{{ result }}</pre>
            </code>
        </div>
        <template #footer>
            <div>
                <el-button type="primary">获取数据</el-button>
                <el-button type="success" @click="render">渲染</el-button>
            </div>
            <div>
                <el-button>清空</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import Chart from "@/entity/Chart";
import { defineComponent, PropType } from "vue";
import doT from 'dot'

// doT.templateSettings = {
//     evaluate: /\{\{([\s\S]+?)\}\}/g,
//     interpolate: /\{\{=([\s\S]+?)\}\}/g,
//     encode: /\{\{!([\s\S]+?)\}\}/g,
//     use: /\{\{#([\s\S]+?)\}\}/g,
//     define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
//     conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
//     iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
//     varname: 'it',
//     strip: true,
//     append: true,
//     selfcontained: false
// };

export default defineComponent({
    props: {
        modelValue: Boolean,
        chart: Object as PropType<Chart>
    },
    emits: ['update:modelValue'],
    data: () => ({
        defaultDialog: false,
        data: { "name": "Jake", "age": 31 } as any,
        template: "<div>Hi {{= it.name}}!</div><div>{{= it.age || ''}}</div>",
        result: '',
    }),
    watch: {
        modelValue() {
            this.defaultDialog = this.modelValue;
        },
        defaultDialog() {
            this.$emit('update:modelValue', this.defaultDialog);
        }
    },
    created() {
        this.defaultDialog = this.modelValue;
    },
    methods: {
        render() {
            this.result = doT.template(this.template)(this.data);
        }
    }
});
</script>
<style lang="less">
.template-edit {
    .el-dialog__header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 54px;
    }
    .el-dialog__body {
        position: absolute;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 62px;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 1fr;
        .source {
            display: grid;
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 1fr;
            div {
                margin: 20px;
                border: #909399 solid 1px;
            }
        }
        .target {
            margin: 20px;
            border: #909399 solid 1px;
        }
    }
    .el-dialog__footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 62px;
        display: flex;
        justify-content: space-between;
    }
}
</style>