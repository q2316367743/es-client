import * as monaco from "monaco-editor";

const configuration = {
  comments: {
    blockComment: ["<!--", "-->"],
    lineComment: "#"
  },
  brackets: [
    ["{", "}"],
    ["[", "]"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: '"', close: '"' }
  ],
  surroundingPairs: [
    { open: "(", close: ")" },
    { open: "[", close: "]" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
    }
  }
} as monaco.languages.LanguageConfiguration;

export default configuration;
