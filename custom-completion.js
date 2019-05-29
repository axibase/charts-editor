// custom-completion.js

/* eslint-disable no-template-curly-in-string */
export default [
  /** * Built-in function */
  {
    label: "getValue",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getValue(${1:pattern})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "Follow the regular expression described by pattern, get the matching string from the data item"
  },
  {
    label: "getIniString",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getIniString(${1:sec}, ${2: key})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "From the ini type data, according to the section and key, get the value corresponding to the key, return as a string"
  },
  {
    label: "getIniInt",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getIniInt(${1:sec}, ${2: key})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "From the ini type data, according to the section and key, get the value corresponding to the key, return as an integer"
  },
  {
    label: "getIniDouble",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getIniDouble(${1:sec}, ${2: key})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "From the ini type data, according to the section and key, get the value corresponding to the key, return as a floating point number"
  },
  {
    label: "isEmpty",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "isEmpty(${1:str})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: "Judge if str is empty"
  },
  {
    label: "isEqual",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "isEqual(${1:str1}, ${2: str2})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: "Judge if str is empty"
  },
  {
    label: "isContain",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "isContain(${1:str})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: "Judge whether the data item contains str"
  },
  {
    label: "getJsonInt",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getJsonInt(${1:path})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "Get the value returned as an integer in JSON data according to path"
  },
  {
    label: "getJsonDouble",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getJsonDouble(${1:path})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "Get the value returned as an integer in JSON data according to path"
  },
  {
    label: "getJsonSize",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "getJsonSize(${1:path})",
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation:
      "Get the length of the data as an array type in JSON data according to path"
  },
  /** * statement */
  {
    label: "IF-ELSE",
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: ["IF ${1:condition} THEN", "\t$0", "ELSE", "\t$0", "END"].join(
      "\n"
    ),
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: "If-Else Statement"
  },
  {
    label: "WHILE-DO",
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: ["WHILE ${1:condition} DO", "\t$0", "END"].join("\n"),
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: "WHILE-DO Statement"
  }
];
