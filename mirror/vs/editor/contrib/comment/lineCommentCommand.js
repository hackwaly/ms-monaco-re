var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/contrib/comment/blockCommentCommand", "vs/base/strings",
  "vs/editor/core/range"
], function(a, b, c, d, e) {
  var f = c;

  var g = d;

  var h = e;

  var i = function(a) {
    function b(b) {
      a.call(this, b);

      this._hasDelegatedToParent = !1;
    }
    __extends(b, a);

    b.prototype._hasLineCommentTokensSupportForLines = function(a, b, c) {
      var d;

      var e;
      for (var f = b; f <= c; f++) {
        d = a.getModeAtPosition(b, 1).commentsSupport;
        if (!d) {
          return !1;
        }
        e = d.getCommentsConfiguration();
        if (!e || !e.lineCommentTokens || e.lineCommentTokens.length === 0) {
          return !1;
        }
      }
      return !0;
    };

    b.prototype.getEditOperations = function(b, c) {
      var d = this._selection;
      this._moveEndPositionDown = !1;

      d.startLineNumber < d.endLineNumber && d.endColumn === 1 && (this._moveEndPositionDown = !0, d = d.setEndPosition(
        d.endLineNumber - 1, b.getLineMaxColumn(d.endLineNumber - 1)));
      var e = b.getModeAtPosition(d.startLineNumber, d.startColumn).commentsSupport;
      if (!e) return;
      if (!this._hasLineCommentTokensSupportForLines(b, d.startLineNumber, d.endLineNumber)) {
        var f = e.getCommentsConfiguration();
        if (!f || !f.blockCommentStartToken || !f.blockCommentEndToken) return;
        var i = f.blockCommentStartToken;

        var j = i.length;

        var k = f.blockCommentEndToken;

        var l = k.length;

        var m = b.getLineContent(d.startLineNumber).lastIndexOf(i, d.startColumn - 1);

        var n = b.getLineContent(d.endLineNumber).indexOf(k, d.endColumn - 1);
        m !== -1 && n !== -1 ? (d.startColumn = m + j + 1, d.endColumn = n + 1) : (d.startColumn = 1, d.endColumn = b
          .getLineMaxColumn(d.endLineNumber));

        this._hasDelegatedToParent = !0;

        a.prototype._createOperationsForBlockComment.call(this, d, f, b, c);
        return;
      }
      var o = !0;

      var p;

      var q = [];

      var r = [];

      var s;

      var t;

      var u;
      for (u = d.startLineNumber; u <= d.endLineNumber; u++) {
        t = b.getModeAtPosition(u, 1).commentsSupport.getCommentsConfiguration().lineCommentTokens[0];
        r[u - d.startLineNumber] = t;
        o && (p = b.getLineContent(u), s = g.firstNonWhitespaceIndex(p), s === -1 ? o = !1 : this._haystackHasNeedleAtOffset(
          p, t, s) || (o = !1), q[u - d.startLineNumber] = s);
      }
      if (o)
        for (u = d.startLineNumber; u <= d.endLineNumber; u++) {
          c.addEditOperation(new h.Range(u, q[u - d.startLineNumber] + 1, u, q[u - d.startLineNumber] + 1 + r[u - d.startLineNumber]
            .length), null);
        } else
          for (u = d.startLineNumber; u <= d.endLineNumber; u++) {
            c.addEditOperation(new h.Range(u, 1, u, 1), r[u - d.startLineNumber]);
          }
      this._selectionId = c.trackSelection(d);
    };

    b.prototype.computeCursorState = function(b, c) {
      if (this._hasDelegatedToParent) {
        return a.prototype.computeCursorState.call(this, b, c);
      }
      var d = c.getTrackedSelection(this._selectionId);
      this._moveEndPositionDown && (d = d.setEndPosition(d.endLineNumber + 1, 1));

      return d;
    };

    return b;
  }(f.BlockCommentCommand);
  b.LineCommentCommand = i;
});