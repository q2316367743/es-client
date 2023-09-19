<template>
    <a-drawer v-model:visible="visible" title="数据导出" render-to-body unmount-on-close
              width="350px" mask-closable>
        <a-form :model="instance" layout="vertical">
            <a-form-item label=文件名>
                <a-input v-model="instance.name"/>
            </a-form-item>
            <a-form-item label="文件类型">
                <a-select v-model="instance.type">
                    <a-option :value="ExportType.JSON">JSON文件(*.json)</a-option>
                    <a-option :value="ExportType.XLSX">表格(*.xlsx)</a-option>
                    <a-option :value="ExportType.CSV">CSV(*.csv)</a-option>
                    <a-option :value="ExportType.TSV">管道分隔(*.txt)</a-option>
                    <a-option :value="ExportType.TXT">文本文件(*.txt)</a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="分隔符" v-if="instance.type === ExportType.TXT">
                <a-input v-model="instance.separator"/>
            </a-form-item>
            <a-form-item label="导出范围">
                <a-select v-model="instance.scope">
                    <a-option :value="ExportScope.CURRENT">当前页面</a-option>
                    <a-option :value="ExportScope.ALL">全部</a-option>
                    <a-option :value="ExportScope.CUSTOM">自定义范围</a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="范围" v-if="instance.scope === ExportScope.CUSTOM">
                <a-input-group>
                    <a-input-number v-model="instance.customStart" :min="1"/>
                    <span> - </span>
                    <a-input-number v-model="instance.customEnd" :max="instance.customStart"/>
                </a-input-group>
            </a-form-item>
            <a-form-item label="每页大小" v-if="instance.scope === ExportScope.CUSTOM">
                <a-input-number v-model="instance.size" :min="1"/>
            </a-form-item>
            <a-form-item label="来源">
                <a-select v-model="instance.source">
                    <a-option :value="ExportSource.ALL"
                              :disabled="!allowExportTypes.includes(instance.type)">全部
                    </a-option>
                    <a-option :value="ExportSource.HIT">只导出hits</a-option>
                    <a-option :value="ExportSource.SOURCE">只导出_source内容</a-option>
                </a-select>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button type="text" status="normal" @click="exportCopy" :disabled="instance.type === ExportType.XLSX">
                {{ $t('common.action.copy') }}
            </a-button>
            <a-button @click="visible = false">取消</a-button>
            <a-button type="primary" @click="exportDownload">导出</a-button>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
import {exportData} from "@/components/ExportComponent";
import {
    ExportConfig,
    ExportScope,
    ExportSource,
    ExportType,
    ExportMode
} from "@/components/ExportComponent/domain";
import useLoadingStore from "@/store/LoadingStore";
import MessageUtil from "@/utils/MessageUtil";
import {markRaw, ref, watch} from "vue";
import {useExportEvent} from "@/global/BeanFactory";

const allowExportTypes = markRaw<Array<ExportType>>([ExportType.JSON]);
const visible = ref(false);
const instance = ref<ExportConfig>({
    name: '数据导出',
    type: ExportType.JSON,
    separator: '',
    scope: ExportScope.CURRENT,
    customStart: 1,
    customEnd: 1,
    source: ExportSource.ALL,
    fields: [],
    size: 1000,
    mode: ExportMode.DOWNLOAD,
    search: {},
    index: ''
});

watch(() => instance.value.type, value => {
    switch (value) {
        case ExportType.XLSX:
        case ExportType.CSV:
        case ExportType.TSV:
        case ExportType.TXT:
            if (instance.value.source === ExportSource.ALL) {
                MessageUtil.warning('导出结构化数据，只能导出hits中或_source中的数据');
                instance.value.source = ExportSource.HIT;
            }
            break;
    }
});

useExportEvent.reset();
useExportEvent.on(event => {
    visible.value = true;
    instance.value = {
        name: event.name,
        type: ExportType.JSON,
        separator: '',
        scope: ExportScope.CURRENT,
        customStart: 1,
        customEnd: 1,
        source: ExportSource.ALL,
        fields: [],
        size: 1000,
        mode: ExportMode.DOWNLOAD,
        search: event.search,
        index: event.index
    }

})

function exportCopy() {
    instance.value.mode = ExportMode.COPY;
    execute();
}

function exportDownload() {
    instance.value.mode = ExportMode.DOWNLOAD;
    execute();
}

function execute() {
    useLoadingStore().start('开始导出');
    exportData(instance.value)
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useLoadingStore().close());
}

</script>
<style scoped></style>
