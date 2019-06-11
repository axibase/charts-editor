/// <reference path='../node_modules/monaco-editor-core/monaco.d.ts'/>

declare namespace monaco.languages.charts {
  export interface DiagnosticsOptions {
    readonly chartsCompletions?: string[];
  }

  export interface ChartsCompletionItem {
    create(
      label: string,
      insertText: string,
      range: IRange,
      kind: CompletionItemKind,
      sortText?: string,
      detail?: string,
      insertTextRules?: CompletionItemInsertTextRule
    ): CompletionItem;
  }

  export interface LanguageServiceDefaults {
    readonly onDidChange: IEvent<LanguageServiceDefaults>;
    readonly diagnosticsOptions: DiagnosticsOptions;

    setDiagnosticsOptions(options: DiagnosticsOptions): void;
  }

  export const chartsDefaults: LanguageServiceDefaults;
}
