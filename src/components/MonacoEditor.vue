<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as monaco from 'monaco-editor';

let editor = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    props: {
        modelValue: String,
        name: {
            type: String,
            default: 'codemirror'
        },
        placeholder: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '200px'
        }
    },
    data: () => ({
        content: '',
        style: {
            width: '100%',
            height: '367px',
        }
    }),
    watch: {
        modelValue(newValue) {
            if (newValue !== editor.getValue()) {
                editor.setValue(newValue);
                editor.trigger(editor.getValue(), 'editor.action.formatDocument', null);
                this.content = newValue;
            }

        }
    },
    mounted() {
        const container = this.$refs.container as HTMLElement;
        this.style = {
            width: this.width,
            height: this.height
        }
        editor = monaco.editor.create(container, {
            value: this.modelValue,
            language: 'json',
            automaticLayout: true
        });
        editor.onDidChangeModelContent((e) => {
            const value = editor.getValue()
            if (this.content !== value) {
                this.$emit('update:modelValue', value);
            }
            return true;
        })
    }
});
</script>
<style lang="less">
.es-monaco-editor {
    width: 100%;
    height: 100%;
}
</style>