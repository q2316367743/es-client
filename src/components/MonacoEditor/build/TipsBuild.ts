import { languages, IRange } from 'monaco-editor'

export default function TipsBuild(): languages.CompletionItem[] {
    return [
        {
            //显示的提示名称
            label: 'SetValue',
            //选择后粘贴到编辑器中的文字
            insertText: 'SetValue("text")',
            kind: languages.CompletionItemKind.Field,
            range: {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 0,
                endColumn: -1
            }
        },
    ]
}