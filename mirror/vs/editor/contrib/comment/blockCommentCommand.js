define("vs/editor/contrib/comment/blockCommentCommand", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection"
], function(e, t, n, i) {
  var o = function() {
    function e(e) {
      this._selection = e;

      this._usedEndToken = null;
    }
    e.prototype._haystackHasNeedleAtOffset = function(e, t, n) {
      if (0 > n) {
        return !1;
      }
      var i = t.length;

      var o = e.length;
      if (n + i > o) {
        return !1;
      }
      for (var r = 0; i > r; r++)
        if (e.charCodeAt(n + r) !== t.charCodeAt(r)) {
          return !1;
        }
      return !0;
    };

    e.prototype._createOperationsForBlockComment = function(e, t, i, o) {
      var r = e.startLineNumber;

      var s = e.startColumn;

      var a = e.endLineNumber;

      var u = e.endColumn;

      var l = n.isEmpty(e);

      var c = t.blockCommentStartToken;

      var d = c.length;

      var h = t.blockCommentEndToken;

      var p = h.length;

      var f = this._haystackHasNeedleAtOffset(i.getLineContent(r), c, s - 1 - d);

      var g = this._haystackHasNeedleAtOffset(i.getLineContent(a), h, u - 1);
      if (f && g) {
        if (l) {
          o.addEditOperation(new n.Range(r, s - d, a, u + p), null);
        } {
          o.addEditOperation(new n.Range(r, s - d, r, s), null);
          o.addEditOperation(new n.Range(a, u, a, u + p), null);
        }
      }

      {
        if (l) {
          o.addEditOperation(new n.Range(r, s, a, u), c + h);
          this._usedEndToken = h;
        } {
          o.addEditOperation(new n.Range(r, s, r, s), c);
          o.addEditOperation(new n.Range(a, u, a, u), h);
        }
      }
    };

    e.prototype.getEditOperations = function(e, t) {
      var n = this._selection.startLineNumber;

      var i = this._selection.startColumn;

      var o = this._selection.endLineNumber;

      var r = this._selection.endColumn;
      if (o > n && 1 === r) {
        o -= 1;
        r = e.getLineMaxColumn(o);
      }
      var s = e.getModeAtPosition(n, i).commentsSupport;
      if (s) {
        var a = s.getCommentsConfiguration();
        if (a && a.blockCommentStartToken && a.blockCommentEndToken) {
          this._createOperationsForBlockComment({
            startLineNumber: n,
            startColumn: i,
            endLineNumber: o,
            endColumn: r
          }, a, e, t);
        }
      }
    };

    e.prototype.computeCursorState = function(e, t) {
      var n = t.getInverseEditOperations();
      if (2 === n.length) {
        var o = n[0];

        var r = n[1];
        return new i.Selection(o.range.endLineNumber, o.range.endColumn, r.range.startLineNumber, r.range.startColumn);
      }
      var s = n[0].range;

      var a = this._usedEndToken ? -this._usedEndToken.length : 0;
      return new i.Selection(s.endLineNumber, s.endColumn + a, s.endLineNumber, s.endColumn + a);
    };

    return e;
  }();
  t.BlockCommentCommand = o;
});