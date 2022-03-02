<template>
    <el-scrollbar class="chart-edit">
        <el-collapse v-model="collapse_index">
            <el-collapse-item title="基础设置" name="1">
                <el-form :model="chart">
                    <el-form-item label="名称">
                        <el-input v-model="chart.name" placeholder="请输入任务名称" style="width: 360px;"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input
                            v-model="chart.description"
                            :rows="5"
                            type="textarea"
                            placeholder="请输入任务描述"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="请求设置" name="2">
                <el-form :model="chart" class="request" label-width="68px">
                    <el-form-item label="请求方式">
                        <el-select v-model="chart.method" placeholder="请输入请求方式">
                            <el-option label="GET" value="GET"></el-option>
                            <el-option label="POST" value="POST"></el-option>
                            <el-option label="PUT" value="PUT"></el-option>
                            <el-option label="DELETE" value="DELETE"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请求路径">
                        <el-input v-model="chart.path" placeholder="请输入请求路径" style="width: 360px;"></el-input>
                    </el-form-item>
                    <el-form-item label="请求参数" v-show="chart.method === 'GET'">
                        <el-button type="primary" @click="addGetParam">新增</el-button>
                        <el-button @click="truncateGetParam">清空</el-button>
                    </el-form-item>
                    <el-form-item
                        label
                        v-show="chart.method === 'GET' && get_params.length > 0"
                        v-for="(param, index) in get_params"
                        :key="index"
                    >
                        <div class="item">
                            <el-input v-model="param.key" placeholder="请输入键"></el-input>
                            <div style="text-align: center;">=</div>
                            <el-input v-model="param.value" placeholder="请输入值"></el-input>
                            <div></div>
                            <el-button type="danger" @click="removeGetParam(param.id)">移除</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="请求体" v-show="chart.method !== 'GET'">
                        <monaco-editor v-model="chart.data" height="200px" class="post"></monaco-editor>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="效果预览" name="3">
                <el-button type="primary" @click="template_edit_dialog = true">模板编辑</el-button>
                <el-button type="success">数据展示</el-button>
            </el-collapse-item>
        </el-collapse>
        <el-dialog title="模板编辑" v-model="template_edit_dialog" fullscreen custom-class="template-edit">
            <template #footer>
                <el-button>清空</el-button>
                <el-button type="primary">确定</el-button>
            </template>
        </el-dialog>
    </el-scrollbar>
</template>
<script lang="ts">
import Chart from "@/entity/Chart";
import Param from "@/view/Param";
import MonacoEditor from "@/components/MonacoEditor.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'ChartEdit',
    components: { MonacoEditor },
    data: () => ({
        chart: {
            id: new Date().getTime(),
            name: '',
            index_id: 0,
            description: '',
            method: 'GET',
            path: '',
            params: '',
            data: '',
            template: ''
        } as Chart,
        collapse_index: ['1', '2'],
        // GET请求参数
        get_params: new Array<Param>(),
        template_edit_dialog: false
    }),
    methods: {
        addGetParam() {
            this.get_params.push({
                id: new Date().getTime(),
                key: '',
                value: ''
            });
        },
        removeGetParam(id: number) {
            this.get_params = this.get_params.filter(e => e.id !== id);
        },
        truncateGetParam() {
            this.get_params = new Array<Param>();
        }
    }
})
</script>
<style lang="less">
.chart-edit {
    .request {
        .item {
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: 0.5fr 26px 1fr 12px auto;
            margin-top: 12px;
        }
    }
}
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
    }
    .el-dialog__footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 62px;
    }
}
</style>