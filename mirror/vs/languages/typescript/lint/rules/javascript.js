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
      e && 0 !== e.fullWidth() || t.reportError(t.parent(e), this.name, this.code);
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
      o.SyntaxFacts.isFutureReservedKeyword(e.kind()) && t.reportError(e, this.name, this.code);
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
      e.kind() < o.SyntaxKind.IdentifierName || this._isTrulyTypeScriptSpecific(e) && t.reportError(e, this.name,
        this.code);
    };

    e.prototype._isTrulyTypeScriptSpecific = function(e) {
      if (!this._isTypeScriptSpecificToken(e)) {
        return !1;
      }
      var t = [];
      do {
        for (var n = 0, r = e.childCount(); r > n; n++) {
          var i = e.childAt(n);
          i && t.push(i);
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
            a.right.kind() === o.SyntaxKind.NullKeyword ? l = !0 : "undefined" === i.syntaxHelper.text(a.right) && (l = !
              0);
          }
          l && s.reportError(a, this.name, this.code);
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
      e.statement && "function" == typeof e.statement.kind && e.statement.kind() === o.SyntaxKind.EmptyStatement && t
        .reportError(e, this.name, this.code);
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

      n && !n.charAt(0).match(/[A-Z_]/) && t.reportError(e.expression, this.name, this.code);
    };

    return e;
  }();
  t.NewOnLowercaseFunctions = d;
});