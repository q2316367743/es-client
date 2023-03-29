<template>
    <div ref="container" :id="id" class="es-javascript-editor"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {applicationLaunch, isDark} from "@/global/BeanFactory";

import * as monaco from 'monaco-editor';

import useEditorSettingStore from "@/store/EditorSettingStore";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import {URL_REGEX} from "@/data/EsUrl";

let instance: monaco.editor.IStandaloneCodeEditor;

// Add additional d.ts files to the JavaScript language service and change.
// Also change the default compilation options.
// The sample below shows how a class Facts is declared and introduced
// to the system and how the compiler is told to use ES6 (target=2).

// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: false,
});

// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
	target: monaco.languages.typescript.ScriptTarget.ES2015,
	allowNonTsExtensions: true,
});

// extra libraries
var libSource = `/**
 * es查询结果集
 */
declare var $;`;
var libUri = "ts:es.d.ts";
monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
// When resolving definitions and references, the editor will try to use created models.
// Creating a model for the library allows "peek definition/references" commands to work with the library.
monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));

export default defineComponent({
    name: 'javascript-editor',
    props: {
        modelValue: String
    },
    emits: ['execute', 'update:modelValue'],
    data: () => ({
        content: '',
        isDark,
        id: `javascript-${new Date().getTime()}`,
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

        applicationLaunch.register(() => {
            const container = this.$refs.container as HTMLElement;
            instance = monaco.editor.create(container, {
                value: this.modelValue,
                language: 'javascript',
                automaticLayout: true,
                theme: this.isDark as boolean ? 'vs-dark' : 'vs',
                minimap: {
                    enabled: useEditorSettingStore().getMinimap
                },
                fontFamily: "consoles",
                wordWrap: useEditorSettingStore().getWordWrap,
                fontSize: useEditorSettingStore().getFontSize
            });

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
                this.runColor = useEditorSettingStore().getRunColor;
            })

            instance.onDidChangeModelContent(() => {
                const value = instance.getValue();
                if (this.content !== value) {
                    this.$emit('update:modelValue', value);
                }
                return true;
            });

            return Promise.resolve();
        })
    },
    methods: {
        getInstance(): monaco.editor.IStandaloneCodeEditor {
            return instance;
        },
        renderValue(value: string): Array<number> {
            let lineNumbers = new Array<number>();
            const lines = value.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(URL_REGEX)) {
                    lineNumbers.push(i);
                }
            }
            return lineNumbers;
        }
    }
});
</script>
<style lang="less">
.es-rest-client-editor {
    .contentWidgets {
        a {
            color: v-bind(runColor);
        }
    }
}
</style>