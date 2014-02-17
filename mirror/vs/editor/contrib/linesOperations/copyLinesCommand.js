define(["require", "exports", "vs/editor/core/range"], function(a, b, c) {
  var d = c;

  var e = function() {
    function a(a, b) {
      this._selection = a;

      this._isCopyingDown = b;
    }
    a.prototype.getEditOperations = function(a, b) {
      var c = this._selection;
      this._moveEndPositionDown = !1;

      this._moveStartPositionUp = !1;

      c.startLineNumber < c.endLineNumber && c.endColumn === 1 && (this._moveEndPositionDown = !0, c = c.setEndPosition(
        c.endLineNumber - 1, a.getLineMaxColumn(c.endLineNumber - 1)), !this._isCopyingDown && c.isEmpty() && (this
        ._moveEndPositionDown = !1, this._moveStartPositionUp = !0));
      var e = [];
      for (var f = c.startLineNumber; f <= c.endLineNumber; f++) {
        e.push(a.getLineContent(f));
      }
      var g = e.join("\n");
      this._isCopyingDown ? b.addEditOperation(new d.Range(c.startLineNumber, 1, c.startLineNumber, 1), g + "\n") : b
        .addEditOperation(new d.Range(c.endLineNumber, a.getLineMaxColumn(c.endLineNumber), c.endLineNumber, a.getLineMaxColumn(
          c.endLineNumber)), "\n" + g);

      this._selectionId = b.trackSelection(c);
    };

    a.prototype.computeCursorState = function(a, b) {
      var c = b.getTrackedSelection(this._selectionId);
      this._moveStartPositionUp && (c = c.setEndPosition(c.startLineNumber - 1, 1));

      this._moveEndPositionDown && (c = c.setEndPosition(c.endLineNumber + 1, 1));

      return c;
    };

    return a;
  }();
  b.CopyLinesCommand = e;
});