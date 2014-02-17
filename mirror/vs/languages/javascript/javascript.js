"use strict";

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/vsxml/vsxml", ["require", "exports", "vs/base/objects", "vs/base/errors",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i, r) {
  var o = '<>"=/';

  var s = "	 ";

  var a = n.createKeywordMatcher(["summary", "reference", "returns", "param", "loc"]);

  var u = n.createKeywordMatcher(["type", "path", "name", "locid", "filename", "format", "optional"]);

  var l = n.createKeywordMatcher(o.split(""));

  var c = function(e) {
    function t(t, n, i) {
      e.call(this, t);

      this.state = n;

      this.parentState = i;
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
      var i = n;
      return null === this.state && null === i.state ? !0 : null === this.state || null === i.state ? !1 : null ===
        this.parentState && null === i.parentState ? !0 : null === this.parentState || null === i.parentState ? !1 :
        this.state.equals(i.state) && this.parentState.equals(i.parentState);
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
  }(r.AbstractState);
  t.EmbeddedState = c;
  var d = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, i);
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
  }(c);
  t.VSXMLEmbeddedState = d;
  var h = function(e) {
    function t(t, n, i, r) {
      if ("undefined" == typeof r) {
        r = "";
      }

      e.call(this, t);

      this.name = n;

      this.parent = i;

      this.whitespaceTokenType = r;
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
      throw i.notImplemented();
    };

    return t;
  }(r.AbstractState);
  t.VSXMLState = h;
  var p = function(e) {
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
  t.VSXMLString = p;
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

      var n = this.whitespaceTokenType;
      return ">" === t ? {
        type: "delimiter.vs",
        nextState: this.parent
      } : '"' === t ? {
        type: "attribute.value.vs",
        nextState: new p(this.getMode(), this)
      } : (a(t) ? n = "tag.vs" : u(t) ? n = "attribute.name.vs" : l(t) && (n = "delimiter.vs"), {
        type: n,
        nextState: this
      });
    };

    return t;
  }(h);
  t.VSXMLTag = f;
  var g = function(e) {
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
        nextState: new f(this.getMode(), this)
      } : {
        type: this.whitespaceTokenType,
        nextState: this
      };
    };

    return t;
  }(h);
  t.VSXMLExpression = g;
});

define("vs/languages/javascript/jsdoc", ["require", "exports", "vs/editor/modes/modes", "vs/base/strings",
  "vs/base/arrays"
], function(e, t, n, i, r) {
  function o(e, t, n) {
    var r = e[n];
    if ("*" !== r) {
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
    return o ? i.startsWith(a.type, "comment.doc") ? "/*" !== e.substring(o.startIndex, n) ? null : {
      appendText: "*/"
    } : null : null;
  }

  function s(e, t, n) {
    var o;

    var s;

    var a = r.findIndexInSegmentsArray(t, n);

    var u = t[a];
    return u ? i.startsWith(u.type, "comment.doc") ? (o = e.indexOf("/**"), s = e.indexOf("*/"), -1 === o && -1 === s ? {
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
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/javascript/javascript", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/editor/modes/autoIndentation/autoIndentation", "vs/base/objects", "vs/editor/modes/modesExtensions",
  "vs/languages/vsxml/vsxml", "./jsdoc", "vs/base/arrays"
], function(e, t, n, i, r, o, s, a, u) {
  var l = "+-*%&|^~!=<>/?;:.,";

  var c = "+-*/%&|^~!=<>(){}[]\"'\\/?;:.,";

  var d = "	 ";

  var h = new i.Brackets([{
    tokenType: "delimiter.bracket.js",
    open: "{",
    close: "}",
    isElectric: !0
  }, {
    tokenType: "delimiter.array.js",
    open: "[",
    close: "]",
    isElectric: !0
  }, {
    tokenType: "delimiter.parenthesis.js",
    open: "(",
    close: ")",
    isElectric: !0
  }]);

  var p = r.createKeywordMatcher(["abstract", "boolean", "byte", "catch", "char", "class", "const", "debugger",
    "default", "delete", "double", "enum", "extends", "false", "final", "finally", "float", "for", "function",
    "goto", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null",
    "package", "protected", "short", "static", "super", "synchronized", "this", "throws", "transient", "true",
    "try", "typeof", "var", "void", "volatile", "with"
  ]);

  var f = r.createKeywordMatcher(["if", "else", "switch", "case", "while", "do", "break", "continue", "throw",
    "return"
  ]);

  var g = r.createKeywordMatcher(["export", "public", "private"]);

  var m = function(e) {
    return l.indexOf(e) > -1;
  };

  var v = function(e) {
    function t(t, n, i) {
      e.call(this, t);

      this.name = n;

      this.parent = i;
    }
    __extends(t, e);

    t.prototype.equals = function(n) {
      if (!e.prototype.equals.call(this, n)) {
        return !1;
      }
      var i = n;
      return n instanceof t && this.getMode() === i.getMode() && this.name === i.name && (null === this.parent &&
        null === i.parent || null !== this.parent && this.parent.equals(i.parent));
    };

    t.prototype.tokenize = function(e) {
      e.setTokenRules(c, d);

      return e.skipWhitespace().length > 0 ? {
        type: ""
      } : this.stateTokenize(e);
    };

    t.prototype.stateTokenize = function() {
      throw new Error("To be implemented");
    };

    return t;
  }(o.AbstractState);
  t.JSState = v;
  var y = function(e) {
    function t(t, n, i, r) {
      e.call(this, t, "string", n);

      this.isAtBeginning = r;

      this.delimiter = i;
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null, this.delimiter, this.isAtBeginning);
    };

    t.prototype.equals = function(t) {
      return e.prototype.equals.call(this, t) && this.delimiter === t.delimiter;
    };

    t.prototype.tokenize = function(e) {
      var t = this.isAtBeginning ? 1 : 0;
      for (this.isAtBeginning = !1; !e.eos();) {
        var n = e.next();
        if ("\\" === n) {
          return 0 === t ? e.eos() ? {
            type: "string.escape.js"
          } : (e.next(), e.eos() ? {
            type: "string.escape.js",
            nextState: this.parent
          } : {
            type: "string.escape.js"
          }) : (e.goBack(1), {
            type: "string.js"
          });
        }
        if (n === this.delimiter) break;
        t += 1;
      }
      return {
        type: "string.js",
        nextState: this.parent
      };
    };

    return t;
  }(v);
  t.JSString = y;
  var _ = function(e) {
    function t(t, n, i, r) {
      e.call(this, t, "regexp", n);

      this.previous = i;

      this.previousTokenText = r;
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null, this.previous, this.previousTokenText);
    };

    t.prototype._regexCanFollowPrevious = function() {
      switch (this.previous) {
        case "":
          return !0;
        case "delimiter":
          return !0;
        case "bracket":
          return "({}[".indexOf(this.previousTokenText) >= 0;
        case "keyword":
          return ["new", "delete", "void", "typeof", "instanceof", "in", "do", "return", "case", "throw"].indexOf(
            this.previousTokenText) >= 0;
      }
      return !1;
    };

    t.prototype.tokenize = function(e) {
      if (this._regexCanFollowPrevious()) {
        for (var t, n = !1, i = !1, r = e.pos(); !e.eos();)
          if (t = e.next(), n) {
            n = !1;
          } else {
            if ("/" === t && !i) {
              return {
                type: "regexp.js",
                nextState: this.parent
              };
            }
            if ("[" === t) {
              i = !0;
            }

            {
              if ("]" === t) {
                i = !1;
              } {
                if ("\\" === t) {
                  n = !0;
                }
              }
            }
          }
        e.goBack(e.pos() - r);
      }
      return {
        type: "delimiter.js",
        nextState: this.parent
      };
    };

    return t;
  }(v);
  t.JSRegExp = _;
  var b = function(e) {
    function t(t, n, i) {
      e.call(this, t, "number", n);

      this.firstDigit = i;
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null, this.firstDigit);
    };

    t.prototype.tokenize = function(e) {
      var t = this.firstDigit;

      var n = 10;

      var i = !1;

      var r = !1;
      if ("0" === t && !e.eos()) {
        if (t = e.peek(), "x" === t.toLowerCase()) {
          n = 16;
        } else if ("." === t) {
          n = 10;
        } else {
          if (!o.isDigit(t, 8)) {
            return {
              type: "number.js",
              nextState: this.parent
            };
          }
          n = 8;
        }
        e.next();
      }
      for (; !e.eos();)
        if (t = e.peek(), o.isDigit(t, n)) {
          e.next();
        } else if (10 === n)
        if ("." !== t || r || i) {
          if ("e" !== t || r) break;
          r = !0;

          e.next();

          if (!(e.eos() || "-" !== e.peek())) {
            e.next();
          }
        } else {
          i = !0;
          e.next();
        } else {
          if (8 !== n || !o.isDigit(t, 10)) break;
          n = 10;

          e.next();
        }
      var s = "number";
      16 === n ? s += ".hex" : 8 === n && (s += ".octal");

      return {
        type: s + ".js",
        nextState: this.parent
      };
    };

    return t;
  }(v);
  t.JSNumber = b;
  var w = function(e) {
    function t(t, n, i) {
      e.call(this, t, "comment", n);

      this.tokenType = i;
    }
    __extends(t, e);

    t.prototype.equals = function(t) {
      return e.prototype.equals.call(this, t) && this.tokenType === t.tokenType;
    };

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null, this.tokenType);
    };

    t.prototype.tokenize = function(e) {
      for (; !e.eos();) {
        var t = e.next();
        if ("*" === t && !e.eos() && !e.peekWhitespace() && "/" === e.peek()) {
          e.next();
          return {
            type: this.tokenType,
            nextState: this.parent
          };
        }
      }
      return {
        type: this.tokenType
      };
    };

    return t;
  }(v);
  t.JSComment = w;
  var C = function(e) {
    function t(t, n, i, r) {
      e.call(this, t, "expression", n);

      this.previous = i;

      this.previousTokenText = r;
    }
    __extends(t, e);

    t.prototype.equals = function(n) {
      if (!e.prototype.equals.call(this, n)) {
        return !1;
      }
      var i = n;
      return n instanceof t && this.getMode() === i.getMode() && this.previous === i.previous && this.previousTokenText ===
        i.previousTokenText;
    };

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null, this.previous, this.previousTokenText);
    };

    t.prototype.stateTokenize = function(e) {
      if (o.isDigit(e.peek(), 10)) {
        this.previous = "number";
        return {
          nextState: new b(this.getMode(), this, e.next())
        };
      }
      var t = e.nextToken();
      if ("/" === t) {
        return e.advanceIfString("**/") ? {
          type: "comment.js"
        } : e.advanceIfString("**") ? {
          nextState: new w(this.getMode(), this, "comment.doc.js")
        } : e.advanceIfString("*") ? {
          nextState: new w(this.getMode(), this, "comment.js")
        } : e.advanceIfString("/") ? (e.advanceToEOS(), {
          type: "comment.js"
        }) : {
          nextState: new _(this.getMode(), this, this.previous, this.previousTokenText)
        };
      }
      if ('"' === t || "'" === t) {
        this.previous = "string";
        return {
          nextState: new y(this.getMode(), this, t, !0)
        };
      }
      if (h.characterIsBracket(t)) {
        var n = h.bracketTypeFromChar(t);
        this.previous = "bracket";

        this.previousTokenText = t;

        return {
          bracket: n,
          type: h.tokenTypeFromChar(t)
        };
      }
      return m(t) ? (this.previous = "delimiter", this.previousTokenText = t, {
        type: "delimiter.js"
      }) : ("delimiter" === this.previous && "," === this.previousTokenText || "bracket" === this.previous && "{" ===
        this.previousTokenText) && !e.eos() && ":" === e.peekToken() ? (this.previous = "key", {
        type: "key.js"
      }) : f(t) ? (this.previous = "keyword", this.previousTokenText = t, {
        type: "keyword.flow.js"
      }) : g(t) ? (this.previous = "keyword", this.previousTokenText = t, {
        type: "keyword.visibility.js"
      }) : p(t) ? (this.previous = "keyword", this.previousTokenText = t, {
        type: "keyword.js"
      }) : (this.previous = "identifier", {
        type: ""
      });
    };

    return t;
  }(v);
  t.JSStatement = C;
  var E = function() {
    function e(e) {
      this.mode = e;
    }
    e.prototype.findDeclaration = function(e, t) {
      return this.mode.request("findDeclaration", null, e, t);
    };

    e.prototype.findReferences = function(e, t) {
      return this.mode.request("findReferences", null, e, t);
    };

    e.prototype.getActionsAtPosition = function(e, t) {
      return this.mode.request("getActionsAtPosition", null, e, t);
    };

    e.prototype.computeInfo = function(e, t) {
      return this.mode.request("computeInfo", null, e, t);
    };

    e.prototype.getRangesToPosition = function(e, t) {
      return this.mode.request("getRangesToPosition", null, e, t);
    };

    e.prototype.getParameterHints = function(e, t) {
      return this.mode.request("getParameterHints", null, e, t);
    };

    e.prototype.getParameterHintsTriggerCharacters = function() {
      return ["(", ","];
    };

    e.prototype.shouldTriggerParameterHints = function(e, t, n) {
      if (0 === t.tokens.length) {
        return !1;
      }
      var i = u.findIndexInSegmentsArray(t.tokens, n - 1);

      var r = t.tokens[i].type;
      return "string.js" === r || "string.escape.js" === r ? !1 : !0;
    };

    e.prototype.format = function(e, t, n) {
      return this.mode.request("format", null, e, t, n);
    };

    return e;
  }();

  var S = function(e) {
    function t() {
      e.call(this, "vs.languages.javascript", "vs/languages/javascript/javascriptWorker");
      var t = new E(this);
      this.inEditorActionsSupport = t;

      this.declarationSupport = t;

      this.referenceSupport = t;

      this.extraInfoSupport = t;

      this.logicalSelectionSupport = t;

      this.parameterHintsSupport = t;

      this.formattingSupport = t;

      this.outlineSupport = this;
    }
    __extends(t, e);

    t.prototype.getInitialState = function() {
      return new C(this, null, "", "");
    };

    t.prototype.getNonWordTokenTypes = function() {
      return ["delimiter.js", "delimiter.parenthesis.js", "delimiter.bracket.js", "delimiter.array.js", "regexp.js"];
    };

    t.prototype.getElectricCharacters = function() {
      return ["*"].concat(h.getElectricBrackets());
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

    t.prototype.shouldAutoClosePairImpl = function(e, t, n, i) {
      var r = u.findIndexInSegmentsArray(n, i - 1);

      var o = n[r];
      return o ? o.type.indexOf("string") > -1 ? '"' !== e && "'" !== e : o.type.indexOf("comment") > -1 ? "'" !== e : !
        0 : !0;
    };

    t.prototype.onEnterImpl = function(e, t, n) {
      var i = a.onEnter(e, t, n);
      return i ? i : h.onEnter(e, t, n);
    };

    t.prototype.onElectricCharacterImpl = function(e, t, n) {
      return a.onElectricCharacter(e, t, n) || h.onElectricCharacter(e, t, n);
    };

    t.prototype.getCommentsConfiguration = function() {
      return {
        lineCommentTokens: ["//"],
        blockCommentStartToken: "/*",
        blockCommentEndToken: "*/"
      };
    };

    t.prototype.configure = function(t) {
      var i = this;
      return e.prototype.configure.call(this, t).then(function() {
        var e = [];

        var t = i._models();
        Object.keys(t).forEach(function(n) {
          var r = t[n];
          e.push(i.validate(r.getAssociatedResource()));
        });

        return n.Promise.join(e);
      });
    };

    t.prototype.getTriggerCharacters = function() {
      return ["."];
    };

    t.prototype.shouldAutotriggerSuggestImpl = function(e, t, n) {
      if (0 === t.length) {
        return !1;
      }
      var i = u.findIndexInSegmentsArray(t, n - 1);

      var r = t[i].type;
      return r.indexOf("string") >= 0 || r.indexOf("comment") >= 0 || r.indexOf("number") >= 0 ? !1 : !0;
    };

    t.prototype.getOutline = function(e) {
      return this.request("getOutline", null, e);
    };

    t.prototype.getWordDefinition = function() {
      return /(-?\d*\.\d\w*)|([\w$]+)/g;
    };

    t.prototype.getSuggestionDetails = function(e, t, n) {
      return this.request("getSuggestionDetails", null, e, t, n);
    };

    return t;
  }(o.AbstractMode);
  t.JSMode = S;
  var x = function(e) {
    function t(t, n, i, r, o) {
      e.call(this, t, i, r, o);

      this.vsState = n;
    }
    __extends(t, e);

    t.prototype.setVSXMLState = function(e) {
      this.vsState = e;
    };

    t.prototype.makeClone = function() {
      return new t(this.getMode(), null !== this.vsState ? this.vsState.clone() : null, this.parent ? this.parent.clone() :
        null, this.previous, this.previousTokenText);
    };

    t.prototype.equals = function(n) {
      return e.prototype.equals.call(this, n) && n instanceof t && (null === this.vsState && null === n.vsState ||
        null !== this.vsState && this.vsState.equals(n.vsState));
    };

    t.prototype.stateTokenize = function(t) {
      return t.advanceIfString("///").length > 0 ? t.eos() ? {
        type: "comment.vs"
      } : "/" === t.peek() ? (t.advanceToEOS(), {
        type: "comment.js"
      }) : {
        type: "comment.vs",
        nextState: new s.VSXMLEmbeddedState(this.getMode(), this.vsState, this)
      } : e.prototype.stateTokenize.call(this, t);
    };

    return t;
  }(C);
  t.JSVSStatement = x;
  var T = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.getInitialState = function() {
      return new x(this, new s.VSXMLExpression(this, null), null, "", "");
    };

    return t;
  }(S);
  t.JSVSMode = T;
});