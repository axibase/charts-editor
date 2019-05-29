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

monaco.editor.defineTheme("chartsTheme", {
  base: "vs",
  inherit: false,
  rules: [
    { token: "boolean", foreground: "221199" },
    { token: "keyword", foreground: "221199" },
    { token: "numeric", foreground: "116644" },
    { token: "placeholder", foreground: "9DC7E7" },
    { token: "value", foreground: "800000" }
  ]
});

// Create editor
monaco.editor.create(document.getElementById("container"), {
  theme: "chartsTheme",
  value: `[configuration]
  height-units = 4
  width-units = 1
  offset-right = 40
  starttime = 1997
  endtime = 2019
  markers = false
  entity = fred.stlouisfed.org
  legend-value = false
  
[group]
  [widget]
    title = Economic Policy Uncertainty Index (China)
    metric = CHIEPUINDXM_
    type = chart
    label = CHIEPUINDXM    
    
    [series]
      style = stroke-width: 2
      color = black
      alias = monthly_avg
      
    [series]
      axis = left
      statistic = wtavg
      period = .25 year
      mode = column
      color = green
      style = opacity: 0.5
      alert-expression = value > value('monthly_avg')
      alert-style = color: red
      pointer-position = false
      
    [dropdown]
      options = @{range(1997, 2019)}
      change-field = starttime

    [dropdown]
      options = @{range(1997, 2019)}
      change-field = endtime       

[group]
  [widget]
    title = Economic Policy Uncertainty Index (Russia)
    metric = RUSEPUINDXM_
    type = chart
    label = RUSEPUINDXM
    
    [series]
      style = stroke-width: 2
      color = black
      alias = monthly_avg
      
    [series]
      axis = left
      statistic = wtavg
      period = .25 year
      mode = column
      color = green
      style = opacity: 0.5
      alert-expression = value > value('monthly_avg')
      alert-style = color: red
      pointer-position = false
      
    [dropdown]
      options = @{range(1997, 2019)}
      change-field = starttime

    [dropdown]
      options = @{range(1997, 2019)}
      change-field = endtime        
      
[group]
  [widget]
    title = Economic Policy Uncertainty Index (United States)
    metric = USEPUINDXD_
    starttime = 1997
    endtime = 2019
    type = chart
    label = USEPUINDXD
    
    [series]
      style = stroke-width: 2
      color = black
      alias = monthly_avg
      
    [series]
      axis = left
      statistic = wtavg
      period = .25 year
      mode = column 
      color = green
      style = opacity: 0.5
      alert-expression = value > value('monthly_avg')
      alert-style = color: red
      pointer-position = false 
      
    [dropdown]
      options = @{range(1997, 2019)}
      change-field = starttime

    [dropdown]
      options = @{range(1997, 2019)}
      change-field = endtime        
      
[group]
  [widget]
    title = Economic Policy Uncertainty Index (Europe)
    entity = fred.stlouisfed.org
    metric = EUEPUINDXM_
    starttime = 1997
    endtime = 2019
    markers = false
    type = chart
    label = EUEPUINDXM

    [series]
      style = stroke-width: 2
      color = black
      alias = monthly_avg
      
    [series]
      axis = left
      statistic = wtavg
      period = .25 year
      mode = column
      color = green
      style = opacity: 0.5
      alert-expression = value > value('monthly_avg')
      alert-style = color: red
      pointer-position = false
      hello`,
  language: "axibaseCharts"
});
