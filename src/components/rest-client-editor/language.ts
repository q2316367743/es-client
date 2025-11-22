import * as monaco from "monaco-editor";
import {supportMethods} from '@/data/EsUrl';

export const language: monaco.languages.IMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".http",
  keywords: supportMethods,
  keywordStr: supportMethods.join('|'),
  typeKeywords: ['true', 'false'],
  operators: ['{', '}', '[', ']'],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // 十进制
  digits: /\d+(_+\d+)*/,
  // 八进制
  octalDigits: /[0-7]+(_+[0-7]+)*/,
  // 二进制
  binaryDigits: /[0-1]+(_+[0-1]+)*/,
  // 十六进制
  hexDigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  tokenizer: {
    root: [
      [/[{}]/, 'delimiter.bracket'],
      {include: 'common'}
    ],
    common: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@typeKeywords': 'keyword',
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],

      // 空白
      {include: '@whitespace'},

      // 定义
      [/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, 'type.identifier'],  // t

      // 数字
      // 科学计数法
      [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
      // 小数（科学计数法）
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
      // 十六进制
      [/0[xX](@hexDigits)/, 'number.hex'],
      // 八进制
      [/0[oO]?(@octalDigits)/, 'number.octal'],
      // 二进制
      [/0[bB](@binaryDigits)/, 'number.binary'],
      // 十进制
      [/(@digits)/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // 字符串
      // 双引号开头
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/"/, 'string', '@string_double'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      // //
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      // ^///////
      [/[^\/*]+/, 'comment']
    ],

    string_double: [
      // ^" 入栈
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      // " 出栈
      [/"/, 'string', '@pop']
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      {include: 'common'}
    ],
  },
  //语言大小写不敏感吗
  ignoreCase: true
};
