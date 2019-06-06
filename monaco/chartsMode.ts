import { languages, Uri } from "monaco-editor-core";
import { ChartsWorker } from "./chartsWorker";
import * as languageFeatures from "./languageFeatures";
import { LanguageServiceDefaultsImpl } from "./monaco.contribution";
import { WorkerManager } from "./workerManager";

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
  const client = new WorkerManager(defaults);

  const worker: languageFeatures.WorkerAccessor = (
    ...uris: Uri[]
  ): Promise<ChartsWorker> => {
    return client.getLanguageServiceWorker(...uris);
  };

  languages.registerCompletionItemProvider(
    defaults.languageId,
    new languageFeatures.CompletionAdapter(worker)
  );
}
