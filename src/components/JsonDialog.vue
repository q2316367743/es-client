<template>
    <a-modal
        :title="title"
        v-model:visible="visible"
        width="70%"
        render-to-body
        class="es-dialog"
        :mask-closable="false"
        top="10vh"
        draggable
        unmount-on-close
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
        },
        value(newValue) {
            this.visible = this.value;
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