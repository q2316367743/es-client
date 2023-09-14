<template>
    <div ref="container" :id="id" class="es-rest-client-editor"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import * as monaco from 'monaco-editor';

import language from "@/page/senior-search/components/RestClientEditor/language";
import configuration from "@/page/senior-search/components/RestClientEditor/configuration";
import provider from "@/page/senior-search/components/RestClientEditor/provider";
import codelens from "@/page/senior-search/components/RestClientEditor/codelens";
import Optional from "@/utils/Optional";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import {URL_REGEX} from "@/data/EsUrl";
import foldingRange from "@/page/senior-search/components/RestClientEditor/foldingRange";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";

let instance: monaco.editor.IStandaloneCodeEditor;


export default defineComponent({
    name: 'rest-client-editor',
    props: {
        modelValue: String
    },
    emits: ['execute', 'update:modelValue'],
    data: () => ({
        content: '',
        id: `rest-client-${new Date().getTime()}`,
        runColor: '#0d7d6c'
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark'])
    },
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
        monaco.languages.registerFoldingRangeProvider('http', foldingRange)

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

        this.runColor = useEditorSettingStore().getRunColor;

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

        instance.addCommand(monaco.KeyCode.F9,
            () => {
                let value = instance.getValue();
                let row = Optional.ofNullable(instance.getPosition()).attr("lineNumber").orElse(1);
                let numbers = this.renderValue(value);
                console.log(value, row, numbers)
                if (numbers.length === 0) {
                    return;
                }
                let fail = true;
                for (let i = 0; i < numbers.length; i++) {
                    if (numbers[i] > row) {
                        fail = false;
                        let target = i - 1;
                        if (target < 0) {
                            target = 0;
                        }
                        console.log(target)
                        this.$emit('execute', target);
                    }
                }
                if (fail) {
                    this.$emit('execute', numbers.length - 1);
                }
            });

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
