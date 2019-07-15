// tslint:disable object-literal-sort-keys
import { IDisposable, Uri } from "monaco-editor-core";
import * as ls from "vscode-languageserver-types";
import { WorkerAccessor } from "./languageFeatures";

import { LanguageServiceDefaultsImpl } from "./monaco.contribution";

// --- diagnostics --- ---

export class DiagnosticsAdapter {

    private _disposables: IDisposable[] = [];
    private _listener: { [uri: string]: IDisposable } = Object.create(null);

    constructor(private _languageId: string, private _worker: WorkerAccessor, defaults: LanguageServiceDefaultsImpl) {
        const onModelAdd = (model: monaco.editor.IModel): void => {
            let modeId = model.getModeId();
            if (modeId !== this._languageId) {
                return;
            }

            let handle: number;
            this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
                clearTimeout(handle);
                handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
            });

            this._doValidate(model.uri, modeId);
        };

        const onModelRemoved = (model: monaco.editor.IModel): void => {
            monaco.editor.setModelMarkers(model, this._languageId, []);

            let uriStr = model.uri.toString();
            let listener = this._listener[uriStr];
            if (listener) {
                listener.dispose();
                delete this._listener[uriStr];
            }
        };

        this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
        this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
        this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
            onModelRemoved(event.model);
            onModelAdd(event.model);
        }));

        defaults.onDidChange(_ => {
            monaco.editor.getModels().forEach(model => {
                if (model.getModeId() === this._languageId) {
                    onModelRemoved(model);
                    onModelAdd(model);
                }
            });
        });

        this._disposables.push({
            dispose: () => {
                // tslint:disable-next-line: forin
                for (let key in this._listener) {
                    this._listener[key].dispose();
                }
            }
        });

        monaco.editor.getModels().forEach(onModelAdd);
    }

    public dispose(): void {
        this._disposables.forEach(d => d && d.dispose());
        this._disposables = [];
    }

    private _doValidate(resource: Uri, languageId: string): void {
        this._worker(resource).then(worker => {
            return worker.doValidation(resource.toString());
        }).then(diagnostics => {
            const markers = diagnostics.map(d => toDiagnostics(resource, d));
            let model = monaco.editor.getModel(resource);
            if (model.getModeId() === languageId) {
                monaco.editor.setModelMarkers(model, languageId, markers);
            }
        }).then(undefined, err => {
            console.error(err);
        });
    }
}

function toSeverity(lsSeverity: number): monaco.MarkerSeverity {
    switch (lsSeverity) {
        case ls.DiagnosticSeverity.Error: return monaco.MarkerSeverity.Error;
        case ls.DiagnosticSeverity.Warning: return monaco.MarkerSeverity.Warning;
        case ls.DiagnosticSeverity.Information: return monaco.MarkerSeverity.Info;
        case ls.DiagnosticSeverity.Hint: return monaco.MarkerSeverity.Hint;
        default:
            return monaco.MarkerSeverity.Info;
    }
}

function toDiagnostics(resource: Uri, diag: ls.Diagnostic): monaco.editor.IMarkerData {
    let code = typeof diag.code === "number" ? String(diag.code) :  diag.code as string;

    return {
        severity: toSeverity(diag.severity),
        startLineNumber: diag.range.start.line + 1,
        startColumn: diag.range.start.character + 1,
        endLineNumber: diag.range.end.line + 1,
        endColumn: diag.range.end.character + 1,
        message: diag.message,
        code,
        source: diag.source
    };
}
