<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import * as monaco from 'monaco-editor';
import language from "./language";
import configuration from "./configuration";
import provider from "./provider";
import {isDark} from "@/global/BeanFactory";

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'rest-api-editor',
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
            theme: this.isDark as boolean ? 'vs-dark' : 'vs'
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