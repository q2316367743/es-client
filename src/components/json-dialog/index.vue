<template>
    <a-modal
            :title="title"
            v-model:visible="visible"
            width="70%"
            render-to-body
            class="es-dialog"
            top="10vh"
            draggable
            unmount-on-close
            :footer="false"
    >
        <json-view :data="json"/>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import JsonView from "@/components/JsonView/index.vue";
import {jsonFormat} from "@/algorithm/jsonFormat";

export default defineComponent({
    name: 'json-dialog',
    components: {JsonView},
    props: {
        value: Boolean,
        title: String,
        json: [Object, String],
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
        },
        value(newValue) {
            this.visible = newValue;
        }
    },
});
</script>
<style>
.es-dialog .el-dialog__body {
    height: 65vh;
    overflow: auto;
}
</style>
