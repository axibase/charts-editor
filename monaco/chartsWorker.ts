"use strict";

import { CompletionProvider } from "axibasecharts-syntax/server/axibase-server-web/dist/server/src/completionProvider";
import { Validator } from "axibasecharts-syntax/server/axibase-server-web/dist/server/src/validator";
import { Thenable, worker } from "monaco-editor-core";
import IWorkerContext = worker.IWorkerContext;
import * as ls from "vscode-languageserver-types";

export class ChartsWorker {

  private _ctx: IWorkerContext;
  private _languageId: string;

  constructor(ctx: IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this._languageId = createData.languageId;
  }

  public doComplete(
    uri: string,
    position: ls.Position
  ): Thenable<ls.CompletionList> {
    let document = this._getTextDocument(uri);
    let completions = new CompletionProvider(
      document,
      position
    ).getCompletionItems();
    return Promise.resolve(ls.CompletionList.create(completions));
  }

  public doValidation(uri: string): Thenable<ls.Diagnostic[]> {
    let document = this._getTextDocument(uri);
    if (document) {
      let diagnostics = new Validator(document.getText()).lineByLine();
      return Promise.resolve(diagnostics);
    }
    return Promise.resolve([]);
  }

  private _getTextDocument(uri: string): ls.TextDocument {
    let models = this._ctx.getMirrorModels();
    for (let model of models) {
      if (model.uri.toString() === uri) {
        return ls.TextDocument.create(
          uri,
          this._languageId,
          model.version,
          model.getValue()
        );
      }
    }
    return null;
  }
}

export interface ICreateData {
  languageId: string;
}

export function create(
  ctx: IWorkerContext,
  createData: ICreateData
): ChartsWorker {
  return new ChartsWorker(ctx, createData);
}
