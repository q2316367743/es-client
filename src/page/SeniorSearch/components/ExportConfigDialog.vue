<template>
    <a-form :model="instance" layout="vertical">
        <a-form-item label=文件名>
            <a-input v-mode="instance.name" />
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { ExportScope, ExportSource, ExportType } from "@/components/ExportComponent/domain";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'export-config-dialog',
    data: () => ({
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
        }
    }),
});
</script>
<style scoped></style>