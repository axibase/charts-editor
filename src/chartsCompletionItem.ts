import { IRange } from "monaco-editor-core";
// tslint:disable object-literal-sort-keys
export class ChartsCompletionItem implements monaco.languages.CompletionItem {

  public static create(
    label: string,
    insertText: string,
    range: IRange,
    kind: monaco.languages.CompletionItemKind,
    sortText?: string,
    detail?: string,
    insertTextRules?: monaco.languages.CompletionItemInsertTextRule
  ): monaco.languages.CompletionItem {
    const item: monaco.languages.CompletionItem = {
      label,
      insertText,
      range,
      kind,
      sortText,
      detail,
      insertTextRules
    };

    return item;
  }

  public label: string;
  public insertText: string;
  public range: IRange;
  public kind: monaco.languages.CompletionItemKind;
  public sortText?: string;
  public detail?: string;
  public insertTextRules?: monaco.languages.CompletionItemInsertTextRule;
}
