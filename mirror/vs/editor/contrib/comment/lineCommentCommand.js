define("vs/editor/contrib/comment/lineCommentCommand", ["require", "exports",
  "vs/editor/contrib/comment/blockCommentCommand", "vs/base/strings", "vs/editor/core/range"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t) {
      e.call(this, t);

      this._hasDelegatedToParent = !1;
    }
    __extends(t, e);

    t.prototype._hasLineCommentTokensSupportForLines = function(e, t, n) {
      for (var i, o, r = t; n >= r; r++) {
        if (i = e.getModeAtPosition(t, 1).commentsSupport, !i) {
          return !1;
        }
        if (o = i.getCommentsConfiguration(), !o || !o.lineCommentTokens || 0 === o.lineCommentTokens.length) {
          return !1;
        }
      }
      return !0;
    };

    t.prototype.getEditOperations = function(t, n) {
      var r = this._selection;
      this._moveEndPositionDown = !1;

      if (r.startLineNumber < r.endLineNumber && 1 === r.endColumn) {
        this._moveEndPositionDown = !0;
        r = r.setEndPosition(r.endLineNumber - 1, t.getLineMaxColumn(r.endLineNumber - 1));
      }
      var s = t.getModeAtPosition(r.startLineNumber, r.startColumn).commentsSupport;
      if (s) {
        if (!this._hasLineCommentTokensSupportForLines(t, r.startLineNumber, r.endLineNumber)) {
          var a = s.getCommentsConfiguration();
          if (!a || !a.blockCommentStartToken || !a.blockCommentEndToken) return;
          var u = a.blockCommentStartToken;

          var l = u.length;

          var c = a.blockCommentEndToken;

          var d = (c.length, t.getLineContent(r.startLineNumber).lastIndexOf(u, r.startColumn - 1));

          var h = t.getLineContent(r.endLineNumber).indexOf(c, r.endColumn - 1); - 1 !== d && -1 !== h ? (r.startColumn =
            d + l + 1, r.endColumn = h + 1) : (r.startColumn = 1, r.endColumn = t.getLineMaxColumn(r.endLineNumber));

          this._hasDelegatedToParent = !0;

          e.prototype._createOperationsForBlockComment.call(this, r, a, t, n);

          return void 0;
        }
        var p;

        var f;

        var g;

        var m;

        var v = !0;

        var y = [];

        var _ = [];
        for (m = r.startLineNumber; m <= r.endLineNumber; m++) {
          g = t.getModeAtPosition(m, 1).commentsSupport.getCommentsConfiguration().lineCommentTokens[0];
          _[m - r.startLineNumber] = g;
          if (v) {
            p = t.getLineContent(m);
            f = i.firstNonWhitespaceIndex(p);
            if (-1 === f) {
              v = !1;
            } {
              if (!this._haystackHasNeedleAtOffset(p, g, f)) {
                v = !1;
              }
            }
            y[m - r.startLineNumber] = f;
          }
        }
        if (v)
          for (m = r.startLineNumber; m <= r.endLineNumber; m++) {
            n.addEditOperation(new o.Range(m, y[m - r.startLineNumber] + 1, m, y[m - r.startLineNumber] + 1 + _[m - r
              .startLineNumber].length), null);
          } else
            for (m = r.startLineNumber; m <= r.endLineNumber; m++) {
              n.addEditOperation(new o.Range(m, 1, m, 1), _[m - r.startLineNumber]);
            }
        this._selectionId = n.trackSelection(r);
      }
    };

    t.prototype.computeCursorState = function(t, n) {
      if (this._hasDelegatedToParent) {
        return e.prototype.computeCursorState.call(this, t, n);
      }
      var i = n.getTrackedSelection(this._selectionId);
      this._moveEndPositionDown && (i = i.setEndPosition(i.endLineNumber + 1, 1));

      return i;
    };

    return t;
  }(n.BlockCommentCommand);
  t.LineCommentCommand = r;
});