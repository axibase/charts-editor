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
      [new RegExp(`'\.+\'`), "quoted-string"],
      [new RegExp(`^[ \t]*\\w[-\\w\\s\\d_]+?(?=\\s*=)|column-.*`), "keyword"],
      [new RegExp(`^[ \t]*[[${sections.join("|")}]+]`), "keyword"],
      [new RegExp(`^[ \t]*(${keywords.join("|")})`), "keyword"],
      [new RegExp(`[(@{|})]`), "placeholder"],
      [new RegExp(`(${boolean.join("|")})`), "boolean"],
      [/\d*\.*\d+([eE][\-+]?\d+)?/, "numeric"],
      [new RegExp(`^[ \t]*#.*`), "comment"],

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
