import * as monaco from "monaco-editor";
export {default as RestClientEditor} from "./index.vue";

import language from "@/components/rest-client-editor/language";
import configuration
  from "@/components/rest-client-editor/configuration";
import provider from "@/components/rest-client-editor/provider";
import foldingRange from "@/components/rest-client-editor/foldingRange";

export function registerLanguageForHttp() {
  monaco.languages.register({id: 'http'});
  monaco.languages.setMonarchTokensProvider('http', language);
  monaco.languages.setLanguageConfiguration('http', configuration);
  monaco.languages.registerCompletionItemProvider('http', provider);
  monaco.languages.registerFoldingRangeProvider('http', foldingRange)
}