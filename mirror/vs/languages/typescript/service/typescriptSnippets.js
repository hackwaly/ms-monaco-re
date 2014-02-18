define(["require", "exports", "vs/nls"], function(require, exports, __nls__) {
  "use strict";
  var nls = __nls__;
  exports.snippets = [{
    type: "snippet",
    label: "foreach =>",
    codeSnippet: ["{{array}}.forEach(({{element}}:{{type}}) => {", "	{{}}", "});"].join("\n"),
    documentationLabel: nls.localize("foreach.snippet", "For-Each Loop using =>")
  }, {
    type: "snippet",
    label: "jsdoc comment",
    codeSnippet: ["/**", " * {{}}", " */"].join("\n"),
    documentationLabel: nls.localize("jsdoc.snippet", "jsdoc snippet")
  }, {
    type: "snippet",
    label: "ctor",
    codeSnippet: ["/**", " *", " */", "constructor() {", "	super();", "	{{}}", "}"].join("\n"),
    documentationLabel: nls.localize("constructor.snippet", "Constructor")
  }, {
    type: "snippet",
    label: "class",
    codeSnippet: ["/**", " * {{name}}", " */", "class {{name}} {", "	constructor({{parameters}}) {", "		{{}}", "	}",
      "}"
    ].join("\n"),
    documentationLabel: nls.localize("class.snippet", "Class Definition")
  }, {
    type: "snippet",
    label: "public method",
    codeSnippet: ["/**", " * {{name}}", " */", "public {{name}}() {", "	{{}}", "}"].join("\n"),
    documentationLabel: nls.localize("publicmethod.snippet", "Public Method Definition")
  }, {
    type: "snippet",
    label: "private method",
    codeSnippet: ["private {{name}}() {", "	{{}}", "}"].join("\n"),
    documentationLabel: nls.localize("privatemethod.snippet", "Private Method Definition")
  }];
});