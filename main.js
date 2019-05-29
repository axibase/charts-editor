import * as monaco from "monaco-editor";

import vLang from "./custom-language";
import vCompletion from "./custom-completion";

monaco.languages.register({ id: "axibaseCharts" });
monaco.languages.setMonarchTokensProvider("axibaseCharts", vLang);

monaco.languages.registerCompletionItemProvider("axibaseCharts", {
  provideCompletionItems: () => {
    return { suggestions: vCompletion };
  }
});

// Create editor
monaco.editor.create(document.getElementById("container"), {
  value: `[configuration]
    entity = nurswgvml007
    metric = cpu_busy
    [group]
    [widget]
    type = chart
    end-time = 2018-07-05 12:00:00
    [series]
    [widget]
    type = chart
    end-time = 2018-07-05 13:00:00
    [series]`,
  language: "axibaseCharts"
});
