"use strict";

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

function toCompletionItemKind(
  kind: number
): monaco.languages.CompletionItemKind {
  let mItemKind = monaco.languages.CompletionItemKind;

  switch (kind) {
    case ls.CompletionItemKind.Text:
      return mItemKind.Text;
    case ls.CompletionItemKind.Method:
      return mItemKind.Method;
    case ls.CompletionItemKind.Function:
      return mItemKind.Function;
    case ls.CompletionItemKind.Constructor:
      return mItemKind.Constructor;
    case ls.CompletionItemKind.Field:
      return mItemKind.Field;
    case ls.CompletionItemKind.Variable:
      return mItemKind.Variable;
    case ls.CompletionItemKind.Class:
      return mItemKind.Class;
    case ls.CompletionItemKind.Interface:
      return mItemKind.Interface;
    case ls.CompletionItemKind.Module:
      return mItemKind.Module;
    case ls.CompletionItemKind.Property:
      return mItemKind.Property;
    case ls.CompletionItemKind.Unit:
      return mItemKind.Unit;
    case ls.CompletionItemKind.Value:
      return mItemKind.Value;
    case ls.CompletionItemKind.Enum:
      return mItemKind.Enum;
    case ls.CompletionItemKind.Keyword:
      return mItemKind.Keyword;
    case ls.CompletionItemKind.Snippet:
      return mItemKind.Snippet;
    case ls.CompletionItemKind.Color:
      return mItemKind.Color;
    case ls.CompletionItemKind.File:
      return mItemKind.File;
    case ls.CompletionItemKind.Reference:
      return mItemKind.Reference;
  }
  return mItemKind.Property;
}

function toTextEdit(textEdit: ls.TextEdit): monaco.editor.ISingleEditOperation {
  if (!textEdit) {
    return void 0;
  }
  return {
    range: toRange(textEdit.range),
    text: textEdit.newText
  };
}

export class CompletionAdapter
  implements monaco.languages.CompletionItemProvider {
  // tslint:disable-next-line: variable-name
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
          return undefined;
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
            // tslint:disable-next-line: object-literal-sort-keys
            insertText: entry.insertText || entry.label,
            sortText: entry.sortText,
            filterText: entry.filterText,
            documentation: entry.documentation,
            detail: entry.detail,
            range: wordRange,
            kind: toCompletionItemKind(entry.kind)
          };
          if (entry.textEdit) {
            item.range = toRange(entry.textEdit.range);
            item.insertText = entry.textEdit.newText;
          }
          if (entry.additionalTextEdits) {
            item.additionalTextEdits = entry.additionalTextEdits.map(
              toTextEdit
            );
          }
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
