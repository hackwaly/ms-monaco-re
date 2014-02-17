"use strict";

define("vs/base/time/schedulers", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e, t) {
      this.timeoutToken = -1;

      this.runner = e;

      this.timeout = t;

      this.timeoutHandler = this.onTimeout.bind(this);
    }
    e.prototype.dispose = function() {
      this.cancel();

      this.runner = null;
    };

    e.prototype.cancel = function() {
      if (-1 !== this.timeoutToken) {
        clearTimeout(this.timeoutToken);
        this.timeoutToken = -1;
      }
    };

    e.prototype.setRunner = function(e) {
      this.runner = e;
    };

    e.prototype.setTimeout = function(e) {
      this.timeout = e;
    };

    e.prototype.schedule = function() {
      this.cancel();

      this.timeoutToken = setTimeout(this.timeoutHandler, this.timeout);
    };

    e.prototype.onTimeout = function() {
      this.timeoutToken = -1;

      if (this.runner) {
        this.runner();
      }
    };

    return e;
  }();
  t.RunOnceScheduler = n;
});

define("vs/base/paths", ["require", "exports"], function(e, t) {
  function n(e) {
    return e.replace(/\\/g, "/");
  }

  function r(e) {
    var t = ~e.lastIndexOf("/") || ~e.lastIndexOf("\\");
    return 0 === t || 0 === ~t ? e : e.substring(0, ~t);
  }

  function i(e) {
    var n = ~e.lastIndexOf("/") || ~e.lastIndexOf("\\");
    return 0 === n ? e : ~n === e.length - 1 ? t.basename(e.substring(0, e.length - 1)) : e.substr(~n + 1);
  }

  function o() {
    for (var e = [], t = 0; t < arguments.length - 0; t++) {
      e[t] = arguments[t + 0];
    }
    for (var n = [], r = /\w+:\/\//.exec(e[0]), i = "/" === e[0][0], o = 0; o < e.length; o++) {
      n.push.apply(n, e[o].split("/"));
    }
    for (var o = 0; o < n.length; o++) {
      var s = n[o];
      if ("." === s || 0 === s.length) {
        n.splice(o, 1);
        o -= 1;
      } else {
        if (o > 0 && ".." === s) {
          n.splice(o - 1, 2);
          o -= 2;
        }
      }
    }
    r && n.splice(1, 0, "");

    i && n.unshift("");

    return n.join("/");
  }

  function s(e) {
    return "/" === e[0];
  }
  t.normalize = n;

  t.dirname = r;

  t.basename = i;

  t.join = o;

  t.isAbsolute = s;
});

define("vs/languages/typescript/service/textEdit", ["require", "exports", "vs/base/strings"], function(e, t, n) {
  function r(e) {
    return new o(e);
  }
  var i = function() {
    function e(e, t, n) {
      this.offset = e;

      this.length = t;

      this.text = n || "";

      this.parent = null;

      this.children = [];
    }
    e.prototype.isNoop = function() {
      return 0 === this.length && 0 === this.text.length;
    };

    e.prototype.isDelete = function() {
      return this.length > 0 && 0 === this.text.length;
    };

    e.prototype.isInsert = function() {
      return 0 === this.length && this.text.length > 0;
    };

    e.prototype.isReplace = function() {
      return this.length > 0 && this.text.length > 0;
    };

    e.prototype.getRightMostChild = function() {
      var e = this.children.length;
      return 0 === e ? this : this.children[e - 1].getRightMostChild();
    };

    e.prototype.remove = function() {
      return this.parent ? this.parent.removeChild(this) : !1;
    };

    e.prototype.addChild = function(e) {
      e.parent = this;
      var t;

      var n;
      for (t = 0, n = this.children.length; n > t && !(this.children[t].offset > e.offset); t++);
      this.children.splice(t, 0, e);
    };

    e.prototype.removeChild = function(e) {
      var t = this.children.indexOf(e);
      return -1 === t ? !1 : (e.parent = null, this.children.splice(t, 1), !0);
    };

    e.prototype.insert = function(e) {
      if (this.enclosedBy(e)) {
        e.insert(this);
        return e;
      }
      var t;

      var n;

      var r;
      for (t = 0, n = this.children.length; n > t; t++)
        if (r = this.children[t], r.enclosedBy(e)) {
          this.removeChild(r);
          e.insert(r);
          n--;
          t--;
        } else if (r.encloses(e)) {
        r.insert(e);
        return this;
      }
      this.addChild(e);

      return this;
    };

    e.prototype.enclosedBy = function(e) {
      return e.encloses(this);
    };

    e.prototype.encloses = function(e) {
      if (this.offset === this.offset && this.length === e.length) {
        return !1;
      }
      var t = this.length - e.length;

      var n = e.offset - this.offset;
      return n >= 0 && t >= 0 && t >= n;
    };

    return e;
  }();
  t.Edit = i;
  var o = function() {
    function e(e) {
      this.model = e;

      this.modelVersion = e.getVersionId();

      this.edit = new i(0, this.model.getValue().length, null);
    }
    e.prototype.replace = function(e, t, n) {
      if ("undefined" == typeof t) {
        t = 0;
      }

      if ("undefined" == typeof n) {
        n = null;
      }
      var r = new i(e, t, n);
      if (!r.isNoop()) {
        this.edit = this.edit.insert(r);
      }
    };

    e.prototype.apply = function() {
      if (this.model.getVersionId() !== this.modelVersion) throw new Error("illegal state - model has been changed");
      for (var e, t = this.model.getValue();
        (e = this.edit.getRightMostChild()) !== this.edit;) {
        t = n.splice(t, e.offset, e.length, e.text);
        e.parent.length += e.text.length - e.length;
        e.remove();
      }
      return t;
    };

    return e;
  }();
  t.create = r;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/resources/remoteModels", ["require", "exports", "vs/editor/core/model/mirrorModel"],
  function(e, t, n) {
    var r = function(e) {
      function t(n, r) {
        e.call(this, [], 1, t.normalize(r), n);
      }
      __extends(t, e);

      t.normalize = function(e) {
        e.length > 0 && e.charCodeAt(0) === t._bom && (e = e.substring(1));

        return e.replace(/\r\n/g, "\n");
      };

      t._bom = 65279;

      return t;
    }(n.AbstractMirrorModel);
    t.RemoteModel = r;
    var i = function(e) {
      function t(t, n) {
        e.call(this, t, n);
      }
      __extends(t, e);

      return t;
    }(r);
    t.DefaultLibModel = i;
  });

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

define("vs/languages/typescript/lint/rules", ["require", "exports", "vs/languages/typescript/lib/typescriptServices"],
  function(e, t) {
    ! function(e) {
      function t(e) {
        for (var t = [], n = 0; n < arguments.length - 1; n++) {
          t[n] = arguments[n + 1];
        }
        for (var r = e.kind(), i = 0, o = t.length; o > i; i++)
          if (r === t[i]) {
            return !0;
          }
        return !1;
      }

      function n(e) {
        var t = e.fullText();

        var n = e.leadingTriviaWidth();

        var r = e.trailingTriviaWidth();
        return 0 === n && 0 === r ? t : t.substr(n, t.length - (n + r));
      }
      e.isOfKind = t;

      e.text = n;
    }(t.syntaxHelper || (t.syntaxHelper = {}));
    t.syntaxHelper;
  });

define("vs/languages/typescript/lint/rules/layout", ["require", "exports", "vs/languages/typescript/lint/rules",
  "vs/languages/typescript/lib/typescriptServices"
], function(e, t, n, r) {
  var i = function() {
    function e() {
      this.code = "SA1503";

      this.name = "CurlyBracketsMustNotBeOmitted";

      this.filter = [r.SyntaxKind.IfStatement, r.SyntaxKind.ElseClause, r.SyntaxKind.DoStatement, r.SyntaxKind.ForInStatement,
        r.SyntaxKind.ForStatement, r.SyntaxKind.WhileStatement
      ];
    }
    e.prototype.checkElement = function(e, t) {
      var n = e;
      if (!(n.kind() === r.SyntaxKind.ElseClause && n.statement && n.statement.kind() === r.SyntaxKind.IfStatement)) {
        if (n.statement && n.statement.kind() !== r.SyntaxKind.Block) {
          t.reportError(n.statement, this.name, this.code);
        }
      }
    };

    return e;
  }();
  t.CurlyBracketsMustNotBeOmitted = i;
  var o = function() {
    function e() {
      this.code = "SA1514";

      this.name = "EmptyBlocksWithoutComment";

      this.filter = [r.SyntaxKind.Block];
    }
    e.prototype.checkElement = function(e, t) {
      if (!(e.statements.childCount() > 0 || this._hasComment(e))) {
        t.reportError(e, this.name, this.code);
      }
    };

    e.prototype._hasComment = function(e) {
      if (!e) {
        return !1;
      }
      if (!e.firstToken() || !e.lastToken()) {
        return !1;
      }
      for (var t = e.leadingTrivia().concat(e.trailingTrivia()), i = 0, o = t.count(); o > i; i++)
        if (n.syntaxHelper.isOfKind(t.syntaxTriviaAt(i), r.SyntaxKind.MultiLineCommentTrivia, r.SyntaxKind.SingleLineCommentTrivia)) {
          return !0;
        }
      for (var i = 0, o = e.childCount(); o > i; i++)
        if (this._hasComment(e.childAt(i))) {
          return !0;
        }
      return !1;
    };

    return e;
  }();
  t.EmptyBlocksWithoutComment = o;
});

define("vs/languages/typescript/lint/rules/typescript", ["require", "exports", "vs/base/strings",
  "vs/languages/typescript/lib/typescriptServices"
], function(e, t, n, r) {
  var i = function() {
    function e() {
      this.code = "SA9002";

      this.name = "FunctionsWithoutReturnType";

      this.filter = [r.SyntaxKind.CallSignature];
    }
    e.prototype.checkElement = function(e, t) {
      if (!e.typeAnnotation) {
        var n = t.parent(e);
        if (n.kind() !== r.SyntaxKind.ParenthesizedArrowFunctionExpression && n.kind() !== r.SyntaxKind.SimpleArrowFunctionExpression &&
          n.kind() !== r.SyntaxKind.FunctionExpression)
          if (n instanceof r.MemberFunctionDeclarationSyntax) {
            var i = n;
            t.reportError(i.propertyName, this.name, this.code);
          } else if (n instanceof r.FunctionDeclarationSyntax) {
          var o = n;
          t.reportError(o.identifier, this.name, this.code);
        }
      }
    };

    return e;
  }();
  t.FunctionsWithoutReturnType = i;
  var o = function() {
    function e() {
      this.code = "SA9056";

      this.name = "TripleSlashReferenceAlike";

      this.filter = [r.SyntaxKind.SingleLineCommentTrivia];
    }
    e.prototype.checkElement = function(e, t) {
      if (this._couldMeanTripleSlash(e)) {
        t.reportError(e, this.name, this.code);
      }
    };

    e.prototype._couldMeanTripleSlash = function(t) {
      var r = t.fullText();
      if (e._TripleSlashReference.test(r)) {
        return !1;
      }
      var i = r.split(/[\s=]/);
      if (!(i.length > 5)) {
        for (var o = 0, s = 0, a = 0, l = 0, c = i.length; c > l; l++) {
          o = Math.max(o, n.difference("reference", i[l]));
          s = Math.max(s, n.difference("path", i[l]));
          a = Math.max(a, (n.startsWith(i[l], '"') || n.startsWith(i[l], "'") ? 1 : 0) + (n.endsWith(i[l], '"') || n.endsWith(
            i[l], "'") ? 1 : 0));
        }
        return (a > 0 || s > 5) && o > 5 ? !0 : !1;
      }
    };

    e._TripleSlashReference = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*/im;

    return e;
  }();
  t.TripleSlashReferenceAlike = o;
  var s = function() {
    function e() {
      this.code = "SA9057";

      this.name = "UnusedImports";

      this.filter = [r.SyntaxKind.ImportDeclaration];
    }
    e.prototype.checkElement = function(e, t) {
      var n = t.end(e.identifier) - 1;

      var r = t.languageService().getOccurrencesAtPosition(t.filename(), n);
      if (1 === r.length) {
        t.reportError(e, this.name, this.code);
      }
    };

    return e;
  }();
  t.UnusedImports = s;
  var a = function() {
    function e() {
      this.code = "SA9058";

      this.name = "UnusedVariables";

      this.filter = [r.SyntaxKind.VariableStatement];
    }
    e.prototype.checkElement = function(e, t) {
      if (!r.SyntaxUtilities.containsToken(e.modifiers, r.SyntaxKind.ExportKeyword) && !r.SyntaxUtilities.containsToken(
        e.modifiers, r.SyntaxKind.DeclareKeyword))
        for (var n, i = e.variableDeclaration.variableDeclarators, o = 0, s = i.childCount(); s > o; o++)
          if (i.childAt(o) instanceof r.VariableDeclaratorSyntax) {
            n = i.childAt(o);
            var a = t.end(n.propertyName) - 1;

            var l = t.languageService().getOccurrencesAtPosition(t.filename(), a);
            if (l.length <= 1) {
              var a = void 0;

              var c = void 0;
              if (n.typeAnnotation) {
                a = t.start(n.propertyName);
                c = t.end(n.typeAnnotation) - a;
              }

              t.reportError(n.propertyName, this.name, this.code, a, c);
            }
          }
    };

    return e;
  }();
  t.UnusedVariables = a;
  var l = function() {
    function e() {
      this.code = "SA9059";

      this.name = "UnusedFunctions";

      this.filter = [r.SyntaxKind.FunctionDeclaration];
    }
    e.prototype.checkElement = function(e, t) {
      if (!r.SyntaxUtilities.containsToken(e.modifiers, r.SyntaxKind.ExportKeyword) && !r.SyntaxUtilities.containsToken(
        e.modifiers, r.SyntaxKind.DeclareKeyword)) {
        var n = e.identifier;

        var i = t.end(n) - 1;

        var o = t.languageService().getOccurrencesAtPosition(t.filename(), i);
        if (o.length <= 1) {
          t.reportError(n, this.name, this.code);
        }
      }
    };

    return e;
  }();
  t.UnusedFunctions = l;
  var c = function() {
    function e() {
      this.code = "SA9060";

      this.name = "UnusedMembers";

      this.filter = [r.SyntaxKind.MemberVariableDeclaration, r.SyntaxKind.MemberFunctionDeclaration];
    }
    e.prototype.checkElement = function(e, t) {
      var n;
      if (e instanceof r.MemberVariableDeclarationSyntax) {
        if (!r.SyntaxUtilities.containsToken(e.modifiers, r.SyntaxKind.PrivateKeyword)) return;
        n = e.variableDeclarator.propertyName;
      } else if (e instanceof r.MemberFunctionDeclarationSyntax) {
        if (!r.SyntaxUtilities.containsToken(e.modifiers, r.SyntaxKind.PrivateKeyword)) return;
        n = e.propertyName;
      }
      if (n) {
        var i = t.end(n) - 1;

        var o = t.languageService().getOccurrencesAtPosition(t.filename(), i);
        if (o.length <= 1) {
          t.reportError(n, this.name, this.code);
        }
      }
    };

    return e;
  }();
  t.UnusedMembers = c;
});

define("vs/languages/typescript/lint/rules/javascript", ["require", "exports", "vs/base/strings", "vs/base/collections",
  "vs/languages/typescript/lint/rules", "vs/languages/typescript/lib/typescriptServices"
], function(e, t, n, r, i, o) {
  var s = function() {
    function e() {
      this.code = "SA9005";

      this.name = "ComparisonOperatorsNotStrict";

      this.filter = [o.SyntaxKind.EqualsEqualsToken, o.SyntaxKind.ExclamationEqualsToken];
    }
    e.prototype.checkElement = function(e, t) {
      t.reportError(e, this.name, this.code);
    };

    return e;
  }();
  t.ComparisonOperatorsNotStrict = s;
  var a = function() {
    function e() {
      this.code = "SA9050";

      this.name = "MissingSemicolon";

      this.filter = [o.SyntaxKind.SemicolonToken];
    }
    e.prototype.checkElement = function(e, t) {
      if (!(e && 0 !== e.fullWidth())) {
        t.reportError(t.parent(e), this.name, this.code);
      }
    };

    return e;
  }();
  t.MissingSemicolon = a;
  var l = function() {
    function e() {
      this.code = "SA9051";

      this.name = "ReservedKeywords";
    }
    e.prototype.checkElement = function(e, t) {
      if (o.SyntaxFacts.isFutureReservedKeyword(e.kind())) {
        t.reportError(e, this.name, this.code);
      }
    };

    return e;
  }();
  t.ReservedKeywords = l;
  var c = function() {
    function e() {
      this.code = "SA9052";

      this.name = "TypeScriptSpecifics";
    }
    e.prototype.checkElement = function(e, t) {
      if (!(e.kind() < o.SyntaxKind.IdentifierName)) {
        if (this._isTrulyTypeScriptSpecific(e)) {
          t.reportError(e, this.name, this.code);
        }
      }
    };

    e.prototype._isTrulyTypeScriptSpecific = function(e) {
      if (!this._isTypeScriptSpecificToken(e)) {
        return !1;
      }
      var t = [];
      do {
        for (var n = 0, r = e.childCount(); r > n; n++) {
          var i = e.childAt(n);
          if (i) {
            t.push(i);
          }
        }
        if (e = t.shift(), this._isTypeScriptSpecificToken(e)) {
          return !1;
        }
      } while (t.length > 0);
      return !0;
    };

    e.prototype._isTypeScriptSpecificToken = function(e) {
      if (!e) {
        return !1;
      }
      if ("function" == typeof e.isTypeScriptSpecific && e.isTypeScriptSpecific()) {
        return !0;
      }
      var t = e.kind();
      return t >= o.SyntaxKind.FirstTypeScriptKeyword && t <= o.SyntaxKind.LastTypeScriptKeyword ? !0 : o.SyntaxFacts
        .isFutureReservedKeyword(t) || o.SyntaxFacts.isFutureReservedKeyword(t) ? !0 : !1;
    };

    return e;
  }();
  t.TypeScriptSpecifics = c;
  var u = function() {
    function e() {
      this.code = "SA9053";

      this.name = "UnknownTypeOfResults";
    }
    e.prototype.checkElement = function(t, s) {
      if (t instanceof o.BinaryExpressionSyntax) {
        var a = t;
        if (i.syntaxHelper.isOfKind(a.left, o.SyntaxKind.TypeOfExpression)) {
          var l = !1;
          if (a.right.kind() === o.SyntaxKind.StringLiteral) {
            var c = i.syntaxHelper.text(a.right);
            c = n.trim(c, "'");

            c = n.trim(c, '"');

            l = !r.contains(e._AllowedStrings, c);
          } else {
            if (a.right.kind() === o.SyntaxKind.NullKeyword) {
              l = !0;
            } else {
              if ("undefined" === i.syntaxHelper.text(a.right)) {
                l = !0;
              }
            }
          }
          if (l) {
            s.reportError(a, this.name, this.code);
          }
        }
      }
    };

    e._AllowedStrings = {
      "undefined": !0,
      object: !0,
      "function": !0,
      "boolean": !0,
      number: !0,
      string: !0
    };

    return e;
  }();
  t.UnknownTypeOfResults = u;
  var p = function() {
    function e() {
      this.code = "SA9054";

      this.name = "SemicolonsInsteadOfBlocks";

      this.filter = [o.SyntaxKind.IfStatement, o.SyntaxKind.ElseClause, o.SyntaxKind.WhileStatement, o.SyntaxKind.ForStatement,
        o.SyntaxKind.ForInStatement
      ];
    }
    e.prototype.checkElement = function(e, t) {
      if (e.statement && "function" == typeof e.statement.kind && e.statement.kind() === o.SyntaxKind.EmptyStatement) {
        t.reportError(e, this.name, this.code);
      }
    };

    return e;
  }();
  t.SemicolonsInsteadOfBlocks = p;
  var h = function() {
    function e() {
      this.code = "SA9055";

      this.name = "FunctionsInsideLoops";

      this.filter = [o.SyntaxKind.FunctionExpression, o.SyntaxKind.FunctionDeclaration, o.SyntaxKind.SimpleArrowFunctionExpression,
        o.SyntaxKind.ParenthesizedArrowFunctionExpression
      ];
    }
    e.prototype.checkElement = function(e, t) {
      for (var n = t.parent(e); n;) {
        if (i.syntaxHelper.isOfKind(n, o.SyntaxKind.ForStatement, o.SyntaxKind.ForInStatement, o.SyntaxKind.WhileStatement,
          o.SyntaxKind.DoStatement)) {
          t.reportError(e, this.name, this.code);
          break;
        }
        n = t.parent(n);
      }
    };

    return e;
  }();
  t.FunctionsInsideLoops = h;
  var d = function() {
    function e() {
      this.code = "SA9062";

      this.name = "NewOnLowercaseFunctions";

      this.filter = [o.SyntaxKind.ObjectCreationExpression];
    }
    e.prototype.checkElement = function(e, t) {
      var n;
      n = e.expression instanceof o.MemberAccessExpressionSyntax ? e.expression.name.fullText() : i.syntaxHelper.text(
        e.expression);

      if (n && !n.charAt(0).match(/[A-Z_]/)) {
        t.reportError(e.expression, this.name, this.code);
      }
    };

    return e;
  }();
  t.NewOnLowercaseFunctions = d;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/lint/lint", ["require", "exports", "vs/nls!vs/languages/typescript/typescriptWorker2",
  "vs/base/severity", "vs/base/types", "vs/base/collections", "vs/languages/typescript/lib/typescriptServices",
  "./rules/layout", "./rules/typescript", "./rules/javascript"
], function(e, t, n, r, i, o, s, a, l, c) {
  function u(e, t) {
    for (var n in e)
      if (e.hasOwnProperty(n)) {
        var r = e[n];
        if ("function" == typeof r) {
          t[String(n).toLowerCase()] = r;
        }
      }
  }

  function p(e) {
    var t = {};

    var n = [];
    u(a, t);

    u(c, t);

    u(l, t);
    for (var s in e)
      if (e.hasOwnProperty(s)) {
        var p = o.lookup(t, String(s).toLowerCase());
        if (p) {
          n.push({
            rule: i.create(p),
            severity: r.fromValue(e[s])
          });
        }
      }
    return n;
  }

  function h(e, t, n) {
    var r = p(e);

    var i = new f(t, r);
    return i.check(t.getSyntaxTree(n.toExternal()));
  }
  var d = function() {
    function e(e) {
      this._rules = {};

      this._errors = [];
      for (var t = 0, n = e.length; n > t; t++) {
        this._addRule(e[t]);
      }
    }
    e.prototype._addRule = function(e) {
      var t = this;

      var n = function(n) {
        o.lookupOrInsert(t._rules, n, []).push(e);
      };
      if (e.rule.filter) {
        e.rule.filter.forEach(n);
      } else {
        n(-1);
      }
    };

    e.prototype.check = function(e) {
      this._lineMap = e.lineMap();

      this._syntaxInfo = s.SyntaxInformationMap.create(e.sourceUnit(), !0, !1);

      this._errors.length = 0;

      this._currentSeverity = r.Severity.Warning;

      this._visit(e.sourceUnit());

      return this._errors.slice(0);
    };

    e.prototype.reportError = function(e, t, n, r, i) {
      if ("undefined" == typeof r) {
        r = this.start(e);
      }

      if ("undefined" == typeof i) {
        i = "function" == typeof e.width ? e.width() : e.fullWidth();
      }
      var o = this._lineMap.getLineAndCharacterFromPosition(r);

      var s = this._lineMap.getLineAndCharacterFromPosition(r + i);
      this._errors.push({
        message: t,
        code: n,
        severity: this._currentSeverity,
        range: {
          startLineNumber: 1 + o.line(),
          startColumn: 1 + o.character(),
          endLineNumber: 1 + s.line(),
          endColumn: 1 + s.character()
        }
      });
    };

    e.prototype.start = function(e) {
      return e === this._currentTrivia ? this._currentTriviaPosition : this._syntaxInfo.start(e);
    };

    e.prototype.end = function(e) {
      return e === this._currentTrivia ? this._currentTriviaPosition + e.fullWidth() : this._syntaxInfo.end(e);
    };

    e.prototype.parent = function(e) {
      return this._syntaxInfo.parent(e);
    };

    e.prototype._visit = function(e) {
      if (e) {
        if (e.isToken()) {
          var t = e.leadingTrivia();

          var n = t.count();
          t.concat(e.trailingTrivia());

          this._currentTriviaPosition = this.start(e) - e.leadingTriviaWidth();
          for (var r = 0, i = t.count(); i > r; r++) {
            this._currentTrivia = t.syntaxTriviaAt(r);
            this._checkNodeOrToken(this._currentTrivia);
            if (r !== n) {
              this._currentTriviaPosition += this._currentTrivia.fullWidth();
            } else {
              this._currentTriviaPosition = this.end(e) - e.trailingTriviaWidth();
            }
          }
          this._currentTrivia = null;

          this._currentTriviaPosition = null;
        }
        this._checkNodeOrToken(e);
        for (var r = 0, i = e.childCount(); i > r; r++) {
          this._visit(e.childAt(r));
        }
      }
    };

    e.prototype._checkNodeOrToken = function(e) {
      for (var t = e.kind(), n = o.lookup(this._rules, t, []).concat(o.lookup(this._rules, -1, [])), r = 0, i = n.length; i >
        r; r++)
        if (this._currentSeverity = n[r].severity, 0 !== this._currentSeverity) try {
          n[r].rule.checkElement(e, this);
        } catch (s) {
          console.error(s);
        }
    };

    return e;
  }();
  t.SimpleStyleRuleChecker = d;
  var m = function(e) {
    function t(t, n) {
      e.call(this, n);

      this._languageService = t;
    }
    __extends(t, e);

    t.prototype.languageService = function() {
      return this._languageService;
    };

    t.prototype.filename = function() {
      return this._filename;
    };

    t.prototype.check = function(t) {
      this._filename = t.fileName();

      return e.prototype.check.call(this, t);
    };

    return t;
  }(d);
  t.LanuageServiceStyleRuleChecker = m;
  var f = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.reportError = function(t, n, r, i, o) {
      return e.prototype.reportError.call(this, t, this._lookupMessage(n, r), r, i, o);
    };

    t.prototype._lookupMessage = function(e, t) {
      switch (t) {
        case "SA1503":
          return n.localize("vs_languages_typescript_lint_lint", 0);
        case "SA1514":
          return n.localize("vs_languages_typescript_lint_lint", 1);
        case "SA9005":
          return n.localize("vs_languages_typescript_lint_lint", 2);
        case "SA9050":
          return n.localize("vs_languages_typescript_lint_lint", 3);
        case "SA9051":
          return n.localize("vs_languages_typescript_lint_lint", 4);
        case "SA9052":
          return n.localize("vs_languages_typescript_lint_lint", 5);
        case "SA9053":
          return n.localize("vs_languages_typescript_lint_lint", 6);
        case "SA9054":
          return n.localize("vs_languages_typescript_lint_lint", 7);
        case "SA9055":
          return n.localize("vs_languages_typescript_lint_lint", 8);
        case "SA9062":
          return n.localize("vs_languages_typescript_lint_lint", 9);
        case "SA9002":
          return n.localize("vs_languages_typescript_lint_lint", 10);
        case "SA9056":
          return n.localize("vs_languages_typescript_lint_lint", 11);
        case "SA9057":
          return n.localize("vs_languages_typescript_lint_lint", 12);
        case "SA9058":
          return n.localize("vs_languages_typescript_lint_lint", 13);
        case "SA9059":
          return n.localize("vs_languages_typescript_lint_lint", 14);
        case "SA9060":
          return n.localize("vs_languages_typescript_lint_lint", 15);
        case "SA9061":
          return n.localize("vs_languages_typescript_lint_lint", 16);
      }
      return e;
    };

    return t;
  }(m);
  t.StyleRuleCheckerWithMessages = f;

  t.check = h;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/service/outline", ["require", "exports", "vs/base/strings", "vs/base/arrays",
  "vs/languages/typescript/lib/typescriptServices"
], function(e, t, n, r, i) {
  function o(e) {
    switch (e) {
      case 1:
        return "function";
      case 3:
        return "variable";
      case 8:
        return "enum";
      case 6:
        return "module";
      case 5:
        return "interface";
      case 4:
        return "class";
      case 2:
        return "constructor";
      case 7:
        return "property";
      case 0:
        return "method";
    }
    return "property";
  }

  function s(e, t) {
    var n = {
      type: null,
      label: null,
      range: null,
      children: null
    };
    e.accept(new a(n, t));

    return n.children;
  }! function(e) {
    e[e.Method = 0] = "Method";

    e[e.Function = 1] = "Function";

    e[e.Constructor = 2] = "Constructor";

    e[e.Variable = 3] = "Variable";

    e[e.Class = 4] = "Class";

    e[e.Interface = 5] = "Interface";

    e[e.Module = 6] = "Module";

    e[e.Property = 7] = "Property";

    e[e.Enum = 8] = "Enum";

    e[e.Rule = 9] = "Rule";

    e[e.File = 10] = "File";
  }(t.Type || (t.Type = {}));
  var a = (t.Type, function(e) {
    function t(t, n) {
      e.call(this);

      this.currentParent = t;

      this.range = n;

      this._parentStack = [];
    }
    __extends(t, e);

    t.prototype.add = function(e, t, n) {
      var r = {
        label: n,
        type: o(e),
        range: this.range(this.position() + t.leadingTriviaWidth(), t.width())
      };
      this.currentParent.children ? this.currentParent.children.push(r) : this.currentParent.children = [r];

      return r;
    };

    t.prototype.parent = function(e, t, n, r) {
      var i = this.currentParent;
      this.currentParent = this.add(e, t, n);
      try {
        r();
      } finally {
        this.currentParent = i;
      }
    };

    t.prototype.visitNode = function(t) {
      this._parentStack.push(t);

      e.prototype.visitNode.call(this, t);

      this._parentStack.pop();
    };

    t.prototype._callSignatureText = function(e) {
      return e.callSignature ? e.callSignature.parameterList ? e.callSignature.parameterList.fullText() : n.empty :
        n.empty;
    };

    t.prototype.visitClassDeclaration = function(t) {
      var n = this;
      this.parent(4, t, t.identifier.valueText(), function() {
        e.prototype.visitClassDeclaration.call(n, t);
      });
    };

    t.prototype.visitInterfaceDeclaration = function(t) {
      var n = this;
      this.parent(5, t, t.identifier.valueText(), function() {
        e.prototype.visitInterfaceDeclaration.call(n, t);
      });
    };

    t.prototype.visitMemberFunctionDeclaration = function(t) {
      this.add(0, t, n.format("{0}{1}", t.propertyName.valueText(), this._callSignatureText(t)));

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitMemberVariableDeclaration = function(t) {
      this.add(7, t, t.variableDeclarator.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitGetAccessor = function(t) {
      this.add(7, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitSetAccessor = function(t) {
      this.add(7, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitEnumDeclaration = function(t) {
      var n = this;
      this.parent(8, t, t.identifier.valueText(), function() {
        e.prototype.visitEnumDeclaration.call(n, t);
      });
    };

    t.prototype.visitEnumElement = function(t) {
      this.add(7, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitModuleDeclaration = function(t) {
      var n;
      if (t.stringLiteral) {
        n = t.stringLiteral.valueText();
      } else {
        if (t.name) {
          n = t.name.fullText();
        }
      }

      if (n) {
        this.add(6, t, n);
      }

      e.prototype.visitModuleDeclaration.call(this, t);
    };

    t.prototype.visitFunctionExpression = function(n) {
      if (n.identifier && this.add(1, n, n.identifier.valueText()), r.tail(this._parentStack, 1) instanceof i.ArgumentListSyntax &&
        r.tail(this._parentStack, 2) instanceof i.InvocationExpressionSyntax) {
        var o = r.tail(this._parentStack, 2);

        var s = o.expression;
        if (s.kind() === i.SyntaxKind.IdentifierName && s.valueText() === t._define) {
          return e.prototype.visitFunctionExpression.call(this, n);
        }
      }
      e.prototype.skip.call(this, n);
    };

    t.prototype.visitFunctionDeclaration = function(t) {
      this.add(1, t, n.format("{0}{1}", t.identifier.valueText(), this._callSignatureText(t)));

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitVariableDeclarator = function(t) {
      this.add(3, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitBinaryExpression = function(t) {
      if (t.operatorToken.kind() === i.SyntaxKind.EqualsToken && t.right.kind() === i.SyntaxKind.FunctionExpression &&
        t.left.kind() === i.SyntaxKind.MemberAccessExpression) {
        this.add(7, t.left, t.left.name.valueText());
      }

      e.prototype.skip.call(this, t);
    };

    t._define = "define";

    return t;
  }(i.PositionTrackingWalker));
  t.forSourceUnit = s;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/service/references", ["require", "exports", "../lib/typescriptServices",
  "vs/base/objects", "vs/base/lib/winjs.base"
], function(e, t, n, r, i) {
  function o(e, t) {
    var n = e.nodes().filter(function(e) {
      return !t.hasOwnProperty(e.getName());
    });
    return 0 === n.length ? null : (n.sort(function(e, t) {
      var n = e.getIncoming().length - t.getIncoming().length;
      0 === n && (n = t.getOutgoing().length - e.getOutgoing().length);

      0 === n && (n = e.getName().localeCompare(t.getName()));

      return n;
    }), n[0]);
  }

  function s(e) {
    for (var t, n, r = [], i = {}; null !== (t = o(e, i));) {
      e.traverse(t.getName(), function(e) {
        n = e.getName();

        if (!i[n]) {
          i[n] = !0;
          r.unshift(e);
        }
      });
    }
    return r;
  }

  function a(e, n, r) {
    var o;

    var s;

    var a = new p;

    var l = new y;
    n = n.slice(0);

    n.sort(function(e, t) {
      return t.references.length - e.references.length;
    });

    return new i.Promise(function(i) {
      function c() {
        return 0 === n.length ? (i(a), void 0) : (o = n.shift(), (s = a.hasNode(r.nodeName(o.path))) ? c() : (o.resolve(
          e, l.consume.bind(l), r).then(function() {
          t.fillGraph(a, a.insertNode(r.nodeName(o.path)), r, o);

          c();
        }), void 0));
      }
      c();
    });
  }

  function l(e, n, r, i) {
    i.references.forEach(function(o) {
      if (o.error && !o.file) {
        var s = {
          message: o.error.message,
          path: r.nodeName(i.path),
          offset: o.offset,
          length: o.length,
          referenceType: o instanceof d ? 1 : 2
        };
        e.insertEdge(n.getName(), "error:" + JSON.stringify(s));
      } else if (o.file) {
        var a = e.insertEdge(n.getName(), r.nodeName(o.file.path));
        if (!o.error) {
          t.fillGraph(e, a, r, o.file);
        }
      }
    });
  }

  function c(e) {
    return (new y).consume(e);
  }
  var u = function() {
    function e(e) {
      this.name = e;

      this.outgoing = {};

      this.incoming = {};
    }
    e.prototype.getName = function() {
      return this.name;
    };

    e.prototype.getOutgoing = function() {
      return Object.keys(this.outgoing);
    };

    e.prototype.getIncoming = function() {
      return Object.keys(this.incoming);
    };

    return e;
  }();

  var p = function() {
    function e() {
      this.store = {};
    }
    e.prototype.clone = function() {
      var t = new e;
      t.store = r.clone(this.store);

      return t;
    };

    e.prototype.merge = function(e) {
      var t = this;
      if (this !== e) {
        var n = Object.keys(e.store);
        n.forEach(function(e) {
          if (!t.hasNode(e)) {
            t.insertNode(e);
          }
        });

        n.forEach(function(n) {
          var r = e.store[n];
          r.getOutgoing().forEach(function(e) {
            t.insertEdge(n, e);
          });
        });
      }
    };

    e.prototype.isEmpty = function() {
      return 0 === Object.keys(this.store).length;
    };

    e.prototype.hasNode = function(e) {
      return this.store.hasOwnProperty(e);
    };

    e.prototype.insertNode = function(e) {
      var t = new u(e);
      this.store[e] = t;

      return t;
    };

    e.prototype.insertEdge = function(e, t) {
      this.hasNode(e) || this.insertNode(e);

      this.hasNode(t) || this.insertNode(t);

      this.store[e].outgoing[t] = !0;

      this.store[t].incoming[e] = !0;

      return this.store[t];
    };

    e.prototype.removeEdges = function(e) {
      for (var t = [], n = 0; n < arguments.length - 1; n++) {
        t[n] = arguments[n + 1];
      }
      if (this.hasNode(e)) {
        var r;

        var i;

        var o = this.store[e];

        var s = t.length;
        for (0 === t.length && (t = Object.keys(o.outgoing), s = t.length), r = 0; s > r; r++) {
          if (this.store.hasOwnProperty(t[r])) {
            i = this.store[t[r]];
            delete o.outgoing[i.name];
            delete i.incoming[e];
          }
        }
      }
    };

    e.prototype.removeNode = function(e) {
      var t = this;
      return this.store.hasOwnProperty(e) ? (delete this.store[e], Object.keys(this.store).forEach(function(n) {
        var r = t.store[n];
        delete r.incoming[e];

        delete r.outgoing[e];
      }), !0) : !1;
    };

    e.prototype.nodes = function() {
      var e = this;
      return Object.keys(this.store).map(function(t) {
        return e.store[t];
      });
    };

    e.prototype.node = function(e) {
      return this.store.hasOwnProperty(e) ? this.store[e] : null;
    };

    e.prototype.traverse = function(e, t, n) {
      if ("undefined" == typeof n) {
        n = {};
      }
      var r = this;
      if (this.store.hasOwnProperty(e) && n[e] !== !0) {
        n[e] = !0;
        var i = this.store[e];
        t(i);

        Object.keys(i.outgoing).forEach(function(e) {
          r.traverse(e, t, n);
        });
      }
    };

    e.prototype.toJSON = function() {
      for (var e = Object.keys(this.store), t = {}, n = {}, r = [], i = 0; i < e.length; i++) {
        var o = e[i];
        t[o] = i;

        n[i] = o;
      }
      for (var i = 0; i < e.length; i++) {
        var o = e[i];

        var s = this.store[o].getOutgoing();
        r.push(i);

        r.push(s.length);
        for (var a = 0; a < s.length; a++) {
          var l = s[a];

          var c = t[l];
          r.push(c);
        }
      }
      return {
        i: n,
        g: r
      };
    };

    e.fromJSON = function(t) {
      var n;

      var r;

      var i = new e;
      for (var o in t.i) {
        if (t.i.hasOwnProperty(o)) {
          n = t.i[o];
          i.insertNode(n);
        }
      }
      for (var s = 0, a = t.g.length; a > s; s++)
        for (n = t.i[t.g[s]], r = t.g[++s]; r > 0;) {
          i.insertEdge(n, t.i[t.g[++s]]);
          r -= 1;
        }
      return i;
    };

    return e;
  }();
  t.Graph = p;

  t.computeTransitiveClosure = s;

  t.buildDependencyGraph = a;

  t.fillGraph = l;
  var h = function() {
    function e(e, t, n) {
      this.offset = e;

      this.length = t;

      this.path = n;
    }
    return e;
  }();
  t.Reference = h;
  var d = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.REGEXP = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*/im;

    return t;
  }(h);
  t.TripleSlashReference = d;
  var m = function(e) {
    function t(t, n, r) {
      e.call(this, t, n, r);

      this.isRelative = 0 === this.path.indexOf("./") || 0 === this.path.indexOf("../");

      this.isRooted = 0 === this.path.indexOf("/");

      this.isAbsolute = !this.isRelative && !this.isRooted;
    }
    __extends(t, e);

    t.TS = ".ts";

    t.DTS = ".d.ts";

    t.JS = ".js";

    return t;
  }(h);
  t.ImportReference = m;
  var f = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    return t;
  }(m);
  t.RequireReference = f;
  var g = function() {
    function e(e, t) {
      this.path = e;

      this.content = t;

      this.references = [];
    }
    e.prototype.resolve = function(t, n, r, o) {
      if ("undefined" == typeof o) {
        o = {};
      }
      var s = this;
      this.references = n(this.content);

      o[this.path] = !0;

      return new i.Promise(function(i, a) {
        var l = s.references.length;

        var c = function() {
          if (0 === --l) {
            i(null);
          }
        };

        var u = function() {
          l += 1;
        };
        return 0 === l ? (i(null), void 0) : (s.references.forEach(function(i) {
          t.load(s.path, i, r).then(function(s) {
            if (s && o[s.path]) {
              i.file = s;
              i.error = {
                message: "cyclic reference",
                path: s.path
              };
            } else {
              i.file = s;
              if (r.recursive && i.file instanceof e) {
                u();
                s.resolve(t, n, r, o).then(function() {
                  c();
                }, a);
              }
            }

            c();
          }, function(e) {
            i.error = e;

            c();
          });
        }), void 0);
      });
    };

    return e;
  }();
  t.File = g;
  var v = function() {
    function e(e) {
      this.value = e;
      var t = n.SimpleText.fromString(e);
      this.scanner = new n.Scanner(null, t, 1);

      this.nextTokens = [];

      this.offset = 0;
    }
    e.prototype.next = function() {
      if (0 === this.nextTokens.length) {
        for (var e = this.scanner.scan([], !0), t = e.leadingTrivia(), n = e.trailingTrivia(), r = 0, i = t.count(); i >
          r; r++) {
          var o = t.syntaxTriviaAt(r);
          this.add(o.kind(), this.offset, o.fullWidth(), o.fullText());

          this.offset += o.fullWidth();
        }
        this.add(e.kind(), this.offset, e.width(), e.valueText());

        this.offset += e.width();
        for (var r = 0, i = n.count(); i > r; r++) {
          var o = n.syntaxTriviaAt(r);
          this.add(o.kind(), this.offset, o.fullWidth(), o.fullText());

          this.offset += o.fullWidth();
        }
      }
      return this.nextTokens.shift();
    };

    e.prototype.add = function(e, t, r, i) {
      switch (e) {
        case n.SyntaxKind.WhitespaceTrivia:
        case n.SyntaxKind.NewLineTrivia:
          return;
      }
      this.nextTokens.push({
        kind: e,
        offset: t,
        length: r,
        text: i
      });
    };

    return e;
  }();

  var y = function() {
    function e() {
      this.references = [];
    }
    e.prototype.consume = function(e) {
      function t(e) {
        if ("undefined" == typeof e) {
          e = !0;
        }

        i = r;
        do {
          r = s.next();
        } while (!e && (r.kind === n.SyntaxKind.SingleLineCommentTrivia || r.kind === n.SyntaxKind.MultiLineCommentTrivia));
        return r;
      }
      for (var r, i, o = this.references.length, s = new v(e); t().kind !== n.SyntaxKind.EndOfFileToken;) {
        var a = !1;
        if (r.kind === n.SyntaxKind.SingleLineCommentTrivia) {
          var l = r.text;

          var c = r.offset;

          var u = r.length;

          var p = d.REGEXP.exec(l);
          if (p) {
            this.references.push(new d(c + p[1].length + p[2].length, p[3].length, p[3]));
          }
        } else {
          if (r.kind === n.SyntaxKind.ImportKeyword) {
            t();
            if (r.kind === n.SyntaxKind.IdentifierName) {
              t();
              if (r.kind === n.SyntaxKind.EqualsToken) {
                t();
                a = !0;
              }
            }
          }
        }
        if ((a || !i || i.kind !== n.SyntaxKind.DotToken) && r.kind === n.SyntaxKind.RequireKeyword && (t(), r.kind ===
          n.SyntaxKind.OpenParenToken && (t(), r.kind === n.SyntaxKind.StringLiteral))) {
          var h = r.text;

          var c = r.offset;

          var u = r.length;
          t();

          if (r.kind === n.SyntaxKind.CloseParenToken) {
            if (a) {
              this.references.push(new m(c + 1, -2 + u, h));
            } else {
              this.references.push(new f(c + 1, -2 + u, h));
            }
          }
        }
        if (r.kind === n.SyntaxKind.IdentifierName && "define" === r.text && (t(), r.kind === n.SyntaxKind.OpenParenToken &&
          (t(!1), r.kind === n.SyntaxKind.StringLiteral && (t(!1), r.kind === n.SyntaxKind.CommaToken && t(!1)), r.kind ===
            n.SyntaxKind.OpenBracketToken)))
          for (t(!1); r.kind === n.SyntaxKind.StringLiteral;) {
            if ("exports" !== r.text && "require" !== r.text && "module" !== r.text) {
              this.references.push(new f(r.offset + 1, -2 + r.length, r.text));
            }
            t(!1);
            if (r.kind === n.SyntaxKind.CommaToken) {
              t(!1);
            }
          }
      }
      return this.references.slice(o);
    };

    return e;
  }();
  t.ScannerBasedCollector = y;

  t.collect = c;
});

define("vs/languages/typescript/service/languageServiceAdapter", ["require", "exports", "vs/base/collections",
  "vs/languages/typescript/lint/lint", "vs/base/paths", "vs/base/strings", "vs/base/severity", "vs/base/filters",
  "vs/editor/core/model/mirrorModel", "vs/languages/typescript/service/textEdit",
  "vs/languages/typescript/lib/typescriptServices", "vs/languages/typescript/resources/remoteModels",
  "vs/languages/lib/javascriptSnippets", "vs/languages/typescript/service/typescriptSnippets", "./outline",
  "./references"
], function(e, t, n, r, i, o, s, a, l, c, u, p, h, d, m, f) {
  var g = function() {
    function e(e, t, n, r) {
      this._compilationSettings = e;

      this._suggestSettings = t;

      this._host = n;

      this._languageService = r;

      this._applyTypeScriptCompilationSettings();
    }
    e.prototype._applyTypeScriptCompilationSettings = function() {
      var e = this._host.getCompilationSettings();
      e.useCaseSensitiveFileResolution = !1;

      e.noImplicitAny = this._compilationSettings.noImplicitAny;

      e.codeGenTarget = o.equalsIgnoreCase("ES3", this._compilationSettings.codeGenTarget) ? 0 : 1;

      e.moduleGenTarget = o.equalsIgnoreCase("commonjs", this._compilationSettings.moduleGenTarget) ? 1 : o.equalsIgnoreCase(
        "amd", this._compilationSettings.moduleGenTarget) ? 2 : 0;
    };

    Object.defineProperty(e.prototype, "languageService", {
      get: function() {
        return this._languageService;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.getExtraDiagnostics = function(e) {
      if (!this._compilationSettings.semanticValidation) {
        return [];
      }
      var t = r.check(this._compilationSettings.lint, this._languageService, e);
      return t.map(function(e) {
        return {
          code: 0,
          type: "",
          severity: e.severity,
          range: e.range,
          text: e.message
        };
      });
    };

    e.prototype.getSyntacticDiagnostics = function(e) {
      if (!this._compilationSettings.syntaxValidation) {
        return [];
      }
      var t = this._languageService.getSyntacticDiagnostics(e.toExternal());
      return this._toMarkers(e, t);
    };

    e.prototype.getSemanticDiagnostics = function(e) {
      if (!this._compilationSettings.semanticValidation) {
        return [];
      }
      var t = this._languageService.getSemanticDiagnostics(e.toExternal());
      return this._toMarkers(e, t);
    };

    e.prototype._toMarkers = function(e, t) {
      for (var n = [], r = 0; r < t.length; r++) {
        var i = t[r];

        var o = s.Severity.Error;
        if (this._compilationSettings.diagnosticClassifier) {
          o = this._compilationSettings.diagnosticClassifier(i);
        }

        if (o) {
          n.push({
            type: "",
            code: -1,
            text: i.text(),
            severity: o,
            range: this.rangeFromMinAndLim({
              minChar: i.start(),
              limChar: i.start() + i.length()
            }, e)
          });
        }
      }
      return n;
    };

    e.prototype.format = function(e, t, n) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getAssociatedResource().toExternal();

      var o = r.getOffsetFromPosition({
        lineNumber: t.startLineNumber,
        column: t.startColumn
      });

      var s = r.getOffsetFromPosition({
        lineNumber: t.endLineNumber,
        column: t.endColumn
      });

      var a = this._languageService.getFormattingEditsForRange(i, o, s, this.createFormatOptions(n));

      var l = this.applyTextEdits(a, r, o, s);
      return l.text;
    };

    e.prototype.formatAfterKeystroke = function(e, t, n) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getAssociatedResource().toExternal();

      var o = r.getOffsetFromPosition(t);

      var s = r.getOffsetFromPosition({
        lineNumber: t.lineNumber,
        column: 1
      });

      var a = r.getLineContent(t.lineNumber).length;

      var l = r.getValueInRange({
        startColumn: t.column,
        endColumn: t.column + 1,
        startLineNumber: t.lineNumber,
        endLineNumber: t.lineNumber
      });

      var c = this._languageService.getFormattingEditsAfterKeystroke(i, 1 + o, l, this.createFormatOptions(n));

      var u = this.applyTextEdits(c, r, s, s + a);
      return u;
    };

    e.prototype.createFormatOptions = function(e) {
      var t = new u.Services.FormatCodeOptions;
      t.ConvertTabsToSpaces = e.insertSpaces;

      t.TabSize = e.tabSize;

      t.IndentSize = e.tabSize;

      t.InsertSpaceAfterCommaDelimiter = !0;

      t.InsertSpaceBeforeAndAfterBinaryOperators = !0;

      t.InsertSpaceAfterSemicolonInForStatements = !0;

      return t;
    };

    e.prototype.applyTextEdits = function(e, t, n, r) {
      for (var i, o = c.create(t), s = 0; s < e.length; s++) {
        o.replace(e[s].minChar, e[s].limChar - e[s].minChar, e[s].text);
        n = Math.min(n, e[s].minChar);
        r = Math.max(r, e[s].limChar);
      }
      i = o.apply();

      i = i.substring(n, r + (i.length - t.getValue().length));

      return {
        text: i,
        range: this.rangeFromMinAndLim({
          minChar: n,
          limChar: r
        }, t.getAssociatedResource())
      };
    };

    e.prototype.getActionsAtPosition = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = n.getOffsetFromPosition(t);

      var o = [];

      var s = this._languageService.getSyntaxTree(r);

      var a = s.sourceUnit().findToken(i);
      return a.kind() !== u.SyntaxKind.IdentifierName ? o : (o.push("editor.actions.changeAll"), o.push(
        "editor.actions.rename"), o.push("editor.actions.referenceSearch.trigger"), o.push(
        "editor.actions.previewDeclaration"), o.push("editor.actions.goToDeclaration"), o);
    };

    e.prototype.getOutline = function(e) {
      var t = this;

      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = this._languageService.getSyntaxTree(r);
      return m.forSourceUnit(i.sourceUnit(), function(n, r) {
        return t.rangeFromMinAndLim({
          minChar: n,
          limChar: n + r
        }, e);
      });
    };

    e.prototype.getNavigateToItems = function(t) {
      for (var n, r = this._host.getScriptFileNames(), i = [], o = 0; o < r.length; o++) {
        n = this._languageService.getScriptLexicalStructure(r[o]);
        for (var s = 0; s < n.length; s++) {
          var a = n[s];

          var l = e.FILTER(t, n[s].name);
          if (l) {
            var c = this._host.getScriptSnapshot(a.fileName).model;
            if (c && !this.isBaseLibModel(c)) {
              i.push({
                containerName: a.containerName,
                name: a.name,
                type: a.kind,
                matchKind: a.matchKind,
                resourceUrl: c.getAssociatedResource().toExternal(),
                range: this.rangeFromMinAndLim(a, c.getAssociatedResource())
              });
            }
          }
        }
      }
      return i;
    };

    e.prototype.findOccurrences = function(e, t) {
      var n = this;

      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getAssociatedResource().toExternal();

      var o = r.getOffsetFromPosition(t);

      var s = this._languageService.getOccurrencesAtPosition(i, o);

      var a = s.map(function(t) {
        return {
          kind: t.isWriteAccess ? "write" : null,
          range: n.rangeFromMinAndLim(t, e)
        };
      });
      return a;
    };

    e.prototype.findDeclaration = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = n.getOffsetFromPosition(t);

      var o = this._languageService.getDefinitionAtPosition(r, i);
      if (!o || 0 === o.length) {
        return null;
      }
      var s = o[0];
      if (!s.fileName) {
        return null;
      }
      var a = this._host.getScriptSnapshot(s.fileName).model;
      if (this.isBaseLibModel(a)) {
        return null;
      }
      var l = {
        resourceUrl: a.getAssociatedResource().toExternal(),
        range: this.rangeFromMinAndLim(s, a.getAssociatedResource(), !0),
        preview: this.preview(a, s.minChar, s.limChar)
      };
      return l;
    };

    e.prototype.findTypeDeclaration = function() {
      return null;
    };

    e.prototype.isExternallyVisibleSymbole = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getOffsetFromPosition(t);

      var i = n.getAssociatedResource().toExternal();

      var o = this._languageService.getTypeAtPosition(i, r);
      if (!o) {
        return !0;
      }
      switch (o.kind) {
        case u.Services.ScriptElementKind.localVariableElement:
        case u.Services.ScriptElementKind.localFunctionElement:
        case u.Services.ScriptElementKind.parameterElement:
          return !1;
      }
      return !0;
    };

    e.prototype.findReferences = function(e, t) {
      var n = this;

      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getOffsetFromPosition(t);

      var o = r.getAssociatedResource().toExternal();

      var s = this._languageService.getReferencesAtPosition(o, i);

      var a = s.filter(function(e) {
        return !n.isBaseLibModel(n._host.getScriptSnapshot(e.fileName).model);
      }).map(function(e) {
        var t = n._host.getScriptSnapshot(e.fileName).model;

        var r = {
          resourceUrl: t.getAssociatedResource().toExternal(),
          range: n.rangeFromMinAndLim(e, t.getAssociatedResource()),
          preview: n.preview(t, e.minChar, e.limChar)
        };
        return r;
      });
      return a;
    };

    e.prototype.getTypeInformationAtPosition = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getOffsetFromPosition(t);

      var i = n.getAssociatedResource().toExternal();

      var o = this._languageService.getTypeAtPosition(i, r);
      if (!o) {
        return null;
      }
      var s = [{
        className: "type",
        text: o.memberName.toString()
      }, {
        className: "documentation",
        text: o.docComment
      }];

      var a = {
        value: "",
        htmlContent: s,
        className: "typeInfo ts",
        range: this.rangeFromMinAndLim(o, e)
      };
      return a;
    };

    e.prototype.getRangesToPosition = function(e, t) {
      for (var n = this._host.getScriptSnapshotByUrl(e).model, r = n.getOffsetFromPosition(t), i = n.getAssociatedResource()
          .toExternal(), o = this._languageService.getSyntaxTree(i), s = o.sourceUnit().findToken(r), a = []; null !==
        s;) {
        a.unshift({
          type: "node",
          range: this.rangeFromMinAndLim({
            minChar: s.start(),
            limChar: s.end()
          }, e)
        });
        s = s.parent();
      }
      return a;
    };

    e.prototype.suggest = function(e, t) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = e.toExternal();

      var o = r.getWordUntilPosition(t);

      var s = r.getOffsetFromPosition(t);

      var a = s - o.length;

      var l = "." === r.getValue().charAt(a - 1);

      var c = this._languageService.getCompletionsAtPosition(i, a, l);

      var u = new n.DelegateHashSet(function(e) {
        return e.type + e.label + e.codeSnippet;
      });
      if (c) {
        l = c.isMemberCompletion;
        for (var p = 0, m = c.entries.length; m > p; p++) {
          var f = c.entries[p];
          u.add({
            label: f.name,
            codeSnippet: f.name,
            type: this.monacoTypeFromEntryKind(f.kind)
          });
        }
      }
      var g = !l;

      var v = this._suggestSettings.alwaysAllWords || !c || 0 === c.entries.length;
      if (g) {
        for (var p = 0, m = h.snippets.length; m > p; p++) {
          u.add(h.snippets[p]);
        }
        for (var p = 0, m = d.snippets.length; m > p; p++) {
          u.add(d.snippets[p]);
        }
      }
      v && r.getAllUniqueWords(o).filter(function(e) {
        return !/^-?\d*\.?\d/.test(e);
      }).forEach(function(e) {
        var t = {
          type: "text",
          label: e,
          codeSnippet: e
        };
        u.add(t);
      });

      return u.toArray();
    };

    e.prototype.monacoTypeFromEntryKind = function(e) {
      switch (e) {
        case u.Services.ScriptElementKind.primitiveType:
        case u.Services.ScriptElementKind.keyword:
          return "keyword";
        case u.Services.ScriptElementKind.variableElement:
        case u.Services.ScriptElementKind.localVariableElement:
        case u.Services.ScriptElementKind.memberVariableElement:
        case u.Services.ScriptElementKind.memberGetAccessorElement:
        case u.Services.ScriptElementKind.memberSetAccessorElement:
          return "field";
        case u.Services.ScriptElementKind.functionElement:
        case u.Services.ScriptElementKind.memberFunctionElement:
        case u.Services.ScriptElementKind.constructSignatureElement:
        case u.Services.ScriptElementKind.callSignatureElement:
          return "function";
      }
      return e;
    };

    e.prototype.getSuggestionDetails = function(e, t, n) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = e.toExternal();

      var o = r.getOffsetFromPosition(t);

      var s = this._languageService.getCompletionEntryDetails(i, o, n.label);
      if (!s) {
        return n;
      }
      if (n.documentationLabel = s.docComment, n.typeLabel = s.type, n.codeSnippet = s.name, this._suggestSettings.useCodeSnippetsOnMethodSuggest &&
        "function" === this.monacoTypeFromEntryKind(s.kind)) {
        var a = this.parseMethodSignature(s.type);

        var l = a.arguments.map(function(e) {
          return "{{" + e.name.trim() + "}}";
        });

        var c = s.name;
        c += l.length > 0 ? "(" + l.join(", ") + "){{}}" : "()";

        n.codeSnippet = c;
      }
      return n;
    };

    e.prototype.quickFix = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = n.getOffsetFromPosition(t);

      var s = n.getWordUntilPosition(t);

      var a = i - s.length;

      var l = "." === n.getValue().charAt(a - 1);

      var c = this._languageService.getCompletionsAtPosition(r, a, l);

      var u = [];
      c.entries.forEach(function(e) {
        var t = o.difference(s, e.name);
        if (!(t < s.length / 2)) {
          u.push({
            type: "field",
            label: e.name,
            codeSnippet: e.name,
            score: t
          });
        }
      });

      u.sort(function(e, t) {
        return t.score - e.score;
      });

      return u.slice(0, 3);
    };

    e.prototype.parseMethodSignature = function(e) {
      var t;

      var n;

      var r;

      var i = [];

      var o = "";

      var s = "";

      var a = !0;

      var l = 1;
      for (t = 1, n = e.length; n > t; t++)
        if (r = e.charAt(t), ")" === r && l--, "(" === r && l++, 1 !== l || ":" !== r)
          if (1 !== l || "," !== r) {
            if (0 === l && ")" === r) {
              if ("" !== o) {
                i.push({
                  name: o,
                  type: s
                });
              }
              break;
            }
            if (a) {
              o += r;
            } else {
              s += r;
            }
          } else {
            i.push({
              name: o,
              type: s
            });
            o = "";
            s = "";
            a = !0;
          } else {
            a = !1;
          }
      return {
        arguments: i,
        flatArguments: e.substr(0, t + 1),
        flatReturnType: e.substr(t + 5)
      };
    };

    e.transformParameter = function(e) {
      return {
        label: e.name,
        documentation: e.docComment,
        signatureLabelOffset: e.minChar,
        signatureLabelEnd: e.limChar
      };
    };

    e.transformSignature = function(t) {
      return {
        label: t.signatureInfo,
        documentation: t.docComment,
        parameters: t.parameters.map(function(t) {
          return e.transformParameter(t);
        })
      };
    };

    e.prototype.getParameterHints = function(t, n) {
      var r = this._host.getScriptSnapshotByUrl(t).model;

      var i = r.getOffsetFromPosition(n);

      var o = r.getAssociatedResource().toExternal();

      var s = this._languageService.getSignatureAtPosition(o, i);
      if (!s) {
        return null;
      }
      var a = {
        currentSignature: Math.max(0, s.activeFormal),
        currentParameter: Math.max(0, s.actual.currentParameter),
        signatures: s.formal.map(function(t) {
          return e.transformSignature(t);
        })
      };
      return a;
    };

    e.prototype.getEmitOutput = function(e, t) {
      var n = this._languageService.getEmitOutput(e.toExternal());

      var r = n.outputFiles;
      if (!r) {
        return null;
      }
      for (var i = 0, s = r.length; s > i; i++)
        if (o.endsWith(r[i].name, t)) {
          return r[i].text;
        }
      return null;
    };

    e.prototype.findModuleReferences = function(e) {
      var t = this;

      var n = new Array;

      var r = this._host.getScriptSnapshot(e.toExternal()).model;
      f.collect(r.getValue()).forEach(function(o) {
        if (o instanceof f.ImportReference) {
          if (o.isRelative) {
            n.push({
              openInEditor: !0,
              range: r.getRangeFromOffsetAndLength(o.offset, o.length),
              url: i.join(i.dirname(e.toExternal()), o.path + ".ts")
            });
          } else {
            n.push({
              openInEditor: !0,
              range: r.getRangeFromOffsetAndLength(o.offset, o.length),
              url: i.join(t._compilationSettings.scope, o.path + ".ts")
            });
          }
        } else {
          if (o instanceof f.TripleSlashReference) {
            n.push({
              openInEditor: !0,
              range: r.getRangeFromOffsetAndLength(o.offset, o.length),
              url: i.join(i.dirname(e.toExternal()), o.path)
            });
          }
        }
      });

      return n;
    };

    e.prototype.isBaseLibModel = function(e) {
      return e instanceof p.DefaultLibModel;
    };

    e.prototype.rangeFromMinAndLim = function(e, t, n) {
      if ("undefined" == typeof n) {
        n = !1;
      }
      var r = this._host.getScriptSnapshotByUrl(t).model;

      var i = e.minChar;

      var o = Math.max(1, e.limChar - e.minChar);
      if (n) {
        var s = r.getPositionFromOffset(i);
        return {
          startLineNumber: s.lineNumber,
          startColumn: s.column,
          endLineNumber: s.lineNumber,
          endColumn: s.column
        };
      }
      return r.getRangeFromOffsetAndLength(i, o);
    };

    e.prototype.preview = function(e, t, n, r) {
      if ("undefined" == typeof r) {
        r = 200;
      }
      for (var i, o = this._languageService.getSyntaxTree(e.getAssociatedResource().toExternal()), s = o.sourceUnit()
          .findToken(t); s && !i;) {
        if (s.fullWidth() > r) {
          i = s;
        }
        s = s.parent();
      }
      if (!i) {
        i = o.sourceUnit().findToken(t).root();
      }
      var a = e.getValue().substring(i.fullStart(), i.fullEnd());

      var c = new l.MirrorModel(0, a);

      var u = t - i.fullStart();

      var p = n - t;

      var h = c.getRangeFromOffsetAndLength(u, p);
      c.dispose();

      return {
        text: a,
        range: h
      };
    };

    e.FILTER = a.or(a.matchesPrefix, a.matchesContiguousSubString, a.matchesCamelCase);

    return e;
  }();
  t.LanguageServiceAdapter = g;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/service/languageServiceHost2", ["require", "exports", "vs/base/collections",
  "vs/base/errors", "vs/languages/typescript/lib/typescriptServices",
  "vs/languages/typescript/resources/remoteModels"
], function(e, t, n, r, i, o) {
  var s = function() {
    function e() {
      this.logger = console.warn;
    }
    e.prototype.information = function() {
      this.logger = console.log;

      return !0;
    };

    e.prototype.debug = function() {
      this.logger = console.log;

      return !0;
    };

    e.prototype.warning = function() {
      this.logger = console.warn;

      return !0;
    };

    e.prototype.error = function() {
      this.logger = console.error;

      return !0;
    };

    e.prototype.fatal = function() {
      this.logger = console.error;

      return !0;
    };

    e.prototype.log = function() {};

    return e;
  }();
  t.ConsoleLogger = s;
  var a = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.getDiagnosticsObject = function() {
      return this;
    };

    t.prototype.getLocalizedDiagnosticMessages = function() {
      return null;
    };

    t.prototype.getScriptSnapshot = function() {
      throw r.notImplemented();
    };

    t.prototype.resolveRelativePath = function() {
      throw r.notImplemented();
    };

    t.prototype.fileExists = function() {
      throw r.notImplemented();
    };

    t.prototype.directoryExists = function() {
      throw r.notImplemented();
    };

    t.prototype.getParentDirectory = function() {
      throw r.notImplemented();
    };

    return t;
  }(s);
  t.AbstractLanguageServiceHost = a;
  var l = function() {
    function e(e) {
      this._model = e;

      this._versionId = e.getVersionId();

      this._open = !(e instanceof o.RemoteModel);

      this._value = e.getValue();

      this._length = this._value.length;
    }
    Object.defineProperty(e.prototype, "model", {
      get: function() {
        return this._model;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "versionId", {
      get: function() {
        return this._versionId;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "open", {
      get: function() {
        return this._open;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.getText = function(e, t) {
      return this._value.substring(e, t);
    };

    e.prototype.getLength = function() {
      return this._length;
    };

    e.prototype.getLineStartPositions = function() {
      if (!this._lineStarts) {
        this._lineStarts = [];
        for (var e = 0, t = this._model.getLineCount(); t > e; e++) {
          this._lineStarts.push(this._model.getLineStart(e + 1));
        }
      }
      return this._lineStarts;
    };

    e.prototype.getTextChangeRangeSinceVersion = function() {
      return null;
    };

    return e;
  }();
  t.MirrorModelSnapshot = l;
  var c = function(e) {
    function t(t) {
      e.call(this);

      this._resourceService = t;

      this._resourceSet = {};

      this._compilationSettings = new i.CompilationSettings;
    }
    __extends(t, e);

    t.prototype.updateResources = function(e) {
      var t = this;
      e.forEach(function(e) {
        return t._updateResource(e);
      });
    };

    t.prototype._updateResource = function(e) {
      var t = e.toExternal();

      var r = this._resourceService.get(e);
      if (r) {
        var i = r.getVersionId();
        if (!(n.contains(this._resourceSet, t) && n.lookup(this._resourceSet, t).versionId === i)) {
          this._resourceSet[t] = new l(r);
        }
      } else {
        console.warn(e.toExternal() + " NOT found");
        delete this._resourceService[t];
      }
    };

    t.prototype.isScriptFileName = function(e) {
      return n.contains(this._resourceSet, e);
    };

    t.prototype.getCompilationSettings = function() {
      return this._compilationSettings;
    };

    t.prototype.getScriptFileNames = function() {
      return n.keys(this._resourceSet);
    };

    t.prototype.getScriptByteOrderMark = function() {
      return 1;
    };

    t.prototype.getScriptVersion = function(e) {
      return n.lookup(this._resourceSet, e).versionId;
    };

    t.prototype.getScriptIsOpen = function(e) {
      return n.lookup(this._resourceSet, e).open;
    };

    t.prototype.getScriptSnapshot = function(e) {
      return n.lookup(this._resourceSet, e);
    };

    t.prototype.getScriptSnapshotByUrl = function(e) {
      return n.lookup(this._resourceSet, e.toExternal());
    };

    return t;
  }(a);
  t.LanguageServiceHost = c;
});

define("vs/languages/typescript/resources/dependencyResolver", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/lifecycle", "vs/base/hash", "vs/base/collections", "vs/platform/services",
  "vs/editor/core/model/mirrorModel", "vs/languages/typescript/service/references"
], function(e, t, n, r, i, o, s, a, l) {
  ! function(e) {
    e.OnReferencesChanged = "onReferencesChanged";
  }(t.Events || (t.Events = {}));
  var c = t.Events;

  var u = function() {
    function e() {}
    e.prototype.fetchDependencies = function() {
      return e._Empty;
    };

    e.prototype.dispose = function() {};

    e._Empty = n.TPromise.as(o.EmptyIterable);

    return e;
  }();
  t.NullDependencyResolver = u;
  var p = function() {
    function e(e) {
      this._delegates = e;
    }
    e.prototype.fetchDependencies = function(e) {
      var t = this._delegates.map(function(t) {
        return t.fetchDependencies(e);
      });
      return n.Promise.join(t).then(function(e) {
        return o.combine(e);
      });
    };

    e.prototype.dispose = function() {
      r.disposeAll(this._delegates);
    };

    return e;
  }();
  t.CompositeDependencyResolver = p;
  var h = function() {
    function e(e, t) {
      this._resourceService = e;

      this._requestService = t;
    }
    e.prototype.dispose = function() {};

    e.prototype.fetchDependencies = function(t) {
      return t && this._requestService.getPath("root", t) ? this._resourceService.get(t) instanceof a.MirrorModel ?
        this._doFetchDependencies(t, this._resourceService.get(t)) : e._Empty : e._Empty;
    };

    e.prototype._doFetchDependencies = function() {
      return e._Empty;
    };

    e._Empty = n.TPromise.as(o.EmptyIterable);

    return e;
  }();
  t.AbstractDependencyResolver = h;
  var d = function() {
    function e(e, t, n) {
      var r = this;
      this._delegate = e;

      this._eventbus = t;

      this._resourceService = n;

      this._cache = new o.Dictionary;

      this._callOnDispose = new Array;

      this._callOnDispose.push(this._resourceService.addListener2(s.ResourceEvents.REMOVED, function(e) {
        return r._cache.remove(e.url);
      }));
    }
    e.prototype.dispose = function() {
      r.disposeAll(this._callOnDispose);

      this._cache.forEach(function(e) {
        return e.value.listener.dispose();
      });

      this._cache.clear();
    };

    e.prototype.fetchDependencies = function(e) {
      var t = this;
      if (!this._cache.containsKey(e)) {
        var n = this._resourceService.get(e);
        this._cache.add(e, {
          stateId: this._computeState(n),
          request: this._delegate.fetchDependencies(e),
          listener: n.addListener2("changed", function() {
            return t._validateCache(n);
          })
        });
      }
      return this._cache.lookup(e).request;
    };

    e.prototype._validateCache = function(e) {
      var t = this;

      var n = this._cache.lookup(e.getAssociatedResource());
      clearTimeout(n.scheduledUpdate);

      n.scheduledUpdate = setTimeout(function() {
        if (n.stateId !== t._computeState(e)) {
          n.listener.dispose();
          t._cache.remove(e.getAssociatedResource());
          t._eventbus.emit(c.OnReferencesChanged, {
            resource: e.getAssociatedResource()
          });
        }
      }, 1500);
    };

    e.prototype._computeState = function(e) {
      for (var t = l.collect(e.getValue()), n = 11, r = 0, o = t.length; o > r; r++) {
        n = i.combine(i.computeMurmur2StringHashCode(t[r].path) + 59 * t[r].offset + 61 * t[r].length, n);
      }
      return n;
    };

    return e;
  }();
  t.CachingDependencyResolver = d;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/resources/dependencyResolverFiles", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/network", "vs/base/severity", "vs/base/collections", "vs/base/paths", "./remoteModels",
  "../service/references", "./dependencyResolver", "vs/platform/markers/markers"
], function(e, t, n, r, i, o, s, a, l, c, u) {
  function p(e, t) {
    var n = {
      resources: new Array,
      errors: {}
    };
    e.traverse(t.toExternal(), function(t) {
      var s = t.getName();

      var a = 0 === s.indexOf("error:");
      if (a) {
        e.removeNode(s);
        var l = JSON.parse(s.substr(6));
        if (1 === l.referenceType) {
          var c = o.lookupOrInsert(n.errors, l.path, []);
          c.push(u.createTextMarker(i.Severity.Error, 1, l.message, l.offset, l.length));
        }
      } else {
        n.resources.push(r.URL.fromValue(s));
      }
    });

    return n;
  }
  var h = function() {
    function e(e, t) {
      this._resourceService = e;

      this._requestService = t;
    }
    e.prototype.load = function(e, t) {
      var i = this;
      if (!(t instanceof l.TripleSlashReference)) {
        return n.Promise.wrapError("only triple slash references are supported");
      }
      var o = new r.URL(s.join(s.dirname(e), s.normalize(t.path)));

      var c = this._requestService.getPath("root", o);

      var u = new r.URL(this._requestService.getRequestUrl("root", c, !0));
      if (this._resourceService.contains(u)) {
        var p = this._resourceService.get(u);
        return n.Promise.as(new l.File(u.toExternal(), p.getValue()));
      }
      return this._requestService.makeRequest({
        url: u.toExternal()
      }).then(function(e) {
        var t = new l.File(u.toExternal(), e.responseText);

        var n = new a.RemoteModel(u, e.responseText);
        i._resourceService.contains(u) || i._resourceService.insert(u, n);

        return t;
      });
    };

    e.prototype.dispose = function() {};

    return e;
  }();

  var d = function(e) {
    function n(t, n, r) {
      e.call(this, n, r);

      this._markerService = t;

      this._loader = new h(this._resourceService, this._requestService);
    }
    __extends(n, e);

    n.prototype.dispose = function() {
      this._loader.dispose();
    };

    n.prototype._doFetchDependencies = function(e) {
      var r = this;

      var i = this._resourceService.get(e);

      var s = new l.File(i.getAssociatedResource().toExternal(), i.getValue());

      var a = this._requestService.getPath("root", i.getAssociatedResource());
      return l.buildDependencyGraph(this._loader, [s], n._Options).then(function(n) {
        var i = t.collectDependenciesAndErrors(n, e);
        r._markerService.createPublisher().changeMarkers(e, function(e) {
          o.lookup(i.errors, a, []).forEach(function(t) {
            return e.addMarker(t);
          });
        });

        return i.resources;
      });
    };

    n._Options = {
      nodeName: function(e) {
        return e;
      }
    };

    return n;
  }(c.AbstractDependencyResolver);
  t.FileBasedResolver = d;

  t.collectDependenciesAndErrors = p;
  var m = function() {
    function t(e, t, n, r) {
      this._baselibs = e;

      this._resourceService = t;

      this._requestService = n;

      this._delegate = r;
    }
    t.prototype.dispose = function() {
      this._delegate.dispose();
    };

    t.prototype.fetchDependencies = function() {
      var e = this;

      var t = new Array;

      var r = [t];
      return n.TPromise.join(this._baselibs.map(function(n) {
        return e._resolveBaseLibrary(n).then(function(n) {
          n && t.push(n);

          return e._delegate.fetchDependencies(n);
        }).then(function(e) {
          r.push(e);
        });
      })).then(function() {
        return o.combine(r);
      });
    };

    t.prototype._resolveBaseLibrary = function(r) {
      var i = this;
      return this._resourceService.contains(r) ? n.TPromise.as(r) : 0 === r.toExternal().indexOf(t.MODULE_PREFIX) ?
        new n.TPromise(function(t) {
          e([r.toExternal()], function(e) {
            var n = new a.DefaultLibModel(r, e);
            i._resourceService.insert(r, n);

            t(r);
          });
        }) : this._requestService.makeRequest({
          url: r.toExternal()
        }).then(function(e) {
          var t = new a.DefaultLibModel(r, e.responseText);
          i._resourceService.insert(r, t);

          return r;
        }, function() {
          console.warn("TS - " + r.toExternal() + " can not be loaded as base lib");

          return null;
        });
    };

    t.MODULE_PREFIX = "vs/text!";

    return t;
  }();
  t.BaselibDependencyResolver = m;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/resources/dependencyResolverGraph", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/strings", "vs/base/env", "vs/base/collections", "vs/base/network", "./remoteModels",
  "../service/references", "./dependencyResolverFiles", "./dependencyResolver"
], function(e, t, n, r, i, o, s, a, l, c, u) {
  var p;
  ! function(e) {
    function t(e) {
      for (var t, n, r = 0, i = {};;) {
        if (t = e.indexOf(":", r), n = e.indexOf("\n", t + 1), 0 > t || 0 > n) break;
        i[e.substring(r, t).trim()] = e.substring(t + 1, n).trim();

        r = n + 1;
      }
      return i;
    }

    function r(e, r) {
      function o(e) {
        if (p) {
          a("canceled");
          return void 0;
        }
        var n = e.indexOf("\r\n\r\n", c);
        if (-1 !== n) {
          var r = t(e.substring(c, n));

          var i = Number(r["Content-Length"]);
          if (!(n + 4 + i > e.length)) {
            u.push({
              header: r,
              body: e.substr(n + 4, i)
            });
            l(u[u.length - 1]);
            c = n + 4 + i;
            o(e);
          }
        }
      }
      var s;

      var a;

      var l;

      var c = 0;

      var u = [];

      var p = !1;

      var h = new n.Promise(function(e, t, n) {
        s = e;

        a = t;

        l = n;
      }, function() {
        p = !0;
      });
      e.makeRequest(r).then(function(e) {
        o(e.responseText);

        s(u);
      }, function(e) {
        a(e);
      }, function(e) {
        if (!i.browser.isIE10orEarlier) {
          if (3 === e.readyState) {
            o(e.responseText);
          }
        }
      }).done(null, function(e) {
        a(e);
      });

      return h;
    }
    e.parseHeader = t;

    e.fetchChunkedData = r;
  }(p || (p = {}));
  var h = function(e) {
    function t(t, n, i, o, s) {
      e.call(this, o, s);

      this._moduleType = t;

      this._basePath = n;

      this._markerService = i;

      this._moduleType = this._moduleType || r.empty;

      this._basePath = this._basePath || r.empty;
    }
    __extends(t, e);

    t.prototype._doFetchDependencies = function(e) {
      var t;

      var r = this;

      var i = this._requestUrl(e, "typeScriptDependencyGraph");
      return this._requestService.makeRequest({
        url: i
      }).then(function(t) {
        var n = r._parseGraph(JSON.parse(t.responseText));

        var i = c.collectDependenciesAndErrors(n, e);

        var s = r._requestService.getPath("root", e);
        r._markerService.createPublisher().changeMarkers(e, function(e) {
          o.lookup(i.errors, s, []).forEach(function(t) {
            return e.addMarker(t);
          });
        });

        return i.resources;
      }).then(function(e) {
        t = e;
        for (var i = [], o = 0; o < e.length; o++) {
          if (!r._resourceService.contains(e[o])) {
            i.push(r._requestService.getPath("root", e[o]));
          }
        }
        return 0 === i.length ? n.Promise.as(e) : p.fetchChunkedData(r._requestService, {
          type: "POST",
          url: r._requestService.getRequestUrl("typeScriptFiles"),
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(i)
        });
      }).then(function() {
        return t;
      }, function() {
        return t;
      }, function(e) {
        if ("undefined" == typeof e.header.IsError) {
          var t = e.header.Path;

          var n = s.URL.fromEncoded(r._requestService.getRequestUrl("root", t, !0));

          var i = new a.RemoteModel(n, e.body);
          if (!r._resourceService.contains(n)) {
            r._resourceService.insert(n, i);
          }
        }
      });
    };

    t.prototype._requestUrl = function(e, t) {
      var n = this._requestService.getPath("root", e);

      var i = [];
      i.push(this._requestService.getRequestUrl(t, n));

      i.push(r.format("?type={0}", encodeURIComponent(this._moduleType)));

      i.push(r.format("&baseurl={0}", encodeURIComponent(this._basePath)));

      return i.join(r.empty);
    };

    t.prototype._parseGraph = function(e) {
      for (var t = this._requestService.getRequestUrl("root", "", !0), n = Object.keys(e.i), r = 0; r < n.length; r++) {
        if (0 !== e.i[n[r]].indexOf("error:")) {
          e.i[n[r]] = t + e.i[n[r]].substring(1);
        }
      }
      return l.Graph.fromJSON(e);
    };

    return t;
  }(u.AbstractDependencyResolver);
  t.GraphBasedResolver = h;
});

define("vs/languages/typescript/typescript.configuration", ["require", "exports", "vs/base/objects", "vs/base/strings",
  "vs/base/severity"
], function(e, t, n, r, i) {
  function o(e, n) {
    return e instanceof a ? e : new a(e, n, t.defaultSuggestSettions);
  }

  function s(e, t) {
    e instanceof a && (e = e.raw);

    t instanceof a && (t = t.raw);

    return n.equals(e, t);
  }
  t.impilictAnyClassifier = function(e) {
    var t = /.*?(\d+):.*?/.exec(e.message());
    if (!t) {
      return i.Severity.Error;
    }
    var n = Number(t[1]);
    return isNaN(n) ? i.Severity.Error : n >= 7005 && 7015 >= n ? i.Severity.Warning : i.Severity.Error;
  };

  t.defaultLintSettings = {
    emptyBlocksWithoutComment: "ignore",
    curlyBracketsMustNotBeOmitted: "ignore",
    comparisonOperatorsNotStrict: "warning",
    missingSemicolon: "warning",
    unknownTypeOfResults: "warning",
    semicolonsInsteadOfBlocks: "warning",
    functionsInsideLoops: "warning",
    functionsWithoutReturnType: "warning",
    tripleSlashReferenceAlike: "warning",
    unusedImports: "warning",
    unusedVariables: "warning",
    unusedFunctions: "warning",
    unusedMembers: "warning"
  };

  t.defaultValidationSettings = {
    codeGenTarget: "ES5"
  };

  t._internalDefaultValidationSettings = {
    scope: "/",
    noImplicitAny: !1,
    noLib: !1,
    extraLibs: ["vs/text!vs/languages/typescript/lib/lib.d.ts"],
    semanticValidation: !0,
    syntaxValidation: !0,
    codeGenTarget: "ES5",
    moduleGenTarget: "",
    diagnosticClassifier: t.impilictAnyClassifier
  };

  t.defaultSuggestSettions = {
    alwaysAllWords: !1,
    useCodeSnippetsOnMethodSuggest: !1
  };
  var a = function() {
    function e(e, t, i) {
      if (this._raw = e, this._raw) {
        if (this._raw.validationSettings) {
          if (!Array.isArray(this._raw.validationSettings)) {
            this._raw.validationSettings = [this._raw.validationSettings];
          }
          var o = this._raw.validationSettings;
          if (0 === o.length) {
            this._raw.validationSettings = [t];
          } else {
            for (var s = !1, a = t, l = 0, c = o.length; c > l; l++) {
              var u = n.withDefaults(this._raw.validationSettings[l], a);
              u.scope = u.scope.replace(/\\/g, "/");

              s = s || "/" === u.scope;

              if (!r.startsWith(u.scope, "/")) {
                u.scope = "/" + u.scope;
              }

              if (-1 === u.extraLibs.indexOf("vs/text!vs/languages/typescript/lib/lib.d.ts")) {
                u.extraLibs.unshift("vs/text!vs/languages/typescript/lib/lib.d.ts");
              }

              this._raw.validationSettings[l] = u;

              a = u;
            }
            if (!s) {
              this._raw.validationSettings.unshift(t);
            }
          }
        } else {
          this._raw.validationSettings = [t];
        }
        this._raw.suggestSettings = this._raw.suggestSettings ? n.withDefaults(this._raw.suggestSettings, i) : i;
      } else {
        this._raw = {
          validationSettings: [t],
          suggestSettings: i
        };
      }
    }
    Object.defineProperty(e.prototype, "raw", {
      get: function() {
        return this._raw;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "validationSettings", {
      get: function() {
        return this._raw.validationSettings.slice(0);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "suggestSettings", {
      get: function() {
        return n.clone(this._raw.suggestSettings);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "allowMultipleWorkers", {
      get: function() {
        return this._raw.allowMultipleWorkers;
      },
      enumerable: !0,
      configurable: !0
    });

    return e;
  }();
  t.sanitize = o;

  t.equal = s;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/typescriptWorker2", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/objects",
  "vs/base/arrays", "vs/base/network", "vs/base/strings", "vs/base/uuid", "vs/base/errors", "vs/base/collections",
  "vs/base/eventEmitter", "vs/base/lifecycle", "vs/base/time/schedulers", "vs/editor/worker/modesWorker",
  "vs/editor/core/model/mirrorModel", "vs/languages/typescript/service/languageServiceAdapter",
  "vs/languages/typescript/service/languageServiceHost2", "vs/languages/typescript/lib/typescriptServices",
  "vs/languages/typescript/resources/dependencyResolverFiles",
  "vs/languages/typescript/resources/dependencyResolverGraph", "vs/languages/typescript/resources/dependencyResolver",
  "vs/languages/typescript/typescript.configuration"
], function(e, t, n, r, i, o, s, a, l, c, u, p, h, d, m, f, g, v, y, b, w, S) {
  var T;
  ! function(e) {
    e.StatusIdle = "status.idle";

    e.StatusLoading = "status.loading";

    e.StatusTypeScript = "status.typescript";

    e.StatusError = "status.error";
  }(T || (T = {}));
  var _ = function() {
    function e(e, t, n, r, i, o, s) {
      this._compilationSettings = e;

      this._suggestSettings = t;

      this._resourceService = n;

      this._requestService = r;

      this._markerService = i;

      this._telemetryService = o;

      this._eventBus = s;

      this._callOnDispose = [];

      this._runCounter = 0;
    }
    e.prototype.dispose = function() {
      p.disposeAll(this._callOnDispose);

      p.disposeAll([this._noDependencyResolver, this._fileDependencyResolver]);
    };

    Object.defineProperty(e.prototype, "scope", {
      get: function() {
        return this._compilationSettings.scope;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "weight", {
      get: function() {
        return this._host.getScriptFileNames().length;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.reset = function() {
      this._runCounter = 0;
    };

    e.prototype._init = function() {
      this._host = new g.LanguageServiceHost(this._resourceService);

      this._adapter = new f.LanguageServiceAdapter(this._compilationSettings, this._suggestSettings, this._host, new v
        .Services.LanguageService(this._host));

      p.disposeAll([this._noDependencyResolver, this._fileDependencyResolver]);

      this._noDependencyResolver = new w.NullDependencyResolver;

      this._fileDependencyResolver = new w.CompositeDependencyResolver([new y.BaselibDependencyResolver(this._compilationSettings
        .extraLibs.map(function(e) {
          return new o.URL(e);
        }), this._resourceService, this._requestService, this._createResolver()), this._createResolver()]);

      this._fileDependencyResolver = new w.CachingDependencyResolver(this._fileDependencyResolver, this._eventBus,
        this._resourceService);
    };

    e.prototype._createResolver = function() {
      var e;
      return e = this._requestService.getRequestUrl("typeScriptDependencyGraph") ? new b.GraphBasedResolver(this._compilationSettings
        .moduleGenTarget, this._compilationSettings.scope, this._markerService, this._resourceService, this._requestService
      ) : this._requestService.getRequestUrl("root") ? new y.FileBasedResolver(this._markerService, this._resourceService,
        this._requestService) : new w.NullDependencyResolver;
    };

    e.prototype.withFileDependencies = function(e, t, n) {
      "undefined" == typeof n && (n = null);

      0 === this._runCounter++ && this._init();

      return this._doRun(e, this._fileDependencyResolver, t, n);
    };

    e.prototype.withNoDependencies = function(e, t, n) {
      "undefined" == typeof n && (n = null);

      0 === this._runCounter++ && this._init();

      return this._doRun(e, this._noDependencyResolver, t, n);
    };

    e.prototype._doRun = function(e, t, r, i) {
      if ("undefined" == typeof i) {
        i = null;
      }
      var o;

      var s = this;

      var a = T.StatusIdle;
      return new n.Promise(function(n, l) {
        s._eventBus.emit(T.StatusLoading);

        t.fetchDependencies(e).then(function(t) {
          if (o) {
            l(o);
            return void 0;
          }
          if (e) {
            t = c.combine([t, c.singleton(e)]);
          }

          s._host.updateResources(t);
          var u = i;
          s._eventBus.emit(T.StatusTypeScript);
          try {
            u = r(s._adapter);
          } catch (p) {
            if (s._handleError(p)) {
              a = T.StatusError;
            }
          } finally {
            s._eventBus.emit(a);

            n(u);
          }
        }, function(e) {
          l(e);
        });
      }, function() {
        o = new Error("Canceled");
      });
    };

    e.prototype._handleError = function(e) {
      return l.isPromiseCanceledError(e) ? !1 : (this._telemetryService.log(
        "typescript.languageService.update.failure", {
          detail: l.toErrorMessage(e, !0)
        }), this.reset(), !0);
    };

    e.prototype.toString = function() {
      return s.format("langauge service for {0}", this._compilationSettings.scope);
    };

    return e;
  }();
  t.ScopedLanguageService = _;
  var k = function() {
    function e() {
      this._data = {};
    }
    e.prototype.dispose = function() {
      c.forEach(this._data, function(e, t) {
        p.disposeAll(e.value);

        t();
      });
    };

    e.prototype.add = function(e, t, n) {
      for (var r = c.lookupOrInsert(this._data, s.rtrim(e, "/"), []), i = 0, o = r.length; o > i; i++)
        if (r[i].scope === t) {
          return !1;
        }
      r.push(n);

      r.sort(function(e, t) {
        return t.scope.localeCompare(e.scope);
      });

      return !0;
    };

    e.prototype._findLanguageService = function(e) {
      var t;

      var n = e.toExternal();

      var r = s.empty;
      c.forEach(this._data, function(e) {
        if (s.startsWith(n, e.key) && e.key.length > r.length) {
          r = e.key;
        }
      });

      if (!r) {
        r = "inMemory://model";
      }
      var o = c.lookup(this._data, r);
      if (!o) throw new Error("unkown prefix (" + e + ") all =" + Object.keys(this._data));
      for (var a = n.substring(r.length), l = 0, u = o.length; u > l; l++)
        if (s.startsWith(a, o[l].scope)) {
          t = o[l];
          break;
        }
      t || (t = i.tail(o));

      return t;
    };

    e.prototype.withFileDependencies = function(e, t, n) {
      "undefined" == typeof n && (n = null);

      return this._findLanguageService(e).withFileDependencies(e, t, n);
    };

    e.prototype.withNoDependencies = function(e, t, n) {
      "undefined" == typeof n && (n = null);

      return this._findLanguageService(e).withNoDependencies(e, t, n);
    };

    e.prototype.getAllLangaugeServices = function(e) {
      return c.lookup(this._data, s.rtrim(e, "/"), []);
    };

    return e;
  }();

  var x = function(e) {
    function t() {
      var t = this;
      e.call(this);

      this.shouldEmitStatus = !1;

      this.validationQueue = [];

      this._callOnDispose = [];

      this._uuid = a.v4().asHex();

      this._eventBus = new u.EventEmitter;

      this._callOnDispose.push(this._eventBus.addListener(w.Events.OnReferencesChanged, function(e) {
        return t.validate(e.resource);
      }));

      this._callOnDispose.push(this._eventBus.addListener(T.StatusIdle, function() {
        return t.emitStatus(0);
      }));

      this._callOnDispose.push(this._eventBus.addListener(T.StatusLoading, function() {
        return t.emitStatus(3);
      }));

      this._callOnDispose.push(this._eventBus.addListener(T.StatusTypeScript, function() {
        return t.emitStatus(1);
      }));

      this._callOnDispose.push(this._eventBus.addListener(T.StatusError, function() {
        return t.emitStatus(2);
      }));
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      p.cAll(this._callOnDispose);
    };

    t.prototype.injectTelemetryService = function(e) {
      this._telemetryService = e;
    };

    t.prototype.injectRequestService = function(e) {
      this._requestService = e;
    };

    t.prototype.setExtraData = function(e) {
      this._extraData = r.withDefaults(e, t.defaultExtraData);
    };

    t.prototype.configure = function(e) {
      for (var t = S.sanitize(e, S._internalDefaultValidationSettings, S.defaultSuggestSettions), r = 0, o = t.validationSettings
          .length; o > r; r++) {
        if (!this._extraData.semanticValidation) {
          t.validationSettings[r].semanticValidation = !1;
        }
        if (!this._extraData.syntacticValidation) {
          t.validationSettings[r].syntaxValidation = !1;
        }
      }
      if (this._options && S.equal(this._options, t)) {
        return n.Promise.as(null);
      }
      p.combinedDispose(this._languageServices);

      this._languageServices = new k;

      this._options = t;
      for (var a = i.coalesce([this._requestService.getRequestUrl("root", s.empty, !0), "inMemory://model/"]), r = 0; r <
        a.length; r++)
        for (var l = 0; l < this._options.validationSettings.length; l++) {
          var c = new _(this._options.validationSettings[l], this._options.suggestSettings, this.resourceService,
            this._requestService, this.markerService, this._telemetryService, this._eventBus);
          this._languageServices.add(a[r], this._options.validationSettings[l].scope, c);
        }
      this._validateAll();

      return n.Promise.as(null);
    };

    t.prototype.setStatusReporting = function(e) {
      this.shouldEmitStatus = e;
    };

    t.prototype.emitStatus = function(e) {
      if (this.shouldEmitStatus) {
        this.publisher.sendMessage("ts.statusUpdate", {
          status: e
        });
      }
    };

    t.prototype.validate = function(e) {
      this._validateOne(e);

      this._extraData.validateAllFiles && this._validateAll(e);

      return n.Promise.as(null);
    };

    t.prototype._validateOne = function(e) {
      this._createValidateFunction(e)();
    };

    t.prototype._validateAll = function(e) {
      var t = this;
      if (!this.validationScheduler) {
        this.validationScheduler = new h.RunOnceScheduler(function() {
          if (0 === t.validationQueue.length) {
            t.validationScheduler.cancel();
            return void 0;
          }
          try {
            t.activeValidation = t.validationQueue.shift()();
          } catch (e) {
            console.error(e);
          }
          t.validationScheduler.schedule();
        }, 100);
      }

      if (this.activeValidation) {
        this.activeValidation.cancel();
      }
      for (var n = this.resourceService.all(), r = [], i = 0, o = n.length; o > i; i++) {
        if (n[i] instanceof m.MirrorModel) {
          if (!(e && e.equals(n[i].getAssociatedResource()))) {
            r.push(n[i]);
          }
        }
      }
      r.sort(function(e, t) {
        return t.getVersionId() - e.getVersionId();
      });

      this.validationQueue.length = 0;
      for (var i = 0, o = r.length; o > i; i++) {
        this._enqueValidateFunction(this._createValidateFunction(r[i].getAssociatedResource()));
      }
      this.validationScheduler.schedule();
    };

    t.prototype._enqueValidateFunction = function(e) {
      this.validationQueue.push(e);
    };

    t.prototype._createValidateFunction = function(e) {
      var t = this;
      return function() {
        if (!t.resourceService.contains(e)) {
          return null;
        }
        var r;

        var i;

        var o;

        var a = !1;

        var l = new Object;
        r = new n.Promise(function(e, t) {
          i = e;

          o = t;
        }, function() {
          a = !0;
        });
        var c = n.Promise.as(!1);
        t._extraData.syntacticValidation && (c = t._languageServices.withNoDependencies(e, function(n) {
          if (a) throw l;
          var r = n.getSyntacticDiagnostics(e);
          return t._publishMarkersForResource(e, s.format("{0}/syntax", t._uuid), r);
        }));

        c.then(function(n) {
          return t._languageServices.withFileDependencies(e, function(r) {
            if (a) throw l;
            var i = [];
            if (!n) {
              i.push.apply(i, r.getSemanticDiagnostics(e));
              i.push.apply(i, r.getExtraDiagnostics(e));
            }

            t._publishMarkersForResource(e, s.format("{0}/semantic", t._uuid), i);
          });
        }).then(function() {
          if (a) throw l;
          return t._languageServices.withNoDependencies(e, function(n) {
            t.markerService.createPublisher().batchChanges(function(r) {
              t.triggerValidateParticipation(e, r, n.languageService.getSyntaxTree(e.toExternal()));
            });
          });
        }).then(function() {
          i(null);
        }, function(e) {
          if (e === l) {
            i(null);
          } else {
            o(e);
          }
        });

        return r;
      };
    };

    t.prototype._publishMarkersForResource = function(e, t, n) {
      this.markerService.createPublisher().batchChanges(function(r) {
        r.changeMarkers(e, t, function(e) {
          n.forEach(function(t) {
            return e.addMarker(t);
          });
        });
      });

      return n.length > 0;
    };

    t.prototype.doSuggest = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.suggest(e, t);
      }, []);
    };

    t.prototype.getSuggestionDetails = function(e, t, n) {
      return this._languageServices.withFileDependencies(e, function(r) {
        return r.getSuggestionDetails(e, t, n);
      });
    };

    t.prototype.quickFix = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.quickFix(e, t);
      }, []);
    };

    t.prototype.getParameterHints = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.getParameterHints(e, t);
      });
    };

    t.prototype.getEmitOutput = function(e, t) {
      return this._languageServices.withNoDependencies(e, function(n) {
        return n.getEmitOutput(e, t);
      });
    };

    t.prototype.format = function(e, t, n) {
      return this._languageServices.withNoDependencies(e, function(r) {
        return r.format(e, t, n);
      }, null);
    };

    t.prototype.formatAfterKeystroke = function(e, t, n) {
      return this._languageServices.withNoDependencies(e, function(r) {
        return r.formatAfterKeystroke(e, t, n);
      }, null);
    };

    t.prototype.getActionsAtPosition = function(e, t) {
      return this._languageServices.withNoDependencies(e, function(n) {
        return n.getActionsAtPosition(e, t);
      }, []);
    };

    t.prototype.getOutline = function(e) {
      return this._languageServices.withNoDependencies(e, function(t) {
        return t.getOutline(e);
      }, []);
    };

    t.prototype.getNavigateToItems = function(e) {
      var t = this._languageServices.getAllLangaugeServices(this._requestService.getRequestUrl("root", s.empty, !0)).map(
        function(t) {
          return t.withNoDependencies(null, function(t) {
            return t.getNavigateToItems(e);
          }, []);
        });
      return n.TPromise.join(t).then(function(e) {
        return i.merge(e);
      });
    };

    t.prototype.findOccurrences = function(e, t, n) {
      return this._languageServices.withFileDependencies(e, function(r) {
        return r.findOccurrences(e, t, n);
      }, []);
    };

    t.prototype.findDeclaration = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.findDeclaration(e, t);
      });
    };

    t.prototype.findTypeDeclaration = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.findTypeDeclaration(e, t);
      });
    };

    t.prototype.findReferences = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.findReferences(e, t);
      }, []);
    };

    t.prototype.computeInfo = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.getTypeInformationAtPosition(e, t);
      });
    };

    t.prototype.getRangesToPosition = function(e, t) {
      return this._languageServices.withFileDependencies(e, function(n) {
        return n.getRangesToPosition(e, t);
      }, []);
    };

    t.prototype.computeLinks = function(t) {
      var r = e.prototype.computeLinks.call(this, t);

      var o = this._languageServices.withNoDependencies(t, function(e) {
        return e.findModuleReferences(t);
      }, []);
      return n.TPromise.join([r, o]).then(function(e) {
        return i.merge(e);
      });
    };

    t.prototype.textReplace = function(e, t) {
      var n = [
        ["true", "false"],
        ["string", "number", "boolean"],
        ["private", "public"]
      ];
      return this.valueSetsReplace(n, e, t);
    };

    t.defaultExtraData = {
      validateAllFiles: !1,
      syntacticValidation: !0,
      semanticValidation: !0
    };

    return t;
  }(d.AbstractWorkerMode);
  t.TypeScriptWorker2 = x;

  t.value = new x;
});