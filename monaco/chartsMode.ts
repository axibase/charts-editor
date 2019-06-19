import { Uri } from "monaco-editor-core";
import { ChartsWorker } from "./chartsWorker";
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

  monaco.languages.registerCompletionItemProvider(
    defaults.languageId,
    new languageFeatures.CompletionAdapter(worker)
  );

  // tslint:disable-next-line: no-unused-expression
  new DiagnosticsAdapter(defaults.languageId, worker, defaults);
}
