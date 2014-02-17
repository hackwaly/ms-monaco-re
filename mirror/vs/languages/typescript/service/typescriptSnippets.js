define("vs/languages/typescript/service/typescriptSnippets", ["require", "exports",
  "vs/nls!vs/languages/typescript/typescriptWorker2"
], function(e, t, n) {
  t.snippets = [{
    type: "snippet",
    label: "foreach =>",
    codeSnippet: ["{{array}}.forEach(({{element}}:{{type}}) => {", "	{{}}", "});"].join("\n"),
    documentationLabel: n.localize("vs_languages_typescript_service_typescriptSnippets", 0)
  }, {
    type: "snippet",
    label: "jsdoc comment",
    codeSnippet: ["/**", " * {{}}", " */"].join("\n"),
    documentationLabel: n.localize("vs_languages_typescript_service_typescriptSnippets", 1)
  }, {
    type: "snippet",
    label: "ctor",
    codeSnippet: ["/**", " *", " */", "constructor() {", "	super();", "	{{}}", "}"].join("\n"),
    documentationLabel: n.localize("vs_languages_typescript_service_typescriptSnippets", 2)
  }, {
    type: "snippet",
    label: "class",
    codeSnippet: ["/**", " * {{name}}", " */", "class {{name}} {", "	constructor({{parameters}}) {", "		{{}}", "	}",
      "}"
    ].join("\n"),
    documentationLabel: n.localize("vs_languages_typescript_service_typescriptSnippets", 3)
  }, {
    type: "snippet",
    label: "public method",
    codeSnippet: ["/**", " * {{name}}", " */", "public {{name}}() {", "	{{}}", "}"].join("\n"),
    documentationLabel: n.localize("vs_languages_typescript_service_typescriptSnippets", 4)
  }, {
    type: "snippet",
    label: "private method",
    codeSnippet: ["private {{name}}() {", "	{{}}", "}"].join("\n"),
    documentationLabel: n.localize("vs_languages_typescript_service_typescriptSnippets", 5)
  }];
});