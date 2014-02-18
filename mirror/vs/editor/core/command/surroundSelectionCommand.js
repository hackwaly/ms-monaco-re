define(["require", "exports", "vs/editor/core/range", "vs/editor/core/selection"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function() {
    function a(a, b, c) {
      this._range = a;

      this._charBeforeSelection = b;

      this._charAfterSelection = c;
    }
    a.prototype.getEditOperations = function(a, b) {
      b.addEditOperation(new e.Range(this._range.startLineNumber, this._range.startColumn, this._range.startLineNumber,
        this._range.startColumn), this._charBeforeSelection);

      b.addEditOperation(new e.Range(this._range.endLineNumber, this._range.endColumn, this._range.endLineNumber,
        this._range.endColumn), this._charAfterSelection);
    };

    a.prototype.computeCursorState = function(a, b) {
      var c = b.getInverseEditOperations();

      var d = c[0].range;

      var e = c[1].range;
      return new f.Selection(d.endLineNumber, d.endColumn, e.endLineNumber, e.endColumn - this._charAfterSelection.length);
    };

    return a;
  }();
  b.SurroundSelectionCommand = g;
});