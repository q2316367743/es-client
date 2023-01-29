import * as monaco from "monaco-editor";

const language = {
    defaultToken: "",
    tokenPostfix: ".http",
    tokenizer: {
        root: [
            [/^(\S*)\s*/, ['keyword']],
            [/^(\S*)\s*(?:\S*)/, ['keyword', 'keyword']],
            // {include: "json"}
        ],
    },
    //语言大小写不敏感吗
    ignoreCase: true
} as monaco.languages.IMonarchLanguage;

export default language;