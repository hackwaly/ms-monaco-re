define("vs/languages/lib/javascriptSnippets", ["require", "exports", "vs/nls!vs/languages/typescript/typescriptWorker2"],
  function(e, t, n) {
    t.snippets = [{
      type: "snippet",
      label: "define",
      codeSnippet: ["define([", "	'require',", "	'{{require}}'", "], function(require, {{factory}}) {",
        "	'use strict';", "	{{}}", "});"
      ].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 0)
    }, {
      type: "snippet",
      label: "for",
      codeSnippet: ["for (var {{index}} = 0; {{index}} < {{array}}.length; {{index}}++) {",
        "	var {{element}} = {{array}}[{{index}}];", "	{{}}", "}"
      ].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 1)
    }, {
      type: "snippet",
      label: "foreach",
      codeSnippet: ["{{array}}.forEach(function({{element}}) {", "	{{}}", "}, this);"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 2)
    }, {
      type: "snippet",
      label: "forin",
      codeSnippet: ["for (var {{key}} in {{object}}) {", "	if ({{object}}.hasOwnProperty({{key}})) {",
        "		var {{element}} = {{object}}[{{key}}];", "		{{}}", "	}", "}"
      ].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 3)
    }, {
      type: "snippet",
      label: "function",
      codeSnippet: ["function {{name}}({{params}}) {", "	{{}}", "}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 4)
    }, {
      type: "snippet",
      label: "if",
      codeSnippet: ["if ({{condition}}) {", "	{{}}", "}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 5)
    }, {
      type: "snippet",
      label: "ifelse",
      codeSnippet: ["if ({{condition}}) {", "	{{}}", "} else {", "	", "}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 6)
    }, {
      type: "snippet",
      label: "new",
      codeSnippet: ["var {{name}} = new {{type}}({{arguments}});{{}}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 7)
    }, {
      type: "snippet",
      label: "switch",
      codeSnippet: ["switch ({{key}}) {", "	case {{value}}:", "		{{}}", "		break;", "", "	default:", "		break;", "}"]
        .join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 8)
    }, {
      type: "snippet",
      label: "while",
      codeSnippet: ["while ({{condition}}) {", "	{{}}", "}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 9)
    }, {
      type: "snippet",
      label: "dowhile",
      codeSnippet: ["do {", "	{{}}", "} while ({{condition}});"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 10)
    }, {
      type: "snippet",
      label: "trycatch",
      codeSnippet: ["try {", "	{{}}", "} catch ({{error}}) {", "	", "}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 11)
    }, {
      type: "snippet",
      label: "log",
      codeSnippet: ["console.log({{message}});{{}}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 12)
    }, {
      type: "snippet",
      label: "settimeout",
      codeSnippet: ["setTimeout(function() {", "	{{}}", "}, {{timeout}});"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 13)
    }, {
      type: "snippet",
      label: "reference",
      codeSnippet: ['/// <reference path="{{path}}.ts" />', "{{}}"].join("\n"),
      documentationLabel: n.localize("vs_languages_lib_javascriptSnippets", 14)
    }];
  });