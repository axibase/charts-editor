// @ts-ignore
import * as worker from "monaco-editor-core/esm/vs/editor/editor.worker";
import { ChartsWorker } from "./chartsWorker";

self.onmessage = () => {
  // ignore the first message
  worker.initialize((ctx: any, createData: any) => {
    return new ChartsWorker(ctx, createData);
  });
};
