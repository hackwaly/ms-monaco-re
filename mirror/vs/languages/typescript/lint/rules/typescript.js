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