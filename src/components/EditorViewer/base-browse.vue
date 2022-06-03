<template>
    <div class="editor-viewer" ref="container" style="width: 100%;height: calc(100% - 64px);"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as monaco from 'monaco-editor';

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'base-browse-editor-viewer',
    props: {
        modelValue: Object,
        name: {
            type: String,
            default: 'monaco-editor'
        },
        placeholder: {
            type: String,
            default: ''
        },
        /**
         * 当前的链接
         */
        link: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        content: '{}',
        is_init: false,
    }),
    watch: {
        modelValue(newValue) {
            let value = JSON.stringify(newValue, null, 4);
            this.content = value;
            if (this.is_init) {
                instance.setValue(value);
                instance.trigger(instance.getValue(), 'editor.action.formatDocument', null);
            }
        },
    },
    mounted() {
        this.is_init = true;
        const container = this.$refs.container as HTMLElement;
        instance = monaco.editor.create(container, {
            value: this.content,
            language: 'json',
            automaticLayout: true
        });
    }
});
</script>
<style lang="less">
.es-monaco-editor {
    width: 100%;
    height: 100%;
}
</style>