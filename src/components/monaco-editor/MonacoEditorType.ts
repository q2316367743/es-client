import {editor} from 'monaco-editor';

export type FoldingStrategy = 'auto' | 'indentation'
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter';
export type LineNumbersType = 'on' | 'off' | 'relative' | 'interval';
export interface Options extends editor.IStandaloneEditorConstructionOptions {
    automaticLayout: boolean // 自适应布局
    foldingStrategy: FoldingStrategy // 折叠方式  auto | indentation
    renderLineHighlight: RenderLineHighlight // 行亮
    selectOnLineNumbers: boolean // 单击行号时是否应选择相应的行？
    minimap: {
        // 关闭小地图
        enabled: boolean
    }
    readOnly: boolean // 只读
    fontSize: number // 字体大小
    scrollBeyondLastLine: boolean // 取消代码后面一大段空白
    overviewRulerBorder: boolean // 不要滚动条的边框,
    lineNumbers: LineNumbersType,
    lineNumbersMinChars: number,
}

export const editorProps = {
    modelValue: {
        type: String as PropType<string>,
        default: null,
    },
    width: {
        type: [String, Number] as PropType<string | number>,
        default: '100%',
    },
    height: {
        type: [String, Number] as PropType<string | number>,
        default: '100%',
    },
    language: {
        type: String as PropType<string>,
        default: 'javascript',
    },
    readOnly: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Object as PropType<Options>,
        default: function () {
            return {
                automaticLayout: true,
                foldingStrategy: 'indentation',
                renderLineHighlight: 'all',
                selectOnLineNumbers: false,
                minimap: {
                    enabled: true,
                },
                readOnly: false,
                fontSize: 16,
                scrollBeyondLastLine: false,
                overviewRulerBorder: false,
                lineNumbers: 'on',
                lineNumbersMinChars: 3,
            }
        },
    },
}
