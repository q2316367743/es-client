import * as monaco from "monaco-editor";
import {language} from "@/components/rest-client-editor/language";
import configuration from "@/components/rest-client-editor/configuration";
import provider from "@/components/rest-client-editor/provider";
import {restFoldingRangeProvider} from "@/components/rest-client-editor/foldingRange";

export {default as RestClientEditor} from "./index.vue";

export function registerLanguageForHttp() {
  monaco.languages.register({id: 'http'});
  // 语法提示
  monaco.languages.setMonarchTokensProvider('http', language);
  // 语言括号配置
  monaco.languages.setLanguageConfiguration('http', configuration);
  // 语法高亮
  monaco.languages.registerCompletionItemProvider('http', provider);
  // 代码折叠
  monaco.languages.registerFoldingRangeProvider('http', restFoldingRangeProvider)
}