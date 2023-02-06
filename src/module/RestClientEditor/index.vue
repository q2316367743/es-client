<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {isDark} from "@/global/BeanFactory";

import * as monaco from 'monaco-editor';
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import language from "./language";
import configuration from "./configuration";
import provider from "./provider";

let instance: monaco.editor.IStandaloneCodeEditor;

// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = { // 提供一个定义worker路径的全局变量
    getWorker(_: any, label: string) {
        return new EditorWorker(); // 基础功能文件， 提供了所有语言通用功能 无论使用什么语言，monaco都会去加载他。
    }
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

export default defineComponent({
    name: 'rest-client-editor',
    props: {
        modelValue: String,
    },
    data: () => ({
        content: '',
        style: {
            width: '100%',
            height: 'calc(100%)'
        },
        isDark
    }),
    watch: {
        modelValue(newValue) {
            if (newValue !== instance.getValue()) {
                instance.setValue(newValue);
                instance.trigger(instance.getValue(), 'editor.action.formatDocument', null);
                this.content = newValue;
            }
        },
        isDark(newValue: boolean) {
            if (instance) {
                instance.updateOptions({
                    theme: newValue ? 'vs-dark' : 'vs'
                })
            }
        }
    },
    mounted() {

        // 注册语言服务器
        monaco.languages.register({id: 'http'});
        monaco.languages.setMonarchTokensProvider('http', language);
        monaco.languages.setLanguageConfiguration('http', configuration);
        monaco.languages.registerCompletionItemProvider('http', provider);

        const container = this.$refs.container as HTMLElement;
        instance = monaco.editor.create(container, {
            value: this.modelValue,
            language: 'http',
            automaticLayout: true,
            theme: this.isDark as boolean ? 'vs-dark' : 'vs',
            minimap: {
                enabled: false
            }
        });
        instance.onDidChangeModelContent(() => {
            const value = instance.getValue();
            if (this.content !== value) {
                this.$emit('update:modelValue', value);
            }
            return true;
        });
    },
    methods: {
        format() {
            instance.getAction('editor.action.formatDocument').run();
        },
        getInstance(): monaco.editor.IStandaloneCodeEditor {
            return instance;
        }
    }
});
</script>
<style lang="less">
.es-monaco-editor {
    width: 100%;
    height: 100%;
}
</style>