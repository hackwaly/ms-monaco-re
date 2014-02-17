define("vs/editor/core/controller/cursorMoveHelper", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e) {
      this.configuration = e;
    }
    e.prototype.getLeftOfPosition = function(e, t, n) {
      n > 1 ? n -= 1 : t > 1 && (t -= 1, n = e.getLineMaxColumn(t));

      return {
        lineNumber: t,
        column: n
      };
    };

    e.prototype.getRightOfPosition = function(e, t, n) {
      n < e.getLineMaxColumn(t) ? n += 1 : t < e.getLineCount() && (t += 1, n = 1);

      return {
        lineNumber: t,
        column: n
      };
    };

    e.prototype.getPositionUp = function(e, t, n, i, o) {
      var r = this.visibleColumnFromColumn(e, t, n) + i;
      t -= o;

      1 > t && (t = 1);

      n = this.columnFromVisibleColumn(e, t, r);

      i = r - this.visibleColumnFromColumn(e, t, n);

      return {
        lineNumber: t,
        column: n,
        leftoverVisibleColumns: i
      };
    };

    e.prototype.getPositionDown = function(e, t, n, i, o) {
      var r = this.visibleColumnFromColumn(e, t, n) + i;
      t += o;
      var s = e.getLineCount();
      t > s && (t = s);

      n = this.columnFromVisibleColumn(e, t, r);

      i = r - this.visibleColumnFromColumn(e, t, n);

      return {
        lineNumber: t,
        column: n,
        leftoverVisibleColumns: i
      };
    };

    e.prototype.getColumnAtBeginningOfLine = function(e, t, n) {
      var i = e.getLineFirstNonWhitespaceColumn(t) || 1;
      return n = 1 !== n && i >= n ? 1 : i;
    };

    e.prototype.getColumnAtEndOfLine = function(e, t, n) {
      var i = e.getLineMaxColumn(t);

      var o = e.getLineLastNonWhitespaceColumn(t) || i;
      return n = n !== i && n >= o ? i : o;
    };

    e.prototype.visibleColumnFromColumn = function(e, t, n) {
      for (var i = e.getLineContent(t), o = 0, r = 0; n - 1 > r; r++) o = "	" === i.charAt(r) ? this.nextTabColumn(o) :
        o + 1;
      return o;
    };

    e.prototype.columnFromVisibleColumn = function(e, t, n) {
      for (var i = e.getLineContent(t), o = -1, r = 0, s = 0; s < i.length && n >= r; s++) o = r;

      r = "	" === i.charAt(s) ? this.nextTabColumn(r) : r + 1;
      r = Math.abs(n - r);

      o = Math.abs(n - o);

      return o > r ? s + 1 : s;
    };

    e.prototype.nextTabColumn = function(e) {
      return e + this.configuration.getIndentationOptions().tabSize - e % this.configuration.getIndentationOptions().tabSize;
    };

    return e;
  }();
  t.ModelCursorMoveHelper = n;
});