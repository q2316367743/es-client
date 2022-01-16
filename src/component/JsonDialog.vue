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
        <json-viewer :value="json" :expand-depth="4" copyable sort></json-viewer>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        value: Boolean,
        title: String,
        json: Object
    },
    data: () => ({
        visible: false
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
<style scoped>

</style>