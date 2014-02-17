define("vs/editor/modes/monarch/monarchCompile", ["require", "exports", "vs/base/objects", "vs/editor/modes/modes",
  "vs/editor/modes/monarch/monarchCommon"
], function(e, t, n, i, o) {
  function r(e, t) {
    if (!t) {
      return !1;
    }
    if (!(t instanceof Array)) {
      return !1;
    }
    var n;
    for (n in t)
      if (t.hasOwnProperty(n) && !e(t[n])) {
        return !1;
      }
    return !0;
  }

  function s(e, t, n) {
    return "boolean" == typeof e ? e : (n && (e || void 0 === t) && n(), void 0 === t ? null : t);
  }

  function a(e, t, n) {
    return "string" == typeof e ? e : (n && (e || void 0 === t) && n(), void 0 === t ? null : t);
  }

  function u(e, t, n) {
    return a(e, t, n);
  }

  function l(e, t, n) {
    return r(function(e) {
      return "string" == typeof e;
    }, e) ? e.slice(0) : "string" == typeof e ? [e] : (n && (e || void 0 === t) && n(), void 0 === t ? null : t);
  }

  function c(e, t) {
    if ("string" != typeof t) {
      return null;
    }
    for (var n = 0; t.indexOf("@") >= 0 && 5 > n;) {
      n++;
      t = t.replace(/@(\w+)/g, function(n, i) {
        var r = "";
        "string" == typeof e[i] ? r = e[i] : e[i] && e[i] instanceof RegExp ? r = e[i].source : void 0 === e[i] ? o
          .throwError(e, "language definition does not contain attribute '" + i + "', used at: " + t) : o.throwError(
            e, "attribute reference '" + i + "' must be a string, used at: " + t);

        return o.empty(r) ? "" : "(?:" + r + ")";
      });
    }
    return new RegExp(t, e.ignoreCase ? "i" : "");
  }

  function d(e, t, n, i) {
    if (0 > i) {
      return e;
    }
    if (i < t.length) {
      return t[i];
    }
    if (i >= 100) {
      i -= 100;
      var o = n.split(".");
      if (o.unshift(n), i < o.length) {
        return o[i];
      }
    }
    return null;
  }

  function h(e, t, i, s) {
    var a = -1;

    var u = i;

    var l = i.match(/^\$(([sS]?)(\d\d?)|#)(.*)$/);
    l && (l[3] && (a = parseInt(l[3]), l[2] && (a += 100)), u = l[4]);
    var h = "~";

    var p = u;
    u && 0 !== u.length ? /^\w*$/.test(p) ? h = "==" : (l = u.match(/^(@|!@|~|!~|==|!=)(.*)$/), l && (h = l[1], p = l[
      2])) : (h = "!=", p = "");
    var f;
    if ("~" !== h && "!~" !== h || !/^(\w|\|)*$/.test(p))
      if ("@" === h || "!@" === h) {
        var g = e[p];
        g || o.throwError(e, "the @ match target '" + p + "' is not defined, in rule: " + t);

        r(function(e) {
          return "string" == typeof e;
        }, g) || o.throwError(e, "the @ match target '" + p + "' must be an array of strings, in rule: " + t);
        var m = n.createKeywordMatcher(g, e.ignoreCase);
        f = function(e) {
          return "@" === h ? m(e) : !m(e);
        };
      } else if ("~" === h || "!~" === h)
      if (p.indexOf("$") < 0) {
        var v = c(e, "^" + p + "$");
        f = function(e) {
          return "~" === h ? v.test(e) : !v.test(e);
        };
      } else {
        f = function(t, n, i, r) {
          var s = c(e, "^" + o.substituteMatches(e, p, n, i, r) + "$");
          return s.test(t);
        };
      } else if (p.indexOf("$") < 0) {
      var y = o.fixCase(e, p);
      f = function(e) {
        return "==" === h ? e === y : e !== y;
      };
    } else {
      var y = o.fixCase(e, p);
      f = function(t, n, i, r) {
        var s = o.substituteMatches(e, y, n, i, r);
        return "==" === h ? t === s : t !== s;
      };
    } else {
      var m = n.createKeywordMatcher(p.split("|"), e.ignoreCase);
      f = function(e) {
        return "~" === h ? m(e) : !m(e);
      };
    }
    return -1 === a ? {
      name: i,
      value: s,
      test: function(e, t, n, i) {
        return f(e, e, t, n, i);
      }
    } : {
      name: i,
      value: s,
      test: function(e, t, n, i) {
        var o = d(e, t, n, a);
        return f(o ? o : "", e, t, n, i);
      }
    };
  }

  function p(e, t, n) {
    if (n) {
      if ("string" == typeof n) {
        return n;
      }
      if (n.token || "" === n.token) {
        if ("string" != typeof n.token) {
          o.throwError(e, "a 'token' attribute must be of type string, in rule: " + t);
          return {
            token: ""
          };
        }
        var i = {
          token: n.token
        };
        if (n.token.indexOf("$") >= 0 && (i.tokenSubst = !0), "string" == typeof n.bracket && ("@open" === n.bracket ?
          i.bracket = 1 : "@close" === n.bracket ? i.bracket = -1 : o.throwError(e,
            "a 'bracket' attribute must be either '@open' or '@close', in rule: " + t)), n.next)
          if ("string" != typeof n.next) {
            o.throwError(e, "the next state must be a string value in rule: " + t);
          } else {
            var r = n.next;
            /^(@pop|@push|@popall)$/.test(r) || ("@" === r[0] && (r = r.substr(1)), r.indexOf("$") < 0 && (o.stateExists(
              e, o.substituteMatches(e, r, "", [], "")) || o.throwError(e, "the next state '" + n.next +
              "' is not defined in rule: " + t)));

            i.next = r;
          }
          "number" == typeof n.goBack && (i.goBack = n.goBack);

        "string" == typeof n.switchTo && (i.switchTo = n.switchTo);

        "string" == typeof n.log && (i.log = n.log);

        "string" == typeof n.nextEmbedded && (i.nextEmbedded = n.nextEmbedded, e.usesEmbedded = !0);

        return i;
      }
      if (n instanceof Array) {
        var s;

        var a = [];
        for (s in n) {
          n.hasOwnProperty(s) && (a[s] = p(e, t, n[s]));
        }
        return {
          group: a
        };
      }
      if (n.cases) {
        var u;

        var l = [];
        for (u in n.cases)
          if (n.cases.hasOwnProperty(u)) {
            var c = p(e, t, n.cases[u]);
            "@default" === u || "@" === u || "" === u ? l.push({
              test: null,
              value: c,
              name: u
            }) : "@eos" === u ? l.push({
              test: function(e, t, n, i) {
                return i;
              },
              value: c,
              name: u
            }) : l.push(h(e, t, u, c));
          }
        var d = e.defaultToken;
        return {
          test: function(e, t, n, i) {
            var o;
            for (o in l)
              if (l.hasOwnProperty(o)) {
                var r = !l[o].test || l[o].test(e, t, n, i);
                if (r) {
                  return l[o].value;
                }
              }
            return d;
          }
        };
      }
      o.throwError(e,
        "an action must be a string, an object with a 'token' or 'cases' attribute, or an array of actions; in rule: " +
        t);

      return "";
    }
    return {
      token: ""
    };
  }

  function f(e) {
    function t(r, u, l) {
      var c;
      for (c in l)
        if (l.hasOwnProperty(c)) {
          var d = l[c];

          var h = d.include;
          if (h) {
            "string" != typeof h && o.throwError(n, "an 'include' attribute must be a string at: " + r);
            "@" === h[0] && (h = h.substr(1));
            e.tokenizer[h] || o.throwError(n, "include target '" + h + "' is not defined at: " + r);
            t(r + "." + h, u, e.tokenizer[h]);
          } else {
            var p = new g(r);
            if (d instanceof Array && d.length >= 1 && d.length <= 3)
              if (p.setRegex(i, d[0]), d.length >= 3)
                if ("string" == typeof d[1]) {
                  p.setAction(i, {
                    token: d[1],
                    next: d[2]
                  });
                } else if ("object" == typeof d[1]) {
              var f = d[1];
              f.next = d[2];

              p.setAction(i, f);
            } else {
              o.throwError(n,
                "a next state as the last element of a rule can only be given if the action is either an object or a string, at: " +
                r);
            } else {
              p.setAction(i, d[1]);
            } else {
              d.regex || o.throwError(n,
                "a rule must either be an array, or an object with a 'regex' or 'include' field at: " + r);
              d.name && (p.name = a(d.name));
              d.matchOnlyAtStart && (p.matchOnlyAtLineStart = s(d.matchOnlyAtLineStart));
              p.setRegex(i, d.regex);
              p.setAction(i, d.action);
            }
            u.push(p);
          }
        }
    }
    if (!e || "object" != typeof e) throw new Error("Monarch: expecting a language definition object");
    if ("string" != typeof e.name) throw new Error(
      "Monarch: a language definition must include a string 'name' attribute");
    var n = {};
    n.name = e.name;

    n.displayName = a(e.displayName, n.name);

    n.logConsole = a(e.logConsole);

    n.noThrow = !1;

    n.maxStack = 100;

    n.mimeTypes = l(e.mimeTypes, void 0, function() {
      o.throwError(n, "the attribute 'mimeTypes' must be defined as an array of strings");
    });

    n.start = a(e.start);

    n.fileExtensions = l(e.fileExtensions);

    n.ignoreCase = s(e.ignoreCase, !1);

    n.lineComment = a(e.lineComment, "//");

    n.blockCommentStart = a(e.blockCommentStart, "/*");

    n.blockCommentEnd = a(e.blockCommentEnd, "*/");

    n.tokenPostfix = a(e.tokenPostfix, "." + n.name);

    n.defaultToken = a(e.defaultToken, "source", function() {
      o.throwError(n, "the 'defaultToken' must be a string");
    });

    n.editorOptions = e.editorOptions ? e.editorOptions : null;

    n.workerScriptPath = a(e.workerScriptPath);

    n.usesEmbedded = !1;

    n.wordDefinition = e.wordDefinition || void 0;

    !n.lineComment && e.lineComments && ("string" == typeof e.lineComments ? n.lineComment = e.lineComments :
      "string" == typeof e.lineComments[0] && (n.lineComment = e.lineComments[0]));
    var i = e;
    i.name = n.name;

    i.displayName = n.displayName;

    i.ignoreCase = n.ignoreCase;

    i.noThrow = n.noThrow;

    i.usesEmbedded = n.usesEmbedded;

    i.stateNames = e.tokenizer;

    i.logConsole = n.logConsole;

    i.defaultToken = n.defaultToken;

    e.tokenizer && "object" == typeof e.tokenizer || o.throwError(n,
      "a language definition must define the 'tokenizer' attribute as an object");

    n.tokenizer = [];
    var r;
    for (r in e.tokenizer)
      if (e.tokenizer.hasOwnProperty(r)) {
        n.start || (n.start = r);
        var d = e.tokenizer[r];
        n.tokenizer[r] = new Array;

        t("tokenizer." + r, n.tokenizer[r], d);
      }
    n.usesEmbedded = i.usesEmbedded;

    n.nonWordTokens = l(e.nonWordTokens, ["delimiter", "delimiter.parenthesis", "delimiter.curly", "delimiter.square",
      "delimiter.angle"
    ], function() {
      o.throwError(n, "the 'nonWordTokens' attribute must be an array of strings");
    });
    var h;
    for (h in n.nonWordTokens) {
      n.nonWordTokens.hasOwnProperty(h) && (n.nonWordTokens[h] += n.tokenPostfix);
    }
    e.brackets ? e.brackets instanceof Array || o.throwError(n,
      "the 'brackets' attribute must be defined as an array") : e.brackets = [{
      open: "{",
      close: "}",
      token: "delimiter.curly"
    }, {
      open: "[",
      close: "]",
      token: "delimiter.square"
    }, {
      open: "(",
      close: ")",
      token: "delimiter.parenthesis"
    }, {
      open: "<",
      close: ">",
      token: "delimiter.angle"
    }];
    var p = [];
    for (var f in e.brackets)
      if (e.brackets.hasOwnProperty(f)) {
        var m = e.brackets[f];
        m && m instanceof Array && 3 === m.length && (m = {
          token: m[2],
          open: m[0],
          close: m[1]
        });

        m.open === m.close && o.throwError(n, "open and close brackets in a 'brackets' attribute must be different: " +
          m.open + "\n hint: use the 'bracket' attribute if matching on equal brackets is required.");

        "string" == typeof m.open && "string" == typeof m.token ? p.push({
          token: a(m.token) + n.tokenPostfix,
          open: o.fixCase(n, a(m.open)),
          close: o.fixCase(n, a(m.close))
        }) : o.throwError(n, "every element in the 'brackets' array must be a '{open,close,token}' object or array");
      }
    n.brackets = p;
    var v;
    if (e.autoClosingPairs ? (e.autoClosingPairs instanceof Array || o.throwError(n,
      "the 'autoClosingPairs' attribute must be an array of string pairs (as arrays)"), v = e.autoClosingPairs.slice(
      0)) : v = [
      ['"', '"'],
      ["'", "'"],
      ["@brackets"]
    ], n.autoClosingPairs = [], v)
      for (var y in v)
        if (v.hasOwnProperty(y)) {
          var _;

          var b = v[y];
          if ("@brackets" === b || "@brackets" === b[0]) {
            var C;
            for (C in p) {
              p.hasOwnProperty(C) && p[C].open && 1 === p[C].open.length && p[C].close && 1 === p[C].close.length &&
                (_ = {
                open: p[C].open,
                close: p[C].close
              }, n.autoClosingPairs.push(_));
            }
          } else {
            b instanceof Array && 2 === b.length && "string" == typeof b[0] && 1 === b[0].length && "string" ==
              typeof b[1] && 1 === b[1].length ? (_ = {
                open: o.fixCase(n, b[0]),
                close: o.fixCase(n, b[1])
              }, n.autoClosingPairs.push(_)) : "string" == typeof b.open && 1 === b.open.length && "string" == typeof b
              .close && 1 === b.close.length ? (_ = {
                open: o.fixCase(n, b.open[0]),
                close: o.fixCase(n, b.close[0])
              }, n.autoClosingPairs.push(_)) : o.throwError(n,
                "every element in an 'autoClosingPairs' array must be a pair of 1 character strings, or a '@brackets' directive"
            );
          }
        }
    if (e.autoIndent) {
      var w = [];
      e.autoIndent instanceof Array || o.throwError(n,
        "an 'autoIndent' attribute must be an array of '{match,matchAfter}' objects");
      for (var E in e.autoIndent) {
        e.autoIndent.hasOwnProperty(E) && ("string" != typeof e.autoIndent[E].match && o.throwError(n,
          "each object in the 'autoIndent' array must define a 'match' attribute"), w.push({
          match: c(n, e.autoIndent[E].match),
          matchAfter: c(n, a(e.autoIndent[E].matchAfter))
        }));
      }
      n.autoIndent = w;
    }
    if (e.autoComplete) {
      var S = [];
      e.autoComplete instanceof Array || o.throwError(n,
        "an 'autoComplete' attribute must be an array of '{trigger,match,complete}' objects");
      for (var x in e.autoComplete) {
        e.autoComplete.hasOwnProperty(x) && ("string" != typeof e.autoComplete[x].triggers && o.throwError(n,
            "each object in the 'autoComplete' array must define a 'triggers' attribute"), "string" != typeof e.autoComplete[
            x].match && o.throwError(n,
            "each object in the 'autoComplete' array must define a 'match' attribute as a regular expression string"),
          "string" != typeof e.autoComplete[x].complete && o.throwError(n,
            "each object in the 'autoComplete' array must define a 'complete' attribute"), S.push({
            triggers: o.fixCase(n, a(e.autoComplete[x].triggers)),
            match: c(n, e.autoComplete[x].match),
            complete: a(e.autoComplete[x].complete)
          }));
      }
      n.autoComplete = S;
    }
    if (e.noindentBrackets) {
      var L = u(e.noindentBrackets, null, function() {
        o.throwError(n, "the 'noindentBrackets' must be a regular expression string");
      });
      n.noindentBrackets = c(n, L);
    }
    var T = [];
    for (var N in n.brackets)
      if (n.brackets.hasOwnProperty(N)) {
        var M = n.brackets[N].close;
        M && M.length > 0 && (n.noindentBrackets && n.noindentBrackets.test(M) || T.push(M.substr(M.length - 1)));
      }
    for (var D in n.autoComplete) {
      n.autoComplete.hasOwnProperty(D) && T.push(n.autoComplete[D].triggers);
    }
    n.electricChars = T.join("") + a(e.outdentTriggers, "");

    n.logConsole || (n.logConsole = "monarchConsole");

    n.noThrow = !0;

    return n;
  }
  var g = function() {
    function e(e) {
      this.regex = new RegExp("");

      this.action = {
        token: ""
      };

      this.matchOnlyAtLineStart = !1;

      this.name = "";

      this.name = e;
    }
    e.prototype.setRegex = function(e, t) {
      var n;
      "string" == typeof t ? n = t : t instanceof RegExp ? n = t.source : o.throwError(e,
        "rules must start with a match string or regular expression: " + this.name);

      this.matchOnlyAtLineStart = n.length > 0 && "^" === n[0];

      this.name = this.name + ": " + n;

      this.regex = c(e, "^(?:" + (this.matchOnlyAtLineStart ? n.substr(1) : n) + ")");
    };

    e.prototype.setAction = function(e, t) {
      this.action = p(e, this.name, t);
    };

    return e;
  }();
  t.compile = f;
});