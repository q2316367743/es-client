import * as monaco from 'monaco-editor';

const token = {
    defaultToken: "",
    tokenPostfix: ".md",
    control: /[\\`*_\[\]{}()#+\-\.!]/,
    noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
    escapes: /\\(?:@control)/,
    jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    empty: [
        "area",
        "base",
        "basefont",
        "br",
        "col",
        "frame",
        "hr",
        "img",
        "input",
        "isindex",
        "link",
        "meta",
        "param"
    ],
    tokenizer: {
        root: [
            // hexo专有语法
            [/^\s*({%)(.*)(%})\s*$/, ['keyword', 'white', 'keyword']],
            [/^\s*\|/, "@rematch", "@table_header"],
            [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ["white", "keyword", "keyword", "keyword"]],
            [/^\s*(=+|\-+)\s*$/, "keyword"],
            [/^\s*((\*[ ]?)+)\s*$/, "meta.separator"],
            [/^\s*>+/, "comment"],
            [/^\s*([\*\-+:]|\d+\.)\s/, "keyword"],
            [/^(\t|[ ]{4})[^ ].*$/, "string"],
            [/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, {token: "string", next: "@codeblock"}],
            [
                /^\s*```\s*((?:\w|[\/\-#])+).*$/,
                {token: "string", next: "@codeblockgh", nextEmbedded: "$1"}
            ],
            [/^\s*```\s*$/, {token: "string", next: "@codeblock"}],
            {include: "@linecontent"}
        ],
        table_header: [
            {include: "@table_common"},
            [/[^\|]+/, "keyword.table.header"]
        ],
        table_body: [{include: "@table_common"}, {include: "@linecontent"}],
        table_common: [
            [/\s*[\-:]+\s*/, {token: "keyword", switchTo: "table_body"}],
            [/^\s*\|/, "keyword.table.left"],
            [/^\s*[^\|]/, "@rematch", "@pop"],
            [/^\s*$/, "@rematch", "@pop"],
            [
                /\|/,
                {
                    cases: {
                        "@eos": "keyword.table.right",
                        "@default": "keyword.table.middle"
                    }
                }
            ]
        ],
        codeblock: [
            [/^\s*~~~\s*$/, {token: "string", next: "@pop"}],
            [/^\s*```\s*$/, {token: "string", next: "@pop"}],
            [/.*$/, "variable.source"]
        ],
        codeblockgh: [
            [/```\s*$/, {token: "string", next: "@pop", nextEmbedded: "@pop"}],
            [/[^`]+/, "variable.source"]
        ],
        linecontent: [
            [/&\w+;/, "string.escape"],
            [/@escapes/, "escape"],
            [/\b__([^\\_]|@escapes|_(?!_))+__\b/, "strong"],
            [/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, "strong"],
            [/\b_[^_]+_\b/, "emphasis"],
            [/\*([^\\*]|@escapes)+\*/, "emphasis"],
            [/`([^\\`]|@escapes)+`/, "variable"],
            [/\{+[^}]+\}+/, "string.target"],
            [/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ["string.link", "", "string.link"]],
            [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, "string.link"],
            {include: "html"}
        ],
        html: [
            [/<(\w+)\/>/, "tag"],
            [
                /<(\w+)(\-|\w)*/,
                {
                    cases: {
                        "@empty": {token: "tag", next: "@tag.$1"},
                        "@default": {token: "tag", next: "@tag.$1"}
                    }
                }
            ],
            [/<\/(\w+)(\-|\w)*\s*>/, {token: "tag"}],
            [/<!--/, "comment", "@comment"]
        ],
        comment: [
            [/[^<\-]+/, "comment.content"],
            [/-->/, "comment", "@pop"],
            [/<!--/, "comment.content.invalid"],
            [/[<\-]/, "comment.content"]
        ],
        tag: [
            [/[ \t\r\n]+/, "white"],
            [
                /(type)(\s*=\s*)(")([^"]+)(")/,
                [
                    "attribute.name.html",
                    "delimiter.html",
                    "string.html",
                    {token: "string.html", switchTo: "@tag.$S2.$4"},
                    "string.html"
                ]
            ],
            [
                /(type)(\s*=\s*)(')([^']+)(')/,
                [
                    "attribute.name.html",
                    "delimiter.html",
                    "string.html",
                    {token: "string.html", switchTo: "@tag.$S2.$4"},
                    "string.html"
                ]
            ],
            [/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ["attribute.name.html", "delimiter.html", "string.html"]],
            [/\w+/, "attribute.name.html"],
            [/\/>/, "tag", "@pop"],
            [
                />/,
                {
                    cases: {
                        "$S2==style": {
                            token: "tag",
                            switchTo: "embeddedStyle",
                            nextEmbedded: "text/css"
                        },
                        "$S2==script": {
                            cases: {
                                $S3: {
                                    token: "tag",
                                    switchTo: "embeddedScript",
                                    nextEmbedded: "$S3"
                                },
                                "@default": {
                                    token: "tag",
                                    switchTo: "embeddedScript",
                                    nextEmbedded: "text/javascript"
                                }
                            }
                        },
                        "@default": {token: "tag", next: "@pop"}
                    }
                }
            ]
        ],
        embeddedStyle: [
            [/[^<]+/, ""],
            [/<\/style\s*>/, {token: "@rematch", next: "@pop", nextEmbedded: "@pop"}],
            [/</, ""]
        ],
        embeddedScript: [
            [/[^<]+/, ""],
            [/<\/script\s*>/, {token: "@rematch", next: "@pop", nextEmbedded: "@pop"}],
            [/</, ""]
        ]
    },
    //语言大小写不敏感吗
    ignoreCase: true
} as monaco.languages.IMonarchLanguage;

const config = {
    comments: {
        blockComment: ["<!--", "-->"]
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        {open: "{", close: "}"},
        {open: "[", close: "]"},
        {open: "(", close: ")"},
        {open: "<", close: ">", notIn: ["string"]}
    ],
    surroundingPairs: [
        {open: "(", close: ")"},
        {open: "[", close: "]"},
        {open: "`", close: "`"}
    ],
    folding: {
        markers: {
            start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
            end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
        }
    }
} as monaco.languages.LanguageConfiguration;

/**
 * 语法提示
 */
const provider = {
    async provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
    ): Promise<monaco.languages.ProviderResult<monaco.languages.CompletionList>> {
        // Markdown基础语法提示
        let suggestions = [{
            label: '#',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '# ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '一级标题',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '##',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '## ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '二级标题',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '###',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '### ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '三级标题',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '####',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '#### ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '四级标题',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '#####',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '##### ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '五级标题',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '######',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '###### ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '六级标题',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '*',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '*$1*',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '斜体',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '**',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '**$0**',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '加粗',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '***',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '***$1***',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '斜体加粗',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '~~',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '~~$1~~',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '删除线',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '>',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '> $1',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '引用',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '---',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '---',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '引用',
            range: {
                startLineNumber: position.lineNumber + 1,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber + 2,
                endColumn: -1
            }
        }, {
            label: '!',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '![$1]($2)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '插入图片',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '[',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '[$1]($2)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '超链接',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column + 1
            }
        }, {
            label: '-',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '- $1',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '列表',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '+',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '+ $1',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '列表',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '*',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '* $1',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '列表',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '`',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '`$1`$2',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '单行代码',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '`',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '```$1\n$2\n```\n$3',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: '代码块',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: -1
            }
        }, {
            label: '{',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '{% $1 $2 $3 %}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'hexo专有语法',
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column + 1
            }
        }];
        if (context.triggerCharacter) {
            let token = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 0,
                endLineNumber: position.lineNumber,
                endColumn: position.column + 1
            });
            if (/!\[\S*]\(\/\)/.test(token)) {
                // 图片
                const imageNames = new Array<string>();
                // 对于![]()的图片提供语法提示功能
                for (let imageName of imageNames) {
                    suggestions.push({
                        label: `/post-images/${imageName}`,
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: `/post-images/${imageName}`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: imageName,
                        range: {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column - 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        }
                    });
                }
            }
        }
        return {
            suggestions: suggestions
        }
    },
    triggerCharacters: ['#', '!', '*', '~', '>', '-', '[', '<', '+', '`', '{', '/',
        // 26个字母
        'q', 'a', 'z', 'w', 's', 'x', 'e', 'd', 'c', 'r', 'f', 'v', 't', 'g', 'b', 'y',
        'h', 'n', 'u', 'j', 'm', 'i', 'k', 'o', 'l', 'p']
} as monaco.languages.CompletionItemProvider;

export default {token, config, provider}