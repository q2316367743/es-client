<template>
    <div class="editor-viewer" ref="container" :style="style"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as monaco from 'monaco-editor';

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'editor-viewer',
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
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '200px'
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
        style: {
            width: '100%',
            height: '367px',
        }
    }),
    watch: {
        modelValue(newValue) {
            console.log('更新内容')
            let value = JSON.stringify(newValue, null, 4);
            this.content = value;
            if (this.is_init) {
                instance.setValue(value);
                instance.trigger(instance.getValue(), 'editor.action.formatDocument', null);
            }
        },
    },
    mounted() {
        console.log('开始挂载')
        this.is_init = true;
        const container = this.$refs.container as HTMLElement;
        this.style = {
            width: this.width,
            height: this.height
        }
        console.log('内容', this.content)
        instance = monaco.editor.create(container, {
            value: this.content,
            language: 'json',
            automaticLayout: true
        });
        console.log('挂载完成')
    }
});
</script>
<style lang="less">
.es-monaco-editor {
    width: 100%;
    height: 100%;
}
</style>