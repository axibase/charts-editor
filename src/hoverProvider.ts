import * as ls from "vscode-languageserver-types";
import { WorkerAccessor } from "./languageFeatures";

import Position = monaco.Position;
import Thenable = monaco.Thenable;
import Range = monaco.Range;
import CancellationToken = monaco.CancellationToken;

// --- hover ------
export class HoverProvider implements monaco.languages.HoverProvider {

    constructor(private _worker: WorkerAccessor) {
        this._worker = _worker;
    }

    public provideHover(
        model: monaco.editor.IReadOnlyModel,
        position: Position,
        token: CancellationToken
    ): Thenable<monaco.languages.Hover> {
        let resource = model.uri;

        return this._worker(resource).then(worker => {
            return worker.doHover(
                resource.toString(),
                fromPosition(position)
            );
        }).then(info => {
            if (!info) {
                return null;
            }
            return {
                contents: toMarkedStringArray(info.contents),
                range: toRange(info.range)
            } as monaco.languages.Hover;
        });
    }
}

// Helper functions
function fromPosition(position: Position): ls.Position {
    if (!position) {
        return void 0;
    }
    return { character: position.column - 1, line: position.lineNumber - 1 };
}

function toRange(range: ls.Range): Range {
    if (!range) {
        return void 0;
    }
    return new monaco.Range(
        range.start.line + 1,
        range.start.character + 1,
        range.end.line + 1,
        range.end.character + 1
    );
}

function toMarkedStringArray(
    contents: ls.MarkupContent
        | ls.MarkedString
        | ls.MarkedString[]
): monaco.IMarkdownString[] {
    if (!contents) {
        return void 0;
    }
    if (Array.isArray(contents)) {
        return contents.map(toMarkdownString);
    }
    return [toMarkdownString(contents)];
}

function toMarkdownString(entry: ls.MarkupContent | ls.MarkedString): monaco.IMarkdownString {
    if (typeof entry === "string") {
        return {
            value: entry
        };
    }
    if (isMarkupContent(entry)) {
        if (entry.kind === "plaintext") {
            return {
                value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&")
            };
        }
        return {
            value: entry.value
        };
    }

    return { value: "```" + entry.language + "\n" + entry.value + "\n```\n" };
}

function isMarkupContent(thing: any): thing is ls.MarkupContent {
    return thing && typeof thing === "object" && typeof (thing as ls.MarkupContent).kind === "string";
}
