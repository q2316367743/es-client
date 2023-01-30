import * as monaco from 'monaco-editor';
import ArrayUtil from "@/utils/ArrayUtil";
import StrUtil from "@/utils/StrUtil";
import methods from './SupportMethods';

const signs = ['/', '/_cluster/settings', '/_cat/allocation?v', '/_cat/shards?v', '/_cat/shards/', '/_cat/master?v',
    '/_cat/nodes?v', '/_cat/indices?v', '/_cat/indices/', '/_cat/segments?v', '/_cat/segments/', '/_cat/count',
    '/_cat/count/', '/_cat/recovery?v', '/_cat/recovery/', '/_cat/health?v', '/_cat/pending_tasks?v', '/_cat/aliases?v',
    '/_cat/aliases/', '/_cat/thread_pool?v', '/_cat/plugins?v', '/_cat/fielddata?v', '/_cat/fielddata/', '/_cat/nodeattrs?v',
    '/_cat/repositories?v', '/_cat/snapshots/', '/_cat/allocation?help', '/_cat/shards?help', '/_cat/shards/', '/_cat/master?help',
    '/_cat/nodes?help', '/_cat/indices?help', '/_cat/indices/', '/_cat/segments?help', '/_cat/segments/', '/_cat/count',
    '/_cat/count/', '/_cat/recovery?help', '/_cat/recovery/', '/_cat/health?help', '/_cat/pending_tasks?help', '/_cat/aliases?help',
    '/_cat/aliases/', '/_cat/thread_pool?help', '/_cat/plugins?help', '/_cat/fielddata?help', '/_cat/fielddata/', '/_cat/nodeattrs?help',
    '/_cat/repositories?help', '/_cat/snapshots/'];

function getMethodSuggestions(position: monaco.Position): monaco.languages.CompletionItem[] {
    let suggestions = [];
    for (let method of methods) {
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

/**
 * 语法提示
 */
const provider = {
    async provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
    ): Promise<monaco.languages.ProviderResult<monaco.languages.CompletionList>> {
        let suggestions = new Array<monaco.languages.CompletionItem>();
        console.log(position)
        let token = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column + 1
        });
        console.log(token);
        // 需要获取连续的代码块
        if (ArrayUtil.startWith(methods, token, true)) {
            // 请求方法提示
            getMethodSuggestions(position).forEach(e => suggestions.push(e));
        }else if (StrUtil.startWithArr(token, methods)) {
            // 请求路径提示
            getBaseUrlSuggestions(position).forEach(e => suggestions.push(e));
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