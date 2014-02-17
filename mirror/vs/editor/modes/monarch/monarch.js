define("vs/editor/modes/monarch/monarch", ["require", "exports", "vs/platform/platform", "vs/editor/modes/stream",
  "vs/editor/modes/modes", "vs/editor/modes/modesExtensions", "vs/editor/modes/monarch/monarchCommon",
  "vs/editor/modes/monarch/monarchCompile"
], function(e, t, n, i, o, r, s, a) {
  function u(e) {
    return !e || "" === e || /\bcomment\b/.test(e) || /\bwhite\b/.test(e);
  }

  function l(e, t) {
    if (!t) {
      return null;
    }
    t = s.fixCase(e, t);
    for (var n = e.brackets, i = 0; i < n.length; i++) {
      var o = n[i];
      if (o.open === t) {
        return {
          token: o.token,
          bracketType: 1
        };
      }
      if (o.close === t) {
        return {
          token: o.token,
          bracketType: -1
        };
      }
    }
    return null;
  }

  function c(e, t, n) {
    for (var i = [], o = [], r = 0; r < t.length; r++)
      if (!u(t[r].type)) {
        var s = "";
        s = r < t.length - 1 ? e.substr(t[r].startIndex, t[r + 1].startIndex - t[r].startIndex) : e.substr(t[r].startIndex);

        if (t[r].startIndex < n) {
          i.push(s);
        }

        {
          o.push(s);
        }
      }
    return {
      pre: " " + i.join(" ") + " ",
      post: " " + o.join(" ") + " "
    };
  }

  function d(e, t, n) {
    return n + 1 < t.length ? e.substr(t[n].startIndex, t[n + 1].startIndex - t[n].startIndex) : e.substr(t[n].startIndex);
  }

  function h(e, t, n, i) {
    var o;
    if (e.autoIndent) {
      var r = c(t, n, i);
      for (o = 0; o < e.autoIndent.length; o++)
        if (!e.autoIndent[o].match || e.autoIndent[o].match.test(r.pre)) {
          return !e.autoIndent[o].matchAfter || e.autoIndent[o].matchAfter.test(r.post) ? {
            indentAction: 2
          } : {
            indentAction: 1
          };
        }
    }
    var s = [];
    for (o = 0; o < n.length && n[o].startIndex < i; o++) {
      if (1 === n[o].bracket) {
        s.push(o);
      } {
        if (-1 === n[o].bracket && s.length > 0) {
          s.pop();
        }
      }
    }
    if (0 === s.length) {
      return null;
    }
    var a = s.pop();
    if (e.noindentBrackets) {
      var u = d(t, n, a);
      if (e.noindentBrackets.test(u)) {
        return null;
      }
    }
    return o < n.length && -1 === n[o].bracket && n[o].type === n[a].type ? {
      indentAction: 2
    } : {
      indentAction: 1
    };
  }

  function p(e, t, n, i) {
    var o = null;

    var r = null;
    if (e.autoComplete && e.autoComplete.length > 0) {
      var a = s.fixCase(e, t.substr(i, 1));

      var u = c(t, n, i + 1).pre;
      for (f = 0; f < e.autoComplete.length; f++)
        if (e.autoComplete[f].triggers.indexOf(a) >= 0) {
          var l = u.match(e.autoComplete[f].match);
          if (l) {
            o = l[0].replace(e.autoComplete[f].match, e.autoComplete[f].complete);
            break;
          }
        }
    }
    for (var h = 0, p = 0, f = 0; f < n.length && !(n[f].startIndex > i); f++) {
      h = n[f].startIndex;
      p = f;
    }
    if (!(-1 !== n[p].bracket || e.noindentBrackets && e.noindentBrackets.test(d(t, n, p)))) {
      var g = !0;
      for (f = 0; h > f; f++)
        if (" " !== t[f] && "	" !== t[f]) {
          g = !1;
          break;
        }
      if (g) {
        r = n[p].type;
      }
    }
    return o || r ? {
      matchBracketType: r,
      appendText: o
    } : null;
  }

  function f(e) {
    var t = a.compile(e);

    var n = new _(t);
    b[t.name] = {
      mode: n,
      mimeTypes: t.mimeTypes
    };

    return n;
  }

  function g(e) {
    var t = a.compile(e);

    var i = new _(t);
    if (b[t.name] = {
      mode: i,
      mimeTypes: t.mimeTypes
    }, n && n.Registry) {
      var o = n.Registry.as(r.Extensions.EditorModes);
      o.registerMode(t.mimeTypes, new n.DeferredDescriptor(s.monarchPath, "MonarchMode", [t]));
    }
    return i;
  }

  function m(e, t) {
    if (!e || void 0 === e.getMode) {
      return null;
    }
    var n = e.getMode(t);
    if (n) {
      return n;
    }
    if (e.getOrCreateMode) {
      var i = e.getOrCreateMode(t);
      return i && i.value ? i.value : null;
    }
  }

  function v(e) {
    if (n) {
      var t = m(n.Registry.as(r.Extensions.EditorModes), e);
      if (t) {
        return t;
      }
    }
    if (b[e]) {
      return b[e].mode;
    }
    var i;
    for (i in b)
      if (b.hasOwnProperty(i))
        for (var o = b[i], s = 0; s < o.mimeTypes.length; s++)
          if (o.mimeTypes[s] === e) {
            return o.mode;
          }
    return null;
  }
  var y = function(e) {
    function t(n, i, o, r) {
      e.call(this, n);

      this.id = t.ID++;

      this.lexer = i;

      this.stack = o ? o : [i.start];

      this.embeddedMode = r ? r : null;

      this.embeddedEntered = !1;

      this.groupActions = null;

      this.groupMatches = null;

      this.groupMatched = null;

      this.groupRule = null;
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.lexer, this.stack.slice(0), this.embeddedMode);
    };

    t.prototype.equals = function(n) {
      if (!e.prototype.equals.call(this, n)) {
        return !1;
      }
      if (!(n instanceof t)) {
        return !1;
      }
      var i = n;
      if (this.stack.length !== i.stack.length || this.lexer.name !== i.lexer.name || this.embeddedMode !== i.embeddedMode) {
        return !1;
      }
      var o;
      for (o in this.stack)
        if (this.stack.hasOwnProperty(o) && this.stack[o] !== i.stack[o]) {
          return !1;
        }
      return !0;
    };

    t.prototype.tokenize = function(e, t) {
      var n = this.stack.length;

      var i = 0;

      var o = this.stack[0];
      this.embeddedEntered = !1;
      var r = null;

      var a = null;

      var u = null;

      var c = null;

      var d = null;
      if (this.groupActions) {
        i = this.groupActions.length;
        r = this.groupMatches;
        a = this.groupMatched.shift();
        u = this.groupActions.shift();
        d = this.groupRule;
        if (0 === this.groupActions.length) {
          this.groupActions = null;
          this.groupMatches = null;
          this.groupMatched = null;
          this.groupRule = null;
        }
      } else {
        if (e.eos()) {
          return {
            type: ""
          };
        }
        var h = e.advanceToEOS();
        e.goBack(h.length);
        var p = this.lexer.tokenizer[o];
        if (p || (p = s.findRules(this.lexer, o)), p) {
          d = null;
          var f;

          var g = e.pos();
          for (f in p)
            if (p.hasOwnProperty(f) && (d = p[f], (0 === g || !d.matchOnlyAtLineStart) && (r = h.match(d.regex)))) {
              a = r[0];

              u = d.action;
              break;
            }
        } else {
          s.throwError(this.lexer, "tokenizer state is not defined: " + o);
        }
      }
      for (r || (r = [""], a = ""), u || (e.eos() || (r = [e.peek()], a = r[0]), u = this.lexer.defaultToken), e.advance(
        a.length); u.test;) {
        var m = u.test(a, r, o, e.eos());
        u = m;
      }
      var v = null;
      if ("string" == typeof u || u instanceof Array) {
        v = u;
      } else if (u.group) {
        v = u.group;
      } else if (null !== u.token && void 0 !== u.token) {
        if (v = u.token, u.tokenSubst && (v = s.substituteMatches(this.lexer, v, a, r, o)), u.nextEmbedded && ("@pop" ===
            u.nextEmbedded ? (this.embeddedMode || s.throwError(this.lexer,
              "cannot pop embedded mode if not inside one"), this.embeddedMode = null) : this.embeddedMode ? s.throwError(
              this.lexer, "cannot enter embedded mode from within an embedded mode") : (this.embeddedMode = s.substituteMatches(
              this.lexer, u.nextEmbedded, a, r, o), this.embeddedEntered = !0)), u.goBack && e.goBack(u.goBack), u.switchTo &&
          "string" == typeof u.switchTo) {
          var y = s.substituteMatches(this.lexer, u.switchTo, a, r, o);
          if ("@" === y[0]) {
            y = y.substr(1);
          }

          if (s.findRules(this.lexer, y)) {
            this.stack[0] = y;
          }

          {
            s.throwError(this.lexer, "trying to switch to a state '" + y + "' that is undefined in rule: " + d.name);
          }

          c = null;
        } else if (u.transform && "function" == typeof u.transform) {
          this.stack = u.transform(this.stack);
          c = null;
        } else if (u.next)
          if ("@push" === u.next) {
            if (this.stack.length >= this.lexer.maxStack) {
              s.throwError(this.lexer, "maximum tokenizer stack size reached: [" + this.stack[0] + "," + this.stack[1] +
                ",...," + this.stack[this.stack.length - 2] + "," + this.stack[this.stack.length - 1] + "]");
            } {
              this.stack.unshift(o);
            }
          } else if ("@pop" === u.next) {
          if (this.stack.length <= 1) {
            s.throwError(this.lexer, "trying to pop an empty stack in rule: " + d.name);
          } {
            this.stack.shift();
          }
        } else if ("@popall" === u.next) {
          if (this.stack.length > 1) {
            this.stack = [this.stack[this.stack.length - 1]];
          }
        } else {
          var y = s.substituteMatches(this.lexer, u.next, a, r, o);
          if ("@" === y[0]) {
            y = y.substr(1);
          }

          if (s.findRules(this.lexer, y)) {
            this.stack.unshift(y);
          }

          {
            s.throwError(this.lexer, "trying to set a next state '" + y + "' that is undefined in rule: " + d.name);
          }
        }
        if (u.log && "string" == typeof u.log) {
          s.log(this.lexer, this.lexer.displayName + ": " + s.substituteMatches(this.lexer, u.log, a, r, o));
        }
      }
      if (null === v && (s.throwError(this.lexer, "lexer rule has no well-defined action in rule: " + d.name), v =
        this.lexer.defaultToken), v instanceof Array) {
        if (this.groupActions && this.groupActions.length > 0) {
          s.throwError(this.lexer, "groups cannot be nested: " + d.name);
        }

        if (r.length !== v.length + 1) {
          s.throwError(this.lexer, "matched number of groups does not match the number of actions in rule: " + d.name);
        }
        for (var _ = 0, b = 1; b < r.length; b++) {
          _ += r[b].length;
        }
        _ !== a.length && s.throwError(this.lexer,
          "with groups, all characters should be matched in consecutive groups in rule: " + d.name);

        this.groupMatches = r;

        this.groupMatched = r.slice(1);

        this.groupActions = v.slice(0);

        this.groupRule = d;

        e.goBack(a.length);

        return this.tokenize(e);
      }
      if ("@rematch" === v && (e.goBack(a.length), a = "", r = null, v = ""), 0 === a.length)
        if (n !== this.stack.length || o !== this.stack[0] || (this.groupActions ? this.groupActions.length : 0) !==
          i) {
          if (!t) {
            return this.tokenize(e);
          }
        } else {
          s.throwError(this.lexer, "no progress in tokenizer in rule: " + d.name);
          e.advanceToEOS();
        }
      if (0 === v.indexOf("@brackets")) {
        var C = v.substr("@brackets".length);

        var w = l(this.lexer, a);
        w || (s.throwError(this.lexer, "@brackets token returned but no bracket defined as: " + a), w = {
          token: "",
          bracketType: 0
        });

        return {
          type: s.sanitize(w.token + C),
          bracket: w.bracketType
        };
      }
      var E = "" === v ? "" : v + this.lexer.tokenPostfix;
      return {
        type: s.sanitize(E),
        bracket: u.bracket
      };
    };

    t.ID = 0;

    return t;
  }(r.AbstractState);
  t.MonarchLexer = y;
  var _ = function(e) {
    function t(t) {
      if (!t.name && t.lexer) {
        t = t.lexer;
      }

      e.call(this, t.name, t.workerScriptPath ? t.workerScriptPath : s.monarchPath + "Worker", t.usesEmbedded);

      this.lexer = t;

      this.modesRegistry = n.Registry ? n.Registry.as(r.Extensions.EditorModes) : null;
    }
    __extends(t, e);

    t.prototype.getInitialState = function() {
      return new y(this, this._recompile());
    };

    t.prototype._recompile = function() {
      return this.lexer;
    };

    t.prototype.getNonWordTokenTypes = function() {
      return this.lexer.nonWordTokens;
    };

    t.prototype.getWordDefinition = function() {
      return this.lexer.wordDefinition || e.prototype.getWordDefinition.call(this);
    };

    t.prototype.getElectricCharacters = function() {
      return this.lexer.electricChars.split("");
    };

    t.prototype.getAutoClosingPairs = function() {
      return this.lexer.autoClosingPairs;
    };

    t.prototype.getCommentsConfiguration = function() {
      return {
        lineCommentTokens: [this.lexer.lineComment],
        blockCommentStartToken: this.lexer.blockCommentStart,
        blockCommentEndToken: this.lexer.blockCommentEnd
      };
    };

    t.prototype.onEnterImpl = function(e, t, n) {
      return h(this.lexer, e, t, n);
    };

    t.prototype.onElectricCharacterImpl = function(e, t, n) {
      return p(this.lexer, e, t, n);
    };

    t.prototype.enterNestedMode = function(e) {
      return e instanceof y ? e.embeddedEntered : !1;
    };

    t.prototype.getNestedMode = function(e) {
      if (e instanceof y) {
        var t = e.embeddedMode;

        var n = m(this.modesRegistry, t);
        if (n) {
          return n;
        }
      }
      return m(this.modesRegistry, "text/plain");
    };

    t.prototype.getLeavingNestedModeData = function(e, t) {
      for (var n = t, o = new i.LineStream(e); !o.eos() && n.embeddedMode;) {
        n.tokenize(o, !0);
      }
      if (n.embeddedMode) {
        return null;
      }
      var r = o.pos();
      return {
        nestedModeBuffer: e.substring(0, r),
        bufferAfterNestedMode: e.substring(r),
        stateAfterNestedMode: n
      };
    };

    return t;
  }(r.AbstractMode);
  t.MonarchMode = _;
  var b = {};
  t.createEditorMode = f;

  t.register = g;

  t.getLanguage = v;
});