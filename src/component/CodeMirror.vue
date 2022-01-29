<template>
    <div class="codemirror">
        <textarea ref="textarea" :name="name" :placeholder="placeholder"></textarea>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CodeMirror from 'codemirror';

export default defineComponent({
    name: 'CodeMirror',
    data() {
        return {
            content: '',
            codemirror: {} as CodeMirror.EditorFromTextArea,
        }
    },
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
        options: {
            type: Object as PropType<CodeMirror.EditorConfiguration>,
            default: () => ({})
        }
    },
    watch: {
        options: {
            deep: true,
            handler(options: any) {
                for (const key in options) {
                    this.codemirror.setOption(key as keyof CodeMirror.EditorConfiguration, options[key])
                }
            }
        },
        modelValue(newVal) {
            const cm_value = this.codemirror.getValue()
            if (newVal !== cm_value) {
                console.log(newVal, typeof newVal)
                this.codemirror.setValue(newVal);
                this.content = newVal;
            }
        },
    },
    mounted() {
        let textarea = this.$refs.textarea as HTMLTextAreaElement;
        this.codemirror = CodeMirror.fromTextArea(textarea, this.options)
        this.codemirror.setValue(this.modelValue || this.content)
        this.codemirror.on('change', cm => {
            this.content = cm.getValue()
            if (this.$emit) {
                this.$emit('update:modelValue', this.content)
            }
        })
        this.codemirror.refresh();
    }
})
</script>
<style lang="less">
.codemirror {
    width: 100%;
}
</style>