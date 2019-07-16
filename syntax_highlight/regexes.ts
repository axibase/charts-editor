// tslint:disable object-literal-sort-keys
// tslint:disable max-line-length
export const language_configuration = {
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

export const syntax = {
  MonarchTokensProvider: {
    controls: [
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
      "endif",
      "in"
    ],
    sections: [
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
    ],
    statistics: ["avg", "range", "value"],
    constants: ["true", "false"],
    tokenizer: {
      root: [
        { regex: /(?:"([^"]*)"|'([^']*)')/, action: "string" },
        [
          /[a-z_$][\w$]*/,
          {
            cases: {
              "@controls": "keyword.control",
              "@constants": "keyword.constants",
              "@statistics": "keyword.statistics"
            }
          }
        ],
        { regex: /^[ \t]*\[[a-z]+\]/, action: "keyword.section" },
        {
          regex: /^[ \t]*\w[-\w\s\d_]+?(?=\s*=)|column-.*/,
          action: "keyword.setting"
        },
        { regex: /[(@{|})]/, action: "placeholder" },
        {
          regex: /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
          action: "iso-date"
        },
        { regex: /[+-]?([0-9]*[.])?[0-9]+/, action: "number" },
        { regex: /^[ \t]*#.*/, action: "comment" },
        { include: "@whitespace" }
      ],

      whitespace: [
        [/[ \r\n]+/, "white"],
        ["/\\*", "comment", "@comment"],
        ["//$", "comment"],
        ["//", "comment", "@line_comment"]
      ],

      comment: [
        [/^\s*["|]\s*$/, "comment", "@comment_docblock"],
        [/[^\/*"|]+/, "comment"],
        ["/\\*", "comment", "@push"],
        ["\\*/", "comment", "@pop"],
        [/(")((?:[^"]|"")*)(")/, ["comment", "comment.doc", "comment"]],
        [/(\|)((?:[^|]|\|\|)*)(\|)/, ["comment", "comment.doc", "comment"]],
        [/[\/*"|]/, "comment"]
      ],

      comment_docblock: [
        [/\*\/|\/\*/, "@rematch", "@pop"], // recover: back to comment mode
        [/^\s*"\s*$/, "comment", "@pop"],
        [/^\s*\|\s*$/, "comment", "@pop"],
        [/[^*\/]+/, "comment.doc"],
        [/./, "comment.doc"] // catch all
      ],

      line_comment: [
        [/[^"|]*$/, "comment", "@pop"],
        [/[^"|]+/, "comment"],
        [
          /(")((?:[^"]|"")*)(")/,
          [
            "comment",
            "comment.doc",
            {
              cases: {
                "@eos": { token: "comment", next: "@pop" },
                "@default": "comment"
              }
            }
          ]
        ],
        [
          /(\|)((?:[^|]|\|\|)*)(\|)/,
          [
            "comment",
            "comment.doc",
            {
              cases: {
                "@eos": { token: "comment", next: "@pop" },
                "@default": "comment"
              }
            }
          ]
        ],
        [/.*$/, "comment", "@pop"]
      ]
    }
  }
};
