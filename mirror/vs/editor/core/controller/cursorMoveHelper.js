define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a) {
      this.configuration = a;
    }
    a.prototype.getLeftOfPosition = function(a, b, c) {
      c > 1 ? c -= 1 : b > 1 && (b -= 1, c = a.getLineMaxColumn(b));

      return {
        lineNumber: b,
        column: c
      };
    };

    a.prototype.getRightOfPosition = function(a, b, c) {
      c < a.getLineMaxColumn(b) ? c += 1 : b < a.getLineCount() && (b += 1, c = 1);

      return {
        lineNumber: b,
        column: c
      };
    };

    a.prototype.getPositionUp = function(a, b, c, d, e) {
      var f = this.visibleColumnFromColumn(a, b, c) + d;
      b -= e;

      b < 1 && (b = 1);

      c = this.columnFromVisibleColumn(a, b, f);

      d = f - this.visibleColumnFromColumn(a, b, c);

      return {
        lineNumber: b,
        column: c,
        leftoverVisibleColumns: d
      };
    };

    a.prototype.getPositionDown = function(a, b, c, d, e) {
      var f = this.visibleColumnFromColumn(a, b, c) + d;
      b += e;
      var g = a.getLineCount();
      b > g && (b = g);

      c = this.columnFromVisibleColumn(a, b, f);

      d = f - this.visibleColumnFromColumn(a, b, c);

      return {
        lineNumber: b,
        column: c,
        leftoverVisibleColumns: d
      };
    };

    a.prototype.getColumnAtBeginningOfLine = function(a, b, c) {
      var d = a.getLineFirstNonWhitespaceColumn(b) || 1;
      c !== 1 && c <= d ? c = 1 : c = d;

      return c;
    };

    a.prototype.getColumnAtEndOfLine = function(a, b, c) {
      var d = a.getLineMaxColumn(b);

      var e = a.getLineLastNonWhitespaceColumn(b) || d;
      c !== d && c >= e ? c = d : c = e;

      return c;
    };

    a.prototype.visibleColumnFromColumn = function(a, b, c) {
      var d = a.getLineContent(b);

      var e = 0;
      for (var f = 0; f < c - 1; f++) {
        e = d.charAt(f) === "	" ? this.nextTabColumn(e) : e + 1;
      }
      return e;
    };

    a.prototype.columnFromVisibleColumn = function(a, b, c) {
      var d = a.getLineContent(b);

      var e = -1;

      var f = 0;
      for (var g = 0; g < d.length && f <= c; g++) {
        e = f;
        f = d.charAt(g) === "	" ? this.nextTabColumn(f) : f + 1;
      }
      f = Math.abs(c - f);

      e = Math.abs(c - e);

      return f < e ? g + 1 : g;
    };

    a.prototype.nextTabColumn = function(a) {
      return a + this.configuration.editor.tabSize - a % this.configuration.editor.tabSize;
    };

    return a;
  }();
  b.ModelCursorMoveHelper = c;
});