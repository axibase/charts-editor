/// <reference path='../node_modules/monaco-editor-core/monaco.d.ts'/>

declare namespace monaco.languages.charts {
  export interface DiagnosticsOptions {
    readonly chartsCompletions?: string[];
  }

  export interface LanguageServiceDefaults {
    readonly onDidChange: IEvent<LanguageServiceDefaults>;
    readonly diagnosticsOptions: DiagnosticsOptions;

    setDiagnosticsOptions(options: DiagnosticsOptions): void;
  }

  export const chartsDefaults: LanguageServiceDefaults;
}
