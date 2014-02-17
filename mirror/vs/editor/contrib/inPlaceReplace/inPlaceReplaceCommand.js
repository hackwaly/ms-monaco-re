define("vs/editor/contrib/inPlaceReplace/inPlaceReplaceCommand", ["require", "exports", "vs/editor/core/selection"],
  function(e, t, n) {
    var i = function() {
      function e(e, t, n) {
        this._editRange = e;

        this._originalSelection = t;

        this._text = n;
      }
      e.prototype.getEditOperations = function(e, t) {
        t.addEditOperation(this._editRange, this._text);
      };

      e.prototype.computeCursorState = function(e, t) {
        var i = t.getInverseEditOperations();

        var o = i[0].range;
        return this._originalSelection.isEmpty() ? new n.Selection(o.endLineNumber, Math.min(this._originalSelection.positionColumn,
          o.endColumn), o.endLineNumber, Math.min(this._originalSelection.positionColumn, o.endColumn)) : new n.Selection(
          o.endLineNumber, o.endColumn - this._text.length, o.endLineNumber, o.endColumn);
      };

      return e;
    }();
    t.InPlaceReplaceCommand = i;
  });