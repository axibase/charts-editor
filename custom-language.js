export default {
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
      { regex: new RegExp(`(?:"([^"]*)"|'([^']*)')`), action: "string" },
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@controls": "keyword.control",
            "@constants": "keyword.constants",
            "@sections": "keyword.section",
            "@statistics": "keyword.statistics"
          }
        }
      ],
      {
        regex: new RegExp(`^[ \t]*\\w[-\\w\\s\\d_]+?(?=\\s*=)|column-.*`),
        action: "keyword.setting"
      },
      { regex: new RegExp(`[(@{|})]`), action: "placeholder" },
      { regex: new RegExp(`[+-]?([0-9]*[.])?[0-9]+`), action: "number" },
      { regex: new RegExp(`^[ \t]*#.*`), action: "comment" },
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
};
