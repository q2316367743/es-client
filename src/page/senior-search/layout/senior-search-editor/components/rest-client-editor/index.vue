<template>
    <div ref="container" :id="id" class="es-rest-client-editor"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import * as monaco from 'monaco-editor';
// 语言组件
import codelens from "./codelens";
// 存储
import {useGlobalStore} from "@/store/GlobalStore";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
// 其他
import Optional from "@/utils/Optional";
import {URL_REGEX} from "@/data/EsUrl";
import restFormat from "@/algorithm/restFormat";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

let instance: monaco.editor.IStandaloneCodeEditor;

let codeLensProviderDisposable: any | null = null

export default defineComponent({
    name: 'rest-client-editor',
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

        const container = this.$refs.container as HTMLElement;
        instance = monaco.editor.create(container, {
            value: useSeniorSearchStore().body,
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
                useSeniorSearchStore().updateBody(value)
            }
            return true;
        });

        let commandId = instance.addCommand(0, (...args: any[]) => {
            useSeniorSearchStore().execute(args[1], instance);
        });
        // 增加快捷键
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
                    useSeniorSearchStore().execute(numbers.length - 1, instance);

                }
            });

        codeLensProviderDisposable = monaco.languages.registerCodeLensProvider('http', codelens(Optional.ofNullable(commandId).orElse("")));

        // 增加一个动作：格式化文档
        instance.addAction({
            // An unique identifier of the contributed action.
            id: "format rest",

            // A label of the action that will be presented to the user.
            label: "格式化文档",

            // An optional array of keybindings for the action.
            keybindings: [],


            contextMenuGroupId: "navigation",

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: function (ed) {
                ed.setValue(restFormat(ed.getValue()));
            },
        });


    },
    unmounted() {
        if (codeLensProviderDisposable) {
            codeLensProviderDisposable.dispose();
            codeLensProviderDisposable = null;
        }
    },


    methods: {
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
