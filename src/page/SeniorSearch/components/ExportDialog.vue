<template>
    <a-modal v-model:visible="visible" title="数据导出" render-to-body unmount-on-close :mask-closable="false">
        <a-form :model="instance" layout="vertical">
            <a-form-item label=文件名>
                <a-input v-model="instance.name" />
            </a-form-item>
            <a-form-item label="文件类型">
                <a-select v-model="instance.type">
                    <a-option :value="ExportType.JSON">JSON文件(*.json)</a-option>
                    <a-option :value="ExportType.YML">YML文件(*.yml)</a-option>
                    <a-option :value="ExportType.XML">XML文件(*.xml)</a-option>
                    <a-option :value="ExportType.HTML">网页(*.html)</a-option>
                    <a-option :value="ExportType.CSV">CSV(*.csv)</a-option>
                    <a-option :value="ExportType.TSV">管道分隔(*.tsv)</a-option>
                    <a-option :value="ExportType.TXT">文本文件(*.txt)</a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="分隔符" v-if="instance.type === ExportType.TXT">
                <a-input v-model="instance.separator" />
            </a-form-item>
            <a-form-item label="导出范围">
                <a-select v-model="instance.scope">
                    <a-option :value="ExportScope.ALL">全部</a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="来源">
                <a-select v-model="instance.source">
                    <a-option :value="ExportSource.ALL">全部</a-option>
                    <a-option :value="ExportSource.HIT">只导出hits</a-option>
                    <a-option :value="ExportSource.SOURCE">只导出_source内容</a-option>
                </a-select>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="visible = false">取消</a-button>
            <a-button type="primary" @click="exportExecute">导出</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import { exportData } from "@/components/ExportComponent";
import { ExportScope, ExportSource, ExportType } from "@/components/ExportComponent/domain";
import useLoadingStore from "@/store/LoadingStore";
import MessageUtil from "@/utils/MessageUtil";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: 'senior-search-export-dialog',
    emits: ['update:modelValue'],
    props: {
        data: {
            type: Object as PropType<any>,
            required: true
        },
        modelValue: Boolean
    },
    data: () => ({
        visible: false,
        instance: {
            name: '高级查询数据导出',
            type: ExportType.JSON,
            separator: '',
            scope: ExportScope.ALL,
            customStart: 0,
            customEnd: -1,
            source: ExportSource.ALL,
            fields: [],
            size: 1000
        },
        ExportType,
        ExportScope,
        ExportSource
    }),
    watch: {
        modelValue(newValue: boolean) {
            this.visible = newValue;
        },
        visible(newValue: boolean) {
            this.$emit('update:modelValue', newValue);
        },
        'instance.type': {
            handler(newValue: ExportType) {
                switch (newValue) {
                    case ExportType.HTML:
                    case ExportType.CSV:
                    case ExportType.TSV:
                    case ExportType.TXT:
                        if(this.instance.source === ExportSource.ALL) {
                            MessageUtil.warning('导出结构化数据，只能导出hits中或_source中的数据');
                            this.instance.source = ExportSource.HIT;
                        }
                        break;
                }
            }
        }
    },
    methods: {
        exportExecute() {
            try {
                useLoadingStore().start('开始导出');
                exportData(this.instance, this.data);
                this.visible = false;
            } catch (e) {
                MessageUtil.error('导出失败', e);
            } finally {
                useLoadingStore().close();
            }
        }
    }
});
</script>
<style scoped></style>