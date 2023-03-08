<template>
    <div ref="container" :id="id" class="es-rest-client-editor"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {applicationLaunch, isDark} from "@/global/BeanFactory";

import * as monaco from 'monaco-editor';
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import language from "@/module/RestClientEditor/language";
import configuration from "@/module/RestClientEditor/configuration";
import provider from "@/module/RestClientEditor/provider";
import codelens from "@/module/RestClientEditor/codelens";
import Optional from "@/utils/Optional";
import useEditorSettingStore from "@/store/EditorSettingStore";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

let instance: monaco.editor.IStandaloneCodeEditor;

// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = { // 提供一个定义worker路径的全局变量
    getWorker(_: any) {
        return new EditorWorker(); // 基础功能文件， 提供了所有语言通用功能 无论使用什么语言，monaco都会去加载他。
    }
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

export default defineComponent({
    name: 'rest-client-editor',
    props: {
        modelValue: String
    },
    emits: ['execute', 'update:modelValue'],
    data: () => ({
        content: '',
        isDark,
        id: `rest-client-${new Date().getTime()}`,
        runFontSize: 16,
        runColor: '#0d7d6c'
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

        applicationLaunch.register(() => {
            const container = this.$refs.container as HTMLElement;
            instance = monaco.editor.create(container, {
                value: this.modelValue,
                language: 'http',
                automaticLayout: true,
                theme: this.isDark as boolean ? 'vs-dark' : 'vs',
                minimap: {
                    enabled: useEditorSettingStore().getMinimap
                },
                fontFamily: "consoles",
                wordWrap: useEditorSettingStore().getWordWrap,
                fontSize: useEditorSettingStore().getFontSize
            });

            this.runFontSize = useEditorSettingStore().getRunFontSize;
            this.runColor = useEditorSettingStore().getRunColor;

            // 注册更新程序
            emitter.on(MessageEventEnum.EDITOR_SETTING_UPDATE, () => {
                instance.updateOptions({
                    minimap: {
                        enabled: useEditorSettingStore().getMinimap
                    },
                    wordWrap: useEditorSettingStore().getWordWrap,
                    fontSize: useEditorSettingStore().getFontSize
                });
                this.runFontSize = useEditorSettingStore().getRunFontSize;
                this.runColor = useEditorSettingStore().getRunColor;
            })

            instance.onDidChangeModelContent(() => {
                const value = instance.getValue();
                if (this.content !== value) {
                    this.$emit('update:modelValue', value);
                }
                return true;
            });

            let commandId = instance.addCommand(0, (...args: any[]) => {
                this.$emit('execute', args[1])
            });

            monaco.languages.registerCodeLensProvider('http', codelens(Optional.ofNullable(commandId).orElse("")));

            return Promise.resolve();
        })
    },
    methods: {
        getInstance(): monaco.editor.IStandaloneCodeEditor {
            return instance;
        }
    }
});
</script>
<style lang="less">
.es-rest-client-editor {
    .contentWidgets {
        a {
            font-size: v-bind(runFontSize);
            color: v-bind(runColor);
        }
    }
}
</style>