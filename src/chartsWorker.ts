"use strict";
import { LanguageService } from "@axibase/charts-language-service";
import { Thenable, worker } from "monaco-editor-core";
import IWorkerContext = worker.IWorkerContext;
import * as ls from "vscode-languageserver-types";
import { ResourcesProvider } from "./resourcesProvider";

export class ChartsWorker {

  private _ctx: IWorkerContext;
  private _languageId: string;

  constructor(ctx: IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this._languageId = createData.languageId;
    LanguageService.initialize(new ResourcesProvider());
  }

  public doComplete(
    uri: string,
    position: ls.Position
  ): Thenable<ls.CompletionList> {
    const document = this._getTextDocument(uri);

    const completions = LanguageService.getCompletionProvider(
      document, position
    ).getCompletionItems();

    return Promise.resolve(ls.CompletionList.create(completions));
  }

  public doValidation(uri: string): Thenable<ls.Diagnostic[]> {
    const document = this._getTextDocument(uri);
    if (document) {
      const diagnostics = LanguageService.getValidator(document.getText()).lineByLine();
      return Promise.resolve(diagnostics);
    }
    return Promise.resolve([]);
  }

  public doHover(uri: string, position: ls.Position): Thenable<ls.Hover> {
    const document = this._getTextDocument(uri);
    if (document) {
      const hoverItems = LanguageService.getHoverProvider(document).provideHover(position);
      return Promise.resolve(hoverItems);
    }
    return Promise.resolve(null);
  }

  public doFormat(uri: string, options: monaco.languages.FormattingOptions): Thenable<ls.TextEdit[]> {
    const document = this._getTextDocument(uri);
    if (document) {
      const edits = LanguageService.getFormatter(
        document.getText(),
        ls.FormattingOptions.create(options.tabSize, options.insertSpaces)
      ).lineByLine();
      return Promise.resolve(edits);
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
