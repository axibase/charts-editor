import { editor, Emitter, IEvent, languages } from "monaco-editor-core";
import { language_configuration, syntax } from "../syntax_highlight/regexes";
import { rules, themeName } from "../syntax_highlight/theme";

const languageID = "axibaseCharts";

export class LanguageServiceDefaultsImpl
  implements monaco.languages.charts.LanguageServiceDefaults {
  private _onDidChange = new Emitter<
    monaco.languages.charts.LanguageServiceDefaults
  >();
  private _diagnosticsOptions: monaco.languages.charts.DiagnosticsOptions;
  private _languageId: string;

  constructor(
    languageId: string,
    diagnosticsOptions: monaco.languages.charts.DiagnosticsOptions
  ) {
    this._languageId = languageId;
    this.setDiagnosticsOptions(diagnosticsOptions);
  }

  get onDidChange(): IEvent<monaco.languages.charts.LanguageServiceDefaults> {
    return this._onDidChange.event;
  }

  get languageId(): string {
    return this._languageId;
  }

  get diagnosticsOptions(): monaco.languages.charts.DiagnosticsOptions {
    return this._diagnosticsOptions;
  }

  public setDiagnosticsOptions(
    options: monaco.languages.charts.DiagnosticsOptions
  ): void {
    this._diagnosticsOptions = options || Object.create(null);
    this._onDidChange.fire(this);
  }
}

const diagnosticDefault: monaco.languages.charts.DiagnosticsOptions = {};

const chartsDefaults = new LanguageServiceDefaultsImpl(
  languageID,
  diagnosticDefault
);

// Export API
function createAPI(): typeof monaco.languages.charts {
  return {
    chartsDefaults
  };
}
monaco.languages.charts = createAPI();

// --- Registration to monaco editor ---

function getMode() {
  return import("./chartsMode");
}

editor.defineTheme(themeName, {
  base: "vs",
  inherit: false,
  rules
} as any);

languages.setMonarchTokensProvider(
  languageID,
  syntax.MonarchTokensProvider as any
);

languages.onLanguage(languageID, () => {
  return getMode().then(mode => mode.setupMode(chartsDefaults));
});

languages.register({
  id: languageID
});

languages.setLanguageConfiguration(languageID, language_configuration as any);
