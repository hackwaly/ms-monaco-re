define('vs/languages/typescript/lint/rules/layout', [
  'require',
  'exports',
  'vs/languages/typescript/lint/rules',
  'vs/languages/typescript/lib/typescriptServices'
], function(e, t, n, r) {
  var i = function() {
    function e() {
      this.code = 'SA1503', this.name = 'CurlyBracketsMustNotBeOmitted', this.filter = [
        r.SyntaxKind.IfStatement,
        r.SyntaxKind.ElseClause,
        r.SyntaxKind.DoStatement,
        r.SyntaxKind.ForInStatement,
        r.SyntaxKind.ForStatement,
        r.SyntaxKind.WhileStatement
      ];
    }
    return e.prototype.checkElement = function(e, t) {
      var n = e;
      n.kind() === r.SyntaxKind.ElseClause && n.statement && n.statement.kind() === r.SyntaxKind.IfStatement || n.statement &&
        n.statement.kind() !== r.SyntaxKind.Block && t.reportError(n.statement, this.name, this.code);
    }, e;
  }();
  t.CurlyBracketsMustNotBeOmitted = i;
  var o = function() {
    function e() {
      this.code = 'SA1514', this.name = 'EmptyBlocksWithoutComment', this.filter = [r.SyntaxKind.Block];
    }
    return e.prototype.checkElement = function(e, t) {
      e.statements.childCount() > 0 || this._hasComment(e) || t.reportError(e, this.name, this.code);
    }, e.prototype._hasComment = function(e) {
      if (!e)
        return !1;
      if (!e.firstToken() || !e.lastToken())
        return !1;
      for (var t = e.leadingTrivia().concat(e.trailingTrivia()), i = 0, o = t.count(); o > i; i++)
        if (n.syntaxHelper.isOfKind(t.syntaxTriviaAt(i), r.SyntaxKind.MultiLineCommentTrivia, r.SyntaxKind.SingleLineCommentTrivia))
          return !0;
      for (var i = 0, o = e.childCount(); o > i; i++)
        if (this._hasComment(e.childAt(i)))
          return !0;
      return !1;
    }, e;
  }();
  t.EmptyBlocksWithoutComment = o;
})