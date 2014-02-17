"use strict";

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

define("vs/languages/vsxml/vsxml", ["require", "exports", "vs/base/objects", "vs/base/errors",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, r, i) {
  var o = '<>"=/';

  var s = "	 ";

  var a = n.createKeywordMatcher(["summary", "reference", "returns", "param", "loc"]);

  var l = n.createKeywordMatcher(["type", "path", "name", "locid", "filename", "format", "optional"]);

  var c = n.createKeywordMatcher(o.split(""));

  var u = function(e) {
    function t(t, n, r) {
      e.call(this, t);

      this.state = n;

      this.parentState = r;
    }
    __extends(t, e);

    t.prototype.getParentState = function() {
      return this.parentState;
    };

    t.prototype.makeClone = function() {
      return new t(this.getMode(), null === this.state ? null : this.state.clone(), null === this.parentState ? null :
        this.parentState.clone());
    };

    t.prototype.equals = function(n) {
      if (!e.prototype.equals.call(this, n)) {
        return !1;
      }
      if (!(n instanceof t)) {
        return !1;
      }
      var r = n;
      return null === this.state && null === r.state ? !0 : null === this.state || null === r.state ? !1 : null ===
        this.parentState && null === r.parentState ? !0 : null === this.parentState || null === r.parentState ? !1 :
        this.state.equals(r.state) && this.parentState.equals(r.parentState);
    };

    t.prototype.setState = function(e) {
      this.state = e;
    };

    t.prototype.postTokenize = function(e) {
      return e;
    };

    t.prototype.tokenize = function(e) {
      var t = this.state.tokenize(e);
      void 0 !== t.nextState && this.setState(t.nextState);

      t.nextState = this;

      return this.postTokenize(t, e);
    };

    return t;
  }(i.AbstractState);
  t.EmbeddedState = u;
  var p = function(e) {
    function t(t, n, r) {
      e.call(this, t, n, r);
    }
    __extends(t, e);

    t.prototype.setState = function(t) {
      e.prototype.setState.call(this, t);

      this.getParentState().setVSXMLState(t);
    };

    t.prototype.postTokenize = function(e, t) {
      t.eos() && (e.nextState = this.getParentState());

      return e;
    };

    return t;
  }(u);
  t.VSXMLEmbeddedState = p;
  var h = function(e) {
    function t(t, n, r, i) {
      if ("undefined" == typeof i) {
        i = "";
      }

      e.call(this, t);

      this.name = n;

      this.parent = r;

      this.whitespaceTokenType = i;
    }
    __extends(t, e);

    t.prototype.equals = function(n) {
      return e.prototype.equals.call(this, n) ? n instanceof t && this.getMode() === n.getMode() && this.name === n.name &&
        (null === this.parent && null === n.parent || null !== this.parent && this.parent.equals(n.parent)) : !1;
    };

    t.prototype.tokenize = function(e) {
      e.setTokenRules(o, s);

      return e.skipWhitespace().length > 0 ? {
        type: this.whitespaceTokenType
      } : this.stateTokenize(e);
    };

    t.prototype.stateTokenize = function() {
      throw r.notImplemented();
    };

    return t;
  }(i.AbstractState);
  t.VSXMLState = h;
  var d = function(e) {
    function t(t, n) {
      e.call(this, t, "string", n, "attribute.value.vs");
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    };

    t.prototype.stateTokenize = function(e) {
      for (; !e.eos();) {
        var t = e.nextToken();
        if ('"' === t) {
          return {
            type: "attribute.value.vs",
            nextState: this.parent
          };
        }
      }
      return {
        type: "attribute.value.vs",
        nextState: this.parent
      };
    };

    return t;
  }(h);
  t.VSXMLString = d;
  var m = function(e) {
    function t(t, n) {
      e.call(this, t, "expression", n, "vs");
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    };

    t.prototype.stateTokenize = function(e) {
      var t = e.nextToken();

      var n = this.whitespaceTokenType;
      return ">" === t ? {
        type: "delimiter.vs",
        nextState: this.parent
      } : '"' === t ? {
        type: "attribute.value.vs",
        nextState: new d(this.getMode(), this)
      } : (a(t) ? n = "tag.vs" : l(t) ? n = "attribute.name.vs" : c(t) && (n = "delimiter.vs"), {
        type: n,
        nextState: this
      });
    };

    return t;
  }(h);
  t.VSXMLTag = m;
  var f = function(e) {
    function t(t, n) {
      e.call(this, t, "expression", n, "vs");
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    };

    t.prototype.stateTokenize = function(e) {
      var t = e.nextToken();
      return "<" === t ? {
        type: "delimiter.vs",
        nextState: new m(this.getMode(), this)
      } : {
        type: this.whitespaceTokenType,
        nextState: this
      };
    };

    return t;
  }(h);
  t.VSXMLExpression = f;
});

define("vs/languages/javascript/jsdoc", ["require", "exports", "vs/editor/modes/modes", "vs/base/strings",
  "vs/base/arrays"
], function(e, t, n, r, i) {
  function o(e, t, n) {
    var i = e[n];
    if ("*" !== i) {
      return null;
    }
    if (e.indexOf("*/", n) > -1) {
      return null;
    }
    for (var o = null, s = 0; s < t.length; s++) {
      var a = t[s];
      if (a.startIndex > n) break;
      o = a;
    }
    return o ? r.startsWith(a.type, "comment.doc") ? "/*" !== e.substring(o.startIndex, n) ? null : {
      appendText: "*/"
    } : null : null;
  }

  function s(e, t, n) {
    var o;

    var s;

    var a = i.findIndexInSegmentsArray(t, n);

    var l = t[a];
    return l ? r.startsWith(l.type, "comment.doc") ? (o = e.indexOf("/**"), s = e.indexOf("*/"), -1 === o && -1 === s ? {
      indentAction: 0,
      appendText: "* "
    } : -1 !== o && n >= o + 3 && -1 !== s && s >= n ? {
      indentAction: 2,
      appendText: " * ",
      indentOutdentAppendText: " "
    } : -1 !== o && n >= o + 3 ? {
      indentAction: 0,
      appendText: " * "
    } : null) : null : null;
  }
  t.onElectricCharacter = o;

  t.onEnter = s;
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

define("vs/languages/typescript/typescript", ["require", "exports", "vs/editor/modes/autoIndentation/autoIndentation",
  "vs/editor/modes/modes", "vs/editor/modes/modesExtensions", "vs/languages/vsxml/vsxml",
  "vs/languages/javascript/jsdoc", "./lib/typescriptServices", "vs/base/objects", "vs/base/env", "vs/base/arrays"
], function(e, t, n, r, i, o, s, a, l, c, u) {
  var p = new n.Brackets([{
    tokenType: "delimiter.bracket.ts",
    open: "{",
    close: "}",
    isElectric: !0
  }, {
    tokenType: "delimiter.array.ts",
    open: "[",
    close: "]",
    isElectric: !0
  }, {
    tokenType: "delimiter.parenthesis.ts",
    open: "(",
    close: ")",
    isElectric: !0
  }]);
  ! function(e) {
    ! function(e) {
      e[e.Start = 0] = "Start";

      e[e.InMultiLineCommentTrivia = 1] = "InMultiLineCommentTrivia";

      e[e.InDocMultiLineCommentTrivia = 2] = "InDocMultiLineCommentTrivia";

      e[e.InSingleQuoteStringLiteral = 3] = "InSingleQuoteStringLiteral";

      e[e.InDoubleQuoteStringLiteral = 4] = "InDoubleQuoteStringLiteral";
    }(e.EndOfLineState || (e.EndOfLineState = {}));
    var t = (e.EndOfLineState, []);
    t[a.SyntaxKind.IdentifierName] = !0;

    t[a.SyntaxKind.StringLiteral] = !0;

    t[a.SyntaxKind.NumericLiteral] = !0;

    t[a.SyntaxKind.RegularExpressionLiteral] = !0;

    t[a.SyntaxKind.ThisKeyword] = !0;

    t[a.SyntaxKind.PlusPlusToken] = !0;

    t[a.SyntaxKind.MinusMinusToken] = !0;

    t[a.SyntaxKind.CloseParenToken] = !0;

    t[a.SyntaxKind.CloseBracketToken] = !0;

    t[a.SyntaxKind.CloseBraceToken] = !0;

    t[a.SyntaxKind.TrueKeyword] = !0;

    t[a.SyntaxKind.FalseKeyword] = !0;
    var n = function() {
      function e() {
        this.characterWindow = a.ArrayUtilities.createArray(2048, 0);

        this.diagnostics = [];
      }
      e.prototype.getClassificationsForLine = function(e, n) {
        var i = 0;
        if (0 !== n) {
          4 === n ? e = '"\\\n' + e : 3 === n ? e = "'\\\n" + e : 1 === n ? e = "/*\n" + e : 2 === n && (e = "/**\n" +
            e);
          i = 3;
        }
        var o = new r;
        this.scanner = new a.Scanner("", a.SimpleText.fromString(e), 1, this.characterWindow);
        for (var s = a.SyntaxKind.None; this.scanner.absoluteIndex() < e.length;) {
          this.diagnostics.length = 0;
          var l = this.scanner.scan(this.diagnostics, !t[s]);
          s = l.tokenKind;

          this.processToken(e, i, l, o);
        }
        return o;
      };

      e.prototype.processToken = function(e, t, n, r) {
        if (this.processTriviaList(e, t, n.leadingTrivia(), r), this.addResult(e, t, r, n.width(), n.tokenKind, n.valueText()),
          this.processTriviaList(e, t, n.trailingTrivia(), r), this.scanner.absoluteIndex() >= e.length) {
          if (this.diagnostics.length > 0 && this.diagnostics[this.diagnostics.length - 1].diagnosticKey() === a.DiagnosticCode
            .AsteriskSlash_expected) {
            r.finalLexState = -1 !== e.indexOf("/**") ? 2 : 1;
            return void 0;
          }
          if (n.tokenKind === a.SyntaxKind.StringLiteral) {
            var i = n.text();
            if (i.length > 0 && 92 === i.charCodeAt(i.length - 1)) {
              var o = i.charCodeAt(0);
              r.finalLexState = 34 === o ? 4 : 3;

              return void 0;
            }
          }
        }
      };

      e.prototype.processTriviaList = function(e, t, n, r) {
        for (var i = 0, o = n.count(); o > i; i++) {
          var s = n.syntaxTriviaAt(i);
          this.addResult(e, t, r, s.fullWidth(), s.kind(), s.fullText());
        }
      };

      e.prototype.addResult = function(e, t, n, r, o, s) {
        if (r > 0) {
          if (0 === n.entries.length) {
            r -= t;
          }
          n.entries.push(new i(r, o, s));
        }
      };

      return e;
    }();
    e.Classifier = n;
    var r = function() {
      function e() {
        this.finalLexState = 0;

        this.entries = [];
      }
      return e;
    }();
    e.ClassificationResult = r;
    var i = function() {
      function e(e, t, n) {
        switch (this.length = e, this.type = "", this.bracket = 0, t) {
          case a.SyntaxKind.IfKeyword:
          case a.SyntaxKind.ElseKeyword:
          case a.SyntaxKind.CaseKeyword:
          case a.SyntaxKind.WhileKeyword:
          case a.SyntaxKind.DoKeyword:
          case a.SyntaxKind.BreakKeyword:
          case a.SyntaxKind.ContinueKeyword:
          case a.SyntaxKind.ReturnKeyword:
          case a.SyntaxKind.ThrowKeyword:
            this.type = "keyword.flow.ts";
            break;
          case a.SyntaxKind.ExportKeyword:
          case a.SyntaxKind.PublicKeyword:
          case a.SyntaxKind.PrivateKeyword:
            this.type = "keyword.visibility.ts";
            break;
          case a.SyntaxKind.VarKeyword:
          case a.SyntaxKind.ClassKeyword:
          case a.SyntaxKind.InterfaceKeyword:
          case a.SyntaxKind.EnumKeyword:
          case a.SyntaxKind.FunctionKeyword:
          case a.SyntaxKind.ModuleKeyword:
          case a.SyntaxKind.StaticKeyword:
          case a.SyntaxKind.ImportKeyword:
            this.type = "keyword.declare.ts";
            break;
          case a.SyntaxKind.BooleanKeyword:
          case a.SyntaxKind.NumberKeyword:
          case a.SyntaxKind.StringKeyword:
          case a.SyntaxKind.AnyKeyword:
            this.type = "keyword.datatype.ts";
            break;
          case a.SyntaxKind.NullKeyword:
            this.type = "keyword.null.ts";
            break;
          case a.SyntaxKind.MultiLineCommentTrivia:
            this.type = n.length >= 3 && "*" === n.charAt(2) ? "comment.doc.ts" : "comment.block.ts";
            break;
          case a.SyntaxKind.SingleLineCommentTrivia:
            this.type = "comment.line.ts";
            break;
          case a.SyntaxKind.StringLiteral:
            this.type = "string.ts";
            break;
          case a.SyntaxKind.NumericLiteral:
            this.type = "number.ts";
            break;
          case a.SyntaxKind.RegularExpressionLiteral:
            this.type = "regexp.ts";
            break;
          default:
            p.characterIsBracket(n) ? (this.bracket = p.bracketTypeFromChar(n), this.type = p.tokenTypeFromChar(n)) :
              a.SyntaxFacts.isAnyKeyword(t) ? this.type = "keyword.ts" : a.SyntaxFacts.isAnyPunctuation(t) && (this.type =
                "delimiter.ts");
        }
      }
      return e;
    }();
    e.ClassificationInfo = i;
  }(t.TypeScriptClassifier || (t.TypeScriptClassifier = {}));
  var h = t.TypeScriptClassifier;

  var d = function(e) {
    function t(t, n, r, i) {
      e.call(this, t);

      this.lineTokens = n;

      this.vsState = r;

      this.classifier = new h.Classifier;

      this.endOfLineState = i;
    }
    __extends(t, e);

    t.prototype.setVSXMLState = function(e) {
      this.vsState = e;
    };

    t.prototype.makeClone = function() {
      return new t(this.getMode(), l.clone(this.lineTokens), this.vsState.clone(), this.endOfLineState);
    };

    t.prototype.equals = function(n) {
      return e.prototype.equals.call(this, n) && n instanceof t && this.getMode() === n.getMode() && this.endOfLineState ===
        n.endOfLineState && l.equals(this.lineTokens, n.lineTokens) && this.vsState.equals(n.vsState);
    };

    t.prototype.tokenize = function(e) {
      if (0 === this.lineTokens.length) {
        if (e.advanceIfRegExp(/^\s*\/\/\//).length > 0) {
          return e.eos() ? {
            type: "comment.vs"
          } : "/" === e.peek() ? (e.advanceToEOS(), {
            type: "comment.ts"
          }) : {
            type: "comment.vs",
            nextState: new o.VSXMLEmbeddedState(this.getMode(), this.vsState, this)
          };
        }
        var t = e.advanceToEOS();
        e.goBack(t.length);
        var n = this.classifier.getClassificationsForLine(t, this.endOfLineState);
        this.endOfLineState = n.finalLexState;

        this.lineTokens = n.entries;
      }
      if (this.lineTokens.length > 0) {
        var r = this.lineTokens.shift();
        e.advance(r.length);

        return r;
      }
      e.advanceToEOS();

      return {
        type: ""
      };
    };

    return t;
  }(i.AbstractState);
  t.TypeScriptState = d;
  var m = function() {
    function e(e) {
      this._mode = e;
    }
    e.prototype.findReferences = function(e, t) {
      return this._mode.request("findReferences", this._mode.bigWorker, e, t);
    };

    e.prototype.getNavigateToItems = function(e) {
      return this._mode.request("getNavigateToItems", this._mode.bigWorker, e);
    };

    e.prototype.quickFix = function(e, t) {
      return this._mode.request("quickFix", this._mode.smallWorker, e, t);
    };

    e.prototype.getRangesToPosition = function(e, t) {
      return this._mode.request("getRangesToPosition", this._mode.smallWorker, e, t);
    };

    e.prototype.findDeclaration = function(e, t) {
      return this._mode.request("findDeclaration", this._mode.smallWorker, e, t);
    };

    e.prototype.findTypeDeclaration = function(e, t) {
      return this._mode.request("findTypeDeclaration", this._mode.smallWorker, e, t);
    };

    e.prototype.computeInfo = function(e, t) {
      return this._mode.request("computeInfo", this._mode.smallWorker, e, t);
    };

    e.prototype.getActionsAtPosition = function(e, t) {
      return this._mode.getActionsAtPosition(e, t, this._mode.smallWorker);
    };

    e.prototype.getAutoFormatTriggerCharacters = function() {
      return [";"];
    };

    e.prototype.format = function(e, t, n) {
      return this._mode.request("format", this._mode.smallWorker, e, t, n);
    };

    e.prototype.formatAfterKeystroke = function(e, t, n) {
      return this._mode.request("formatAfterKeystroke", this._mode.smallWorker, e, t, n);
    };

    return e;
  }();

  var f = function(e) {
    function t() {
      e.call(this, "vs.languages.typescript", "vs/languages/typescript/typescriptWorker2");
      var t = new m(this);
      this.referenceSupport = t;

      this.navigateTypesSupport = t;

      this.extraInfoSupport = t;

      this.formattingSupport = t;

      this.declarationSupport = t;

      this.quickFixSupport = t;

      this.logicalSelectionSupport = t;

      this.parameterHintsSupport = this;

      this.outlineSupport = this;
    }
    __extends(t, e);

    t.prototype._newCustomWorker = function(t) {
      "undefined" == typeof t && (t = {});

      c.browser.hasWorkers && this._options && this._options.allowMultipleWorkers ? (this.smallWorker = e.prototype._newCustomWorker
        .call(this, {
          syntacticValidation: !0,
          semanticValidation: !1,
          validateAllFiles: !1
        }, "ts-1"), this.bigWorker = e.prototype._newCustomWorker.call(this, {
          syntacticValidation: !1,
          semanticValidation: !0,
          validateAllFiles: !0
        }, "ts-2")) : (this.bigWorker = e.prototype._newCustomWorker.call(this, {
        syntacticValidation: !0,
        semanticValidation: !0,
        validateAllFiles: !0
      }, "ts-1"), this.smallWorker = this.bigWorker);

      return this.smallWorker;
    };

    t.prototype.getInitialState = function() {
      return new d(this, [], new o.VSXMLExpression(this, null), 0);
    };

    t.prototype.getNonWordTokenTypes = function() {
      return ["delimiter.ts", "delimiter.parenthesis.ts", "delimiter.bracket.ts", "delimiter.array.ts"];
    };

    t.prototype.getElectricCharacters = function() {
      return ["*"].concat(p.getElectricBrackets());
    };

    t.prototype.getAutoClosingPairs = function() {
      return [{
        open: "{",
        close: "}"
      }, {
        open: "[",
        close: "]"
      }, {
        open: "(",
        close: ")"
      }, {
        open: '"',
        close: '"'
      }, {
        open: "'",
        close: "'"
      }];
    };

    t.prototype.shouldAutoClosePairImpl = function(e, t, n, r) {
      var i = u.findIndexInSegmentsArray(n, r - 1);

      var o = n[i];
      return o ? o.type.indexOf("string") > -1 ? '"' !== e && "'" !== e : o.type.indexOf("comment") > -1 ? "'" !== e : !
        0 : !0;
    };

    t.prototype.onEnterImpl = function(e, t, n) {
      var r = s.onEnter(e, t, n);
      return r ? r : p.onEnter(e, t, n);
    };

    t.prototype.onElectricCharacterImpl = function(e, t, n) {
      return s.onElectricCharacter(e, t, n) || p.onElectricCharacter(e, t, n);
    };

    t.prototype.getCommentsConfiguration = function() {
      return {
        lineCommentTokens: ["//"],
        blockCommentStartToken: "/*",
        blockCommentEndToken: "*/"
      };
    };

    t.prototype.getTriggerCharacters = function() {
      return ["."];
    };

    t.prototype.shouldAutotriggerSuggestImpl = function(e, t, n) {
      if (0 === t.length) {
        return !1;
      }
      var r = u.findIndexInSegmentsArray(t, n - 1);

      var i = t[r].type;
      return i.indexOf("string") >= 0 || i.indexOf("comment") >= 0 || i.indexOf("number") >= 0 ? !1 : !0;
    };

    t.prototype.findOccurrences = function(t, n, r) {
      "undefined" == typeof r && (r = !1);

      return e.prototype.findOccurrences.call(this, t, n, r, this.smallWorker);
    };

    t.prototype.getOutline = function(e) {
      return this.request("getOutline", this.smallWorker, e);
    };

    t.prototype.suggest = function(t, n) {
      return e.prototype.suggest.call(this, t, n, this.smallWorker);
    };

    t.prototype.getSuggestionDetails = function(e, t, n) {
      return this.request("getSuggestionDetails", this.smallWorker, e, t, n);
    };

    t.prototype.getParameterHints = function(e, t) {
      return this.request("getParameterHints", this.smallWorker, e, t);
    };

    t.prototype.getParameterHintsTriggerCharacters = function() {
      return ["(", ","];
    };

    t.prototype.computeLinks = function(t) {
      return e.prototype.computeLinks.call(this, t, this.smallWorker);
    };

    t.prototype.shouldTriggerParameterHints = function(e, t, n) {
      if (0 === t.tokens.length) {
        return !1;
      }
      var r = u.findIndexInSegmentsArray(t.tokens, n - 1);

      var i = t.tokens[r].type;
      return "string.ts" === i ? !1 : !0;
    };

    t.prototype.getEmitOutput = function(e, t) {
      return this.request("getEmitOutput", this.smallWorker, e, t);
    };

    t.prototype.navigateValueSet = function(t, n, r) {
      return e.prototype.navigateValueSet.call(this, t, n, r, this.smallWorker);
    };

    t.prototype.getWordDefinition = function() {
      return /(-?\d*\.\d\w*)|([\w$]+)/g;
    };

    return t;
  }(i.AbstractMode);
  t.TypeScriptMode = f;
});