<template>
    <a-modal v-model:visible="exportDialog" title="导出数据" width="600px" height="400px" draggable>
        <div style="display: flex;justify-content: center;align-items: center;margin-top: 40px;">
            <a-form :model="exportConfig" label-width="120px">
                <a-form-item label="文件名">
                    <a-input v-model="exportConfig.name" style="width: 215px;" />
                </a-form-item>
                <a-form-item label="保存类型">
                    <a-select v-model="exportConfig.type">
                        <a-option label="JSON数据（*.json）" :value="1" />
                        <a-option label="网页（*.html）" :value="2" disabled />
                        <a-option label="XML数据（*.xml）" :value="3" />
                        <a-option label="YAML数据（*.yaml）" :value="4" />
                    </a-select>
                </a-form-item>
                <a-form-item label="选择数据">
                    <a-select v-model="exportConfig.data">
                        <a-option label="当前数据（当前页的数据）" :value="1" />
                        <a-option label="选中数据（当前页选中的数据）" :value="2" disabled />
                    </a-select>
                </a-form-item>
                <a-form-item label="文件内容">
                    <a-select v-model="exportConfig.result">
                        <a-option label="表格数据" :value="1" />
                        <a-option label="原始数据" :value="2" />
                        <a-option label="原始结果集" :value="3" :disabled="exportConfig.type === 2" />
                    </a-select>
                </a-form-item>
            </a-form>
        </div>
        <template #footer>
            <a-button @click="runExportDialog(1)" type="text">复制到剪切板</a-button>
            <a-button @click="exportDialog = false">取消</a-button>
            <a-button @click="runExportDialog(3)" type="primary">导出</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import ExportConfig from "@/page/DataBrowse/domain/ExportConfig";
import exportData from "@/page/DataBrowse/domain/ExportData";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'export-dialog',
    props: {
        modelValue: Boolean,
        records: Object as PropType<Array<any>>,
        result: Object,
        indexName: {
            type: String,
            required: false,
            default: ''
        }
    },
    data: () => ({
        exportDialog: false,
        exportConfig: {
            name: '',
            type: 1,
            data: 1,
            result: 1,
            config: 1,
            fields: new Array<string>()
        } as ExportConfig
    }),
    watch: {
        modelValue(newValue: boolean) {
            this.exportDialog = newValue;
            if (newValue) {
                this.exportConfig = {
                    name: this.indexName === '' ? (new Date().getTime() + '') : this.indexName,
                    type: 1,
                    data: 1,
                    result: 1,
                    config: 1,
                    fields: new Array<string>()
                }
            }
        },
        exportDialog(newValue: boolean) {
            this.$emit('update:modelValue', newValue);
        },
        'exportConfig.type': {
            handler(newValue) {
                // 如果变为html，则不能导出全部数据
                if (newValue === 2) {
                    if (this.exportConfig.result === 3) {
                        this.exportConfig.result = 1;
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        runExportDialog(config: number) {
            this.exportConfig.config = config;
            // 根据类型判断结果
            try {
                if (!this.records) {
                    MessageUtil.error('记录错误');
                    return;
                }
                if (!this.result) {
                    MessageUtil.error('结果集错误');
                    return;
                }
                exportData(this.exportConfig, this.records, this.result);
                this.exportDialog = false;
                // 提示
                MessageUtil.success(config === 1 ? '成功复制到剪切板' : config === 2 ? '成功打印' : config === 3 ? '成功导出' : '成功');
            } catch (e) {
                MessageUtil.error('导出失败');
            }
        }
    }
});
</script>
<style scoped></style>