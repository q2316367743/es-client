<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as monaco from 'monaco-editor';

import TipsBuild from './build/TipsBuild';
import { mapState } from "pinia";
import { useIndexStore } from "@/store/IndexStore";

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'monaco-editor',
    props: {
        modelValue: String,
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
        content: '',
        style: {
            width: '100%',
            height: '367px',
        }
    }),
    computed: {
        ...mapState(useIndexStore, ['indices'])
    },
    watch: {
        modelValue(newValue) {
            if (newValue !== instance.getValue()) {
                instance.setValue(newValue);
                instance.trigger(instance.getValue(), 'editor.action.formatDocument', null);
                this.content = newValue;
            }
        },
        indices() {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: true,
                validate: true,
                schemas: TipsBuild(this.indices, this.link)
            });
        },
        link() {
            let schemas = TipsBuild(this.indices, this.link);
            console.log(schemas)
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: true,
                validate: true,
                schemas: schemas
            });
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
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            allowComments: true,
            validate: true,
            schemas: TipsBuild(this.indices, this.link)
        });
    },
    methods: {
        format() {
            instance.getAction('editor.action.formatDocument').run();
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