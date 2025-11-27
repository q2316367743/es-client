<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<script lang="ts">
import {editorProps} from './MonacoEditorType'
import * as monaco from 'monaco-editor'
import {useGlobalStore} from "@/store/GlobalStore";

export default defineComponent({
  name: 'monaco-editor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted'],
  setup(props, {emit}) {
    let editor: monaco.editor.IStandaloneCodeEditor
    const codeEditBox = ref()

    const init = () => {
      editor = monaco.editor.create(codeEditBox.value, {
        value: props.modelValue,
        language: props.language,
        theme: useGlobalStore().isDark ? 'vs-dark' : 'vs',
        ...props.options,
        readOnly: props.readOnly
      })

      // 监听值的变化
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue() //给父组件实时返回最新文本
        emit('update:modelValue', value)
        emit('change', value)
      })

      emit('editor-mounted', editor)
    }
    watch(
      () => props.modelValue,
      newValue => {
        if (editor) {
          const value = editor.getValue()
          if (newValue !== value) {
            editor.setValue(newValue)
          }
        }
      }
    )

    watch(
      () => props.options,
      newValue => {
        editor.updateOptions(newValue)
      },
      {deep: true}
    )

    watch(
      () => props.language,
      language => {
        let model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, language);
        }
      },
      {deep: true}
    )

    watch(() => useGlobalStore().isDark, value => {
      editor.updateOptions({
        theme: value ? 'vs-dark' : 'vs'
      })

    })

    onBeforeUnmount(() => {
      editor.dispose()
    })

    onMounted(() => {
      init()
    })

    return {codeEditBox}
  },
})
</script>
<style lang="less" scoped>
.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);
}
</style>
