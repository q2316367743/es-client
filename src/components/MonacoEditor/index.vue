<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as monaco from 'monaco-editor';

import TipsBuild from './build/TipsBuild';

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'monaco-editor',
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
            if (newValue !== instance.getValue()) {
                instance.setValue(newValue);
                instance.trigger(instance.getValue(), 'editor.action.formatDocument', null);
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
        instance = monaco.editor.create(container, {
            value: this.modelValue,
            language: 'json',
            automaticLayout: true
        });
        instance.onDidChangeModelContent((e) => {
            const value = instance.getValue();
            if (this.content !== value) {
                this.$emit('update:modelValue', value);
            }
            return true;
        });
        monaco.languages.registerCompletionItemProvider('json', {
            provideCompletionItems: function(model: monaco.editor.ITextModel, position: monaco.Position) {
            // find out if we are completing a property in the 'dependencies' object.
                var textUntilPosition = model.getValueInRange({
                    startLineNumber: 1, 
                    startColumn: 1, 
                    endLineNumber: position.lineNumber, 
                    endColumn: position.column
                    });
                var suggestions: monaco.languages.CompletionItem[] = [];
                var word = model.getWordUntilPosition(position);
                var range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                if(textUntilPosition.charAt(textUntilPosition.length-2)=='.'){
                    suggestions = TipsBuild();
                }
                return {suggestions: suggestions};
            },
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