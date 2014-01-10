define(["require", "exports", "vs/editor/core/range", "vs/editor/core/selection"], function(a, b, c, d) {
  var e = c,
    f = d,
    g = function() {
      function a(a, b) {
        this._selection = a, this._isMovingDown = b
      }
      return a.prototype.getEditOperations = function(a, b) {
        var c = a.getLineCount();
        if (this._isMovingDown && this._selection.endLineNumber === c) return;
        if (!this._isMovingDown && this._selection.startLineNumber === 1) return;
        this._moveEndPositionDown = !1;
        var d = this._selection;
        d.startLineNumber < d.endLineNumber && d.endColumn === 1 && (this._moveEndPositionDown = !0, d = d.setEndPosition(
          d.endLineNumber - 1, a.getLineMaxColumn(d.endLineNumber - 1)));
        if (d.startLineNumber === d.endLineNumber && a.getLineMaxColumn(d.startLineNumber) === 1) {
          var g = d.startLineNumber,
            h = this._isMovingDown ? g + 1 : g - 1;
          b.addEditOperation(new e.Range(g, 1, g, 1), a.getLineContent(h)), b.addEditOperation(new e.Range(h, 1, h, a
            .getLineMaxColumn(h)), null), d = new f.Selection(h, 1, h, 1)
        } else {
          var i, j;
          this._isMovingDown ? (i = d.endLineNumber + 1, j = a.getLineContent(i), b.addEditOperation(new e.Range(i -
            1, a.getLineMaxColumn(i - 1), i, a.getLineMaxColumn(i)), null), b.addEditOperation(new e.Range(d.startLineNumber,
            1, d.startLineNumber, 1), j + "\n")) : (i = d.startLineNumber - 1, j = a.getLineContent(i), b.addEditOperation(
            new e.Range(i, 1, i + 1, 1), null), b.addEditOperation(new e.Range(d.endLineNumber, a.getLineMaxColumn(
            d.endLineNumber), d.endLineNumber, a.getLineMaxColumn(d.endLineNumber)), "\n" + j))
        }
        this._selectionId = b.trackSelection(d)
      }, a.prototype.computeCursorState = function(a, b) {
        var c = b.getTrackedSelection(this._selectionId);
        return this._moveEndPositionDown && (c = c.setEndPosition(c.endLineNumber + 1, 1)), c
      }, a
    }();
  b.MoveLinesCommand = g
})