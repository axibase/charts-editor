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
    { token: "comment", foreground: "42830B" },
    { token: "iso-date", foreground: "68AA89" },
    { token: "keyword.control", foreground: "68287A" },
    { token: "keyword.constants", foreground: "221199" },
    { token: "keyword.section", foreground: "221199" },
    { token: "keyword.setting", foreground: "b03060" },
    { token: "keyword.statistics", foreground: "EE8033" },
    { token: "number", foreground: "68AA89" },
    { token: "placeholder", foreground: "9DC7E7" },
    { token: "string", foreground: "AA322B" }
  ]
});

// Create editor
monaco.editor.create(document.getElementById("container"), {
  theme: "chartsTheme",
  value: `/*
  The Trends service relies on Axibase Times Series Database for essential data storage and processing tasks.
  The service uses the FRED® API by the Federal Reserve Bank of St. Louis. It is not endorsed or certified by the Bank.
  By using this service, you are agreeing to comply with the FRED® API Terms of Use at https://research.stlouisfed.org/docs/api/terms_of_use.html.
*/

[configuration]
  import fred = fred.js
  start-time = 1970-01-01
  end-time = 2018-01-01
  entity = fred.stlouisfed.org
  offset-left = 50
  offset-right = 50
  offset-top = 50
  offset-bottom = 50
  height-units = 1
  width-units = 1
  timezone = utc

[group]
  title = World Progress Explorer

[widget]
  type = chart
 
  [series]
    metric = population_total_by_country
    alias = raw
    display = false

    [tags]
      country = D*

# Letters without data have been removed.
      
list alphabetList = A*,
      B*,
      C*,
      D*,
      E*,
      F*,
      G*,
      H*,
      I*,
      K*,
      L*,
      M*,
      N*,
      O*,
      P*,
      Q*,
      R*,
      S*,
      T*,
      U*,
      V*,
      W*,
      Z*
      endlist
      
list metricList = adolescent_fertility_rate_by_country,
age_dependency_ratio_by_country,
crude_birth_rate_by_country,
fertility_rate_total_by_country,
infant_mortality_rate_by_country,
life_expectancy_at_birth_by_country,
population_total_by_country      
      endlist
      
  [dropdown]
    options = @{alphabetList.escape()}
    change-field = series.tags.country
      
  [dropdown]
    options = @{metricList.escape()}
    change-field = series.metric      
      
  [series]
    label-format = tags.country
    value = fred.Index('raw', '1990-01-01')`,
  language: "axibaseCharts"
});
