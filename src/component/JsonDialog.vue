<template>
    <el-dialog
        :title="title"
        v-model="visible"
        width="70%"
        append-to-body
        custom-class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
    >
        <json-viewer :value="json" :expand-depth="4" copyable sort :expanded="open" preview-mode></json-viewer>
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
            console.log('打开json对话框', now)
        }
    }
});
</script>
<style scoped>
</style>