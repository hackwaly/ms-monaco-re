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
      }

      {
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
            } {
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