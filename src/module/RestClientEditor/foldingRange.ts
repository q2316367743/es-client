import * as monaco from 'monaco-editor';
import {grammaticalAnalysis} from "@/algorithm/grammaticalAnalysis";

export default {
    provideFoldingRanges: function (model: monaco.editor.ITextModel) {
        let grammaticalItems = grammaticalAnalysis(model.getValue());
        return grammaticalItems.map(grammatical => {
            return {
                start: grammatical.lineNumberStart + 1,
                end: grammatical.lineNumberEnd + 1,
                kind: monaco.languages.FoldingRangeKind.Region
            }
        });
    },
} as monaco.languages.FoldingRangeProvider