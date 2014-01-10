define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a) {
      this.configuration = a
    }
    return a.prototype.getLeftOfPosition = function(a, b, c) {
      return c > 1 ? c -= 1 : b > 1 && (b -= 1, c = a.getLineMaxColumn(b)), {
        lineNumber: b,
        column: c
      }
    }, a.prototype.getRightOfPosition = function(a, b, c) {
      return c < a.getLineMaxColumn(b) ? c += 1 : b < a.getLineCount() && (b += 1, c = 1), {
        lineNumber: b,
        column: c
      }
    }, a.prototype.getPositionUp = function(a, b, c, d, e) {
      var f = this.visibleColumnFromColumn(a, b, c) + d;
      return b -= e, b < 1 && (b = 1), c = this.columnFromVisibleColumn(a, b, f), d = f - this.visibleColumnFromColumn(
        a, b, c), {
        lineNumber: b,
        column: c,
        leftoverVisibleColumns: d
      }
    }, a.prototype.getPositionDown = function(a, b, c, d, e) {
      var f = this.visibleColumnFromColumn(a, b, c) + d;
      b += e;
      var g = a.getLineCount();
      return b > g && (b = g), c = this.columnFromVisibleColumn(a, b, f), d = f - this.visibleColumnFromColumn(a, b,
        c), {
        lineNumber: b,
        column: c,
        leftoverVisibleColumns: d
      }
    }, a.prototype.getColumnAtBeginningOfLine = function(a, b, c) {
      var d = a.getLineFirstNonWhitespaceColumn(b) || 1;
      return c !== 1 && c <= d ? c = 1 : c = d, c
    }, a.prototype.getColumnAtEndOfLine = function(a, b, c) {
      var d = a.getLineMaxColumn(b),
        e = a.getLineLastNonWhitespaceColumn(b) || d;
      return c !== d && c >= e ? c = d : c = e, c
    }, a.prototype.visibleColumnFromColumn = function(a, b, c) {
      var d = a.getLineContent(b),
        e = 0;
      for (var f = 0; f < c - 1; f++) e = d.charAt(f) === "	" ? this.nextTabColumn(e) : e + 1;
      return e
    }, a.prototype.columnFromVisibleColumn = function(a, b, c) {
      var d = a.getLineContent(b),
        e = -1,
        f = 0;
      for (var g = 0; g < d.length && f <= c; g++) e = f, f = d.charAt(g) === "	" ? this.nextTabColumn(f) : f + 1;
      return f = Math.abs(c - f), e = Math.abs(c - e), f < e ? g + 1 : g
    }, a.prototype.nextTabColumn = function(a) {
      return a + this.configuration.editor.tabSize - a % this.configuration.editor.tabSize
    }, a
  }();
  b.ModelCursorMoveHelper = c
})