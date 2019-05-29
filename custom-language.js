const sections = [
  "column",
  "configuration",
  "dropdown",
  "group",
  "keys",
  "link",
  "node",
  "option",
  "other",
  "placeholders",
  "properties",
  "property",
  "series",
  "tag",
  "tags",
  "threshold",
  "widget"
];

const keywords = [
  "script",
  "endscript",
  "import",
  "csv",
  "endcsv",
  "endvar",
  "for",
  "endfor",
  "list",
  "endlist",
  "if",
  "endif"
];

const boolean = ["true", "false"];

export default {
  tokenizer: {
    root: [
      [new RegExp(`^[ \t]*[[${sections.join("|")}]+]`), "keyword"],
      [new RegExp(`^[ \t]*(${keywords.join("|")})`), "keyword"],
      [new RegExp(`@{.*}`), "placeholder"],
      [new RegExp(`(${boolean.join('|')})`), "boolean"],
      [/\d*\.*\d+([eE][\-+]?\d+)?/, "numeric"],
      // [/?:(=\s\s*([\S\s]+))/, "value"]
    ]
  }
};
