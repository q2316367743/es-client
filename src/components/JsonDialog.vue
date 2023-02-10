<template>
    <a-modal
        :title="title"
        v-model:visible="visible"
        width="70%"
        append-to-body
        class="es-dialog"
        :close-on-click-modal="false"
        top="10vh"
        draggable
        destroy-on-close
    >
        <json-view :data="json"/>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import JsonView from "@/components/JsonView/index.vue";

export default defineComponent({
    components: {JsonView},
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