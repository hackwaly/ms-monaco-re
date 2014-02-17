define("vs/editor/core/command/surroundSelectionCommand", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t, n) {
      this._range = e;

      this._charBeforeSelection = t;

      this._charAfterSelection = n;
    }
    e.prototype.getEditOperations = function(e, t) {
      t.addEditOperation(new n.Range(this._range.startLineNumber, this._range.startColumn, this._range.startLineNumber,
        this._range.startColumn), this._charBeforeSelection);

      t.addEditOperation(new n.Range(this._range.endLineNumber, this._range.endColumn, this._range.endLineNumber,
        this._range.endColumn), this._charAfterSelection);
    };

    e.prototype.computeCursorState = function(e, t) {
      var n = t.getInverseEditOperations();

      var o = n[0].range;

      var r = n[1].range;
      return new i.Selection(o.endLineNumber, o.endColumn, r.endLineNumber, r.endColumn - this._charAfterSelection.length);
    };

    return e;
  }();
  t.SurroundSelectionCommand = o;
});