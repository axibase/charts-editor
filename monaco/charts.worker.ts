import * as worker from "monaco-editor-core/esm/vs/editor/editor.worker";
import { chartsWorker } from "./chartsWorker";

self.onmessage = () => {
  // ignore the first message
  worker.initialize((ctx, createData) => {
    return new chartsWorker(ctx, createData);
  });
};
