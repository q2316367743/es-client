<template>
    <el-dialog title="模板编辑" v-model="defaultDialog" fullscreen class="template-edit">
        <div class="source">
            <json-view :data="data" />
            <div class="template">
                <monaco-editor v-model="template" height="100%" class="post"></monaco-editor>
            </div>
        </div>
        <div class="target">
            <json-view :data="json" />
        </div>
        <template #footer>
            <div>
                <el-button type="primary" @click="search">获取数据</el-button>
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
import { defineComponent, PropType } from "vue";
import doT from 'dot';
import Chart from "@/entity/Chart";
import MonacoEditor from "@/components/MonacoEditor/index.vue";

import {httpStrategyContext} from "@/global/BeanFactory";
import JsonView from "@/components/JsonView/index.vue";
import MessageUtil from "@/utils/MessageUtil";

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
    components: {JsonView, MonacoEditor },
    props: {
        modelValue: Boolean,
        chart: Object as PropType<Chart>
    },
    emits: ['update:modelValue'],
    data: () => ({
        defaultDialog: false,
        data: {} as any,
        template: "",
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
    computed: {
        json() {
            try {
                return JSON.parse(this.result);
            } catch {
                return {};
            }
        }
    },
    created() {
        this.defaultDialog = this.modelValue;
    },
    methods: {
        render() {
            this.result = doT.template(this.template)(this.data);
        },
        search() {
            if (this.chart!.method === 'GET') {
                httpStrategyContext.getStrategy().es<any>({
                    url: this.chart!.path,
                    method: this.chart!.method,
                    params: this.chart!.params
                }).then((response) => {
                    this.data = response;
                });
            } else {
                let data = {};
                if (this.chart!.params != '') {
                    try {
                        data = JSON.parse(this.chart!.data);
                    } catch (e: any) {
                        MessageUtil.error('JSON格式化错误', e);
                    }
                }
                httpStrategyContext.getStrategy().es<any>({
                    url: this.chart!.path,
                    method: this.chart!.method,
                    data
                }).then((response) => {
                    this.data = response;
                });
            }
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
        grid-template-rows: 100%;
        grid-template-columns: 1fr 1fr;

        .source {
            display: grid;
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 1fr;

            &>div {
                margin: 10px;
                border: #909399 solid 1px;
                overflow: auto;
            }
        }

        .target {
            margin: 10px;
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