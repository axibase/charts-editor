"use strict";
// tslint:disable object-literal-sort-keys
import { ChartsWorker } from "./chartsWorker";

import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import * as ls from "vscode-languageserver-types";
import { ChartsCompletionItem } from "./chartsCompletionItem";

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

  public async provideCompletionItems(
    model: monaco.editor.IReadOnlyModel,
    position: Position
  ): Promise<monaco.languages.CompletionList> {
    const resource = model.uri;
    const worker = await this._worker(resource);
    const info = await worker.doComplete(resource.toString(), fromPosition(position));
    const completions = await this.getCompletionItems(model, position, info);

    return completions;
  }

  public getCompletionItems(
    model: monaco.editor.IReadOnlyModel,
    position: Position,
    info: ls.CompletionList
  ): monaco.languages.CompletionList {
    const wordInfo = model.getWordUntilPosition(position);
    const wordRange = new Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );

    const items: monaco.languages.CompletionItem[] = info.items.map(entry => {
      return ChartsCompletionItem.create(
        entry.label,
        entry.insertText || entry.label,
        wordRange,
        toCompletionItemKind(entry.kind),
        entry.sortText,
        entry.detail,
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      );
    });

    return {
      incomplete: info.isIncomplete,
      suggestions: items
    };
  }
}
