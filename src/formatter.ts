import { TextEdit } from "vscode-languageserver-types";
import { WorkerAccessor } from "./languageFeatures";

export class DocumentFormatter implements monaco.languages.DocumentFormattingEditProvider {
    constructor(private _worker: WorkerAccessor) {
        this._worker = _worker;
    }

    /**
     * Method which will be publicly accessed from chartsMode
     */
    public provideDocumentFormattingEdits(
        model: monaco.editor.ITextModel,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken
    ): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
        return this.getEdits(model);
    }

    /**
     * Get document's edits via logic encapsulated in worker
     */
    public async getEdits(model: monaco.editor.ITextModel): Promise<monaco.languages.TextEdit[]> {
        const resource = model.uri;
        const worker = await this._worker(resource);
        const edits = await worker.doFormat(resource.toString());

        return this.prepareEdits(edits);
    }

    /**
     * Convert document's edits to monaco-compatible format
     */
    private prepareEdits(edits: TextEdit[]): monaco.languages.TextEdit[] {
        const result: monaco.languages.TextEdit[] = [];
        edits.forEach(edit => {
            result.push({
                // VSCode `Position` is zero-based, while monaco's starts from one
                range: {
                    endColumn: edit.range.end.character + 1,
                    endLineNumber: edit.range.end.line + 1,
                    startColumn: edit.range.start.character + 1,
                    startLineNumber: edit.range.start.line + 1
                },
                text: edit.newText
            });
        });

        return result;
    }
}
