import { Uri } from "monaco-editor-core";
import { ChartsWorker } from "./chartsWorker";
import { DocumentFormatter } from "./formatter";
import { HoverProvider } from "./hoverProvider";
import * as languageFeatures from "./languageFeatures";
import { LanguageServiceDefaultsImpl } from "./monaco.contribution";
import { DiagnosticsAdapter } from "./validator";
import { WorkerManager } from "./workerManager";

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
  const client = new WorkerManager(defaults);
  const worker: languageFeatures.WorkerAccessor = (
    ...uris: Uri[]
  ): Promise<ChartsWorker> => {
    return client.getLanguageServiceWorker(...uris);
  };

  // CompletionProvider
  monaco.languages.registerCompletionItemProvider(
    defaults.languageId,
    new languageFeatures.CompletionAdapter(worker)
  );

  // Document Formatter
  monaco.languages.registerDocumentFormattingEditProvider(
    defaults.languageId,
    new DocumentFormatter(worker)
  );

  // Document Hover
  monaco.languages.registerHoverProvider(
    defaults.languageId,
    new HoverProvider(worker)
  );

  // Validator
  // tslint:disable-next-line: no-unused-expression
  new DiagnosticsAdapter(defaults.languageId, worker, defaults);
}
