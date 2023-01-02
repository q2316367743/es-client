<template>
    <el-dialog
        :title="title"
        v-model="visible"
        width="70%"
        append-to-body
        class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <el-scrollbar>
            <json-viewer
                :value="json"
                :expand-depth="4"
                copyable
                sort
                :expanded="open"
                :preview-mode="previewMode"
            ></json-viewer>
        </el-scrollbar>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from 'vue-json-viewer';

export default defineComponent({
    components: {
        JsonViewer
    },
    props: {
        value: Boolean,
        title: String,
        json: Object,
        open: {
            type: Boolean,
            required: false,
            default: false
        },
        previewMode: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: () => ({
        visible: false,
    }),
    created() {
        this.visible = this.value;
    },
    watch: {
        visible(now) {
            this.$emit("update:value", now);
        }
    }
});
</script>
<style>
.es-dialog .el-dialog__body {
    height: 65vh;
    overflow: auto;
}
</style>