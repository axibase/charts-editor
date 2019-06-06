"use strict";
import { editor, IDisposable, Uri } from "monaco-editor-core";
import { ChartsWorker } from "./chartsWorker";
import { LanguageServiceDefaultsImpl } from "./monaco.contribution";

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2 min

export class WorkerManager {
  private _defaults: LanguageServiceDefaultsImpl;
  private _idleCheckInterval: number;
  private _lastUsedTime: number;
  private _configChangeListener: IDisposable;
  private _worker: editor.MonacoWebWorker<ChartsWorker>;
  private _client: Promise<ChartsWorker>;

  constructor(defaults: LanguageServiceDefaultsImpl) {
    this._defaults = defaults;
    this._worker = null;
    this._idleCheckInterval = window.setInterval(
      () => this._checkIfIdle(),
      30 * 1000
    );
    this._lastUsedTime = 0;
    this._configChangeListener = this._defaults.onDidChange(() =>
      this._stopWorker()
    );
  }

  public getLanguageServiceWorker(...resources: Uri[]): Promise<ChartsWorker> {
    let _client: ChartsWorker;
    return this._getClient()
      .then(client => {
        _client = client;
      })
      .then(_ => {
        return this._worker.withSyncedResources(resources);
      })
      .then(_ => _client);
  }

  private _stopWorker(): void {
    if (this._worker) {
      this._worker.dispose();
      this._worker = null;
    }
    this._client = null;
  }

  private _checkIfIdle(): void {
    if (!this._worker) {
      return;
    }
    let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
    if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
      this._stopWorker();
    }
  }

  private _getClient(): Promise<ChartsWorker> {
    this._lastUsedTime = Date.now();

    if (!this._client) {
      this._worker = editor.createWebWorker<ChartsWorker>({
        // module that exports the create() method and returns a `CSSWorker` instance
        moduleId: "dist/ChartsWorker",

        label: this._defaults.languageId,

        // passed in to the create() method
        createData: {
          languageSettings: this._defaults.diagnosticsOptions,
          // tslint:disable-next-line: object-literal-sort-keys
          languageId: this._defaults.languageId
        }
      });

      this._client = (this._worker.getProxy() as any) as Promise<ChartsWorker>;
    }

    return this._client;
  }
}
