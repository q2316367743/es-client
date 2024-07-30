import * as monaco from 'monaco-editor';
import {startWith} from "@/utils/ArrayUtil";
import StrUtil from "@/utils/StrUtil";
import {optionsForGet, optionsForPost, signs, supportMethods} from '@/data/EsUrl';
import useIndexStore from "@/store/IndexStore";

// 附加操作


function getMethodSuggestions(position: monaco.Position): monaco.languages.CompletionItem[] {
    let suggestions = [];
    for (let method of supportMethods) {
        suggestions.push({
            label: method,
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: `${method} `,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: `${method.toUpperCase()}请求方式`,
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        })
    }
    return suggestions;
}

function getBaseUrlSuggestions(position: monaco.Position): monaco.languages.CompletionItem[] {
    let suggestions = [];
    for (let sign of signs) {
        suggestions.push({
            label: sign,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: sign,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: sign,
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        })
    }
    return suggestions;
}

function getMethodUrlSuggestions(position: monaco.Position): Map<string, Array<monaco.languages.CompletionItem>> {
    let map = new Map<string, Array<monaco.languages.CompletionItem>>();
    let getList = new Array<monaco.languages.CompletionItem>();
    let postList = new Array<monaco.languages.CompletionItem>();
    useIndexStore().list.forEach(index =>
        [...index.alias, index.name].forEach(item => {
            optionsForGet.forEach(option => getList.push({
                label: `/${item}/${option}`,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: `/${item}/${option}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `/${item}/${option}`,
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column - 1,
                    endLineNumber: position.lineNumber,
                    endColumn: -1
                }
            }));
            optionsForPost.forEach(option => postList.push({
                label: `/${item}/${option}`,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: `/${item}/${option}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `/${item}/${option}`,
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column - 1,
                    endLineNumber: position.lineNumber,
                    endColumn: -1
                }
            }));
        }));
    map.set('get', getList);
    map.set('post', postList);
    return map;
}

/**
 * 语法提示
 */
const provider = {
    async provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position
    ): Promise<monaco.languages.ProviderResult<monaco.languages.CompletionList>> {
        let suggestions = new Array<monaco.languages.CompletionItem>();
        let token = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column + 1
        });
        // 需要获取连续的代码块
        if (startWith(supportMethods, token, true)) {
            // 请求方法提示
            getMethodSuggestions(position).forEach(e => suggestions.push(e));
        } else if (StrUtil.startWithArr(token, supportMethods)) {
            // 基础请求路径提示
            getBaseUrlSuggestions(position).forEach(e => suggestions.push(e));
            let items = StrUtil.splitAll(token, ' ');
            if (items.length > 0) {
                let completionItems = getMethodUrlSuggestions(position).get(items[0].toLowerCase());
                if (completionItems) {
                    completionItems.forEach(e => suggestions.push(e));
                }
            }
        }
        return {suggestions}
    },
    triggerCharacters: ['{', '/', '"',
        // 26个字母
        'q', 'a', 'z', 'w', 's', 'x', 'e', 'd', 'c', 'r', 'f', 'v', 't', 'g', 'b', 'y',
        'h', 'n', 'u', 'j', 'm', 'i', 'k', 'o', 'l', 'p']
} as monaco.languages.CompletionItemProvider;

export default provider;

/**
 * 规定语法：
 *
 * POST /_cluster/settings
 * {
 *     "a": "b"
 * }
 *
 * GET /_node/stats
 *
 * 方法 链接
 * 请求体
 *
 * 方法 链接
 *
 * 每一个代码块之间都需要一个换行符
 */
