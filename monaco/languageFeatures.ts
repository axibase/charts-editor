"use strict";
// tslint:disable object-literal-sort-keys
import { ChartsWorker } from "./chartsWorker";

import * as monaco from "monaco-editor-core";
import * as ls from "vscode-languageserver-types";
import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import Thenable = monaco.Thenable;

export type WorkerAccessor = (
  first: Uri,
  ...more: Uri[]
) => Promise<ChartsWorker>;

// --- completion ------

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

/**
 * Determines kind of completion item by its code
 * @param kind - completion item code
 */
function toCompletionItemKind(
  kind: number
): monaco.languages.CompletionItemKind {
  let mItemKind = monaco.languages.CompletionItemKind;

  switch (kind) {
    case ls.CompletionItemKind.Function:
      return mItemKind.Function;
    case ls.CompletionItemKind.Field:
      return mItemKind.Field;
    case ls.CompletionItemKind.Value:
      return mItemKind.Value;
    case ls.CompletionItemKind.Keyword:
      return mItemKind.Keyword;
    case ls.CompletionItemKind.Snippet:
      return mItemKind.Snippet;
  }
  return mItemKind.Property;
}

export class CompletionAdapter
  implements monaco.languages.CompletionItemProvider {

  constructor(private _worker: WorkerAccessor) {
    this._worker = _worker;
  }

  public get triggerCharacters(): string[] {
    return [" "];
  }

  public provideCompletionItems(
    model: monaco.editor.IReadOnlyModel,
    position: Position
  ): Thenable<monaco.languages.CompletionList> {
    const resource = model.uri;

    return this._worker(resource)
      .then(worker => {
        return worker.doComplete(resource.toString(), fromPosition(position));
      })
      .then(info => {
        if (!info) {
          return null;
        }
        const wordInfo = model.getWordUntilPosition(position);
        const wordRange = new Range(
          position.lineNumber,
          wordInfo.startColumn,
          position.lineNumber,
          wordInfo.endColumn
        );

        let items: monaco.languages.CompletionItem[] = info.items.map(entry => {
          let item: monaco.languages.CompletionItem = {
            label: entry.label,
            insertText: entry.insertText || entry.label,
            sortText: entry.sortText,
            detail: entry.detail,
            range: wordRange,
            kind: toCompletionItemKind(entry.kind)
          };
          if (entry.insertTextFormat === ls.InsertTextFormat.Snippet) {
            item.insertTextRules =
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          }
          return item;
        });

        return {
          isIncomplete: info.isIncomplete,
          suggestions: items
        };
      });
  }
}
