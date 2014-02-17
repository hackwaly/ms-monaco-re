define("vs/editor/contrib/linesOperations/copyLinesCommand", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t) {
      this._selection = e;

      this._isCopyingDown = t;
    }
    e.prototype.getEditOperations = function(e, t) {
      var i = this._selection;
      this._startLineNumberDelta = 0;

      this._endLineNumberDelta = 0;

      if (i.startLineNumber < i.endLineNumber && 1 === i.endColumn) {
        this._endLineNumberDelta = 1;
        i = i.setEndPosition(i.endLineNumber - 1, e.getLineMaxColumn(i.endLineNumber - 1));
      }
      for (var o = [], r = i.startLineNumber; r <= i.endLineNumber; r++) {
        o.push(e.getLineContent(r));
      }
      var s = o.join("\n");
      if ("" === s && this._isCopyingDown) {
        this._startLineNumberDelta++;
        this._endLineNumberDelta++;
      }

      this._isCopyingDown ? t.addEditOperation(new n.Range(i.startLineNumber, 1, i.startLineNumber, 1), s + "\n") : t
        .addEditOperation(new n.Range(i.endLineNumber, e.getLineMaxColumn(i.endLineNumber), i.endLineNumber, e.getLineMaxColumn(
          i.endLineNumber)), "\n" + s);

      this._selectionId = t.trackSelection(i);

      this._selectionDirection = this._selection.getDirection();
    };

    e.prototype.computeCursorState = function(e, t) {
      var n = t.getTrackedSelection(this._selectionId);
      if (0 !== this._startLineNumberDelta || 0 !== this._endLineNumberDelta) {
        var o = n.startLineNumber;

        var r = n.startColumn;

        var s = n.endLineNumber;

        var a = n.endColumn;
        if (0 !== this._startLineNumberDelta) {
          o += this._startLineNumberDelta;
          r = 1;
        }

        if (0 !== this._endLineNumberDelta) {
          s += this._endLineNumberDelta;
          a = 1;
        }

        n = i.createWithDirection(o, r, s, a, this._selectionDirection);
      }
      return n;
    };

    return e;
  }();
  t.CopyLinesCommand = o;
});