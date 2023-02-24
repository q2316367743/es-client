import * as monaco from 'monaco-editor';
import { URL_REGEX } from "@/data/EsUrl";

export default function build(commandId: string) {
    return {
        provideCodeLenses(model: monaco.editor.ITextModel): monaco.languages.ProviderResult<monaco.languages.CodeLensList> {
            let codeLens = new Array<monaco.languages.CodeLens>();
            let lines = model.getValue().split("\n");
            let index = 0;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.match(URL_REGEX)) {
                    codeLens.push({
                        range: {
                            startLineNumber: i + 1,
                            startColumn: 1,
                            endLineNumber: i + 2,
                            endColumn: 1,
                        },
                        id: `执行-${new Date().getTime() + i}`,
                        command: {
                            id: commandId,
                            title: '执行',
                            tooltip: '执行此请求',
                            arguments: [index]
                        },
                    });
                    index += 1;
                }
            }
            return {
                lenses: codeLens,
                dispose() {
                }
            }
        }
    } as monaco.languages.CodeLensProvider
}