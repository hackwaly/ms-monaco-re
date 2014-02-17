define("vs/editor/core/command/replaceCommand", ["require", "exports", "vs/editor/core/selection"], function(e, t, n) {
  var i = function() {
    function e(e, t) {
      this._range = e;

      this._text = t;
    }
    e.prototype.getEditOperations = function(e, t) {
      t.addEditOperation(this._range, this._text);
    };

    e.prototype.computeCursorState = function(e, t) {
      var i = t.getInverseEditOperations();

      var o = i[0].range;
      return new n.Selection(o.endLineNumber, o.endColumn, o.endLineNumber, o.endColumn);
    };

    return e;
  }();
  t.ReplaceCommand = i;
  var o = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.computeCursorState = function(e, t) {
      var i = t.getInverseEditOperations();

      var o = i[0].range;
      return new n.Selection(o.startLineNumber, o.startColumn, o.startLineNumber, o.startColumn);
    };

    return t;
  }(i);
  t.ReplaceCommandWithoutChangingPosition = o;
  var r = function(e) {
    function t(t, n, i, o) {
      e.call(this, t, n);

      this._columnDeltaOffset = o;

      this._lineNumberDeltaOffset = i;
    }
    __extends(t, e);

    t.prototype.computeCursorState = function(e, t) {
      var i = t.getInverseEditOperations();

      var o = i[0].range;
      return new n.Selection(o.endLineNumber + this._lineNumberDeltaOffset, o.endColumn + this._columnDeltaOffset, o.endLineNumber +
        this._lineNumberDeltaOffset, o.endColumn + this._columnDeltaOffset);
    };

    return t;
  }(i);
  t.ReplaceCommandWithOffsetCursorState = r;
  var s = function(e) {
    function t(t, n, i) {
      e.call(this, t, n);

      this._initialSelection = i;
    }
    __extends(t, e);

    t.prototype.getEditOperations = function(t, n) {
      e.prototype.getEditOperations.call(this, t, n);

      this._selectionId = n.trackSelection(this._initialSelection);
    };

    t.prototype.computeCursorState = function(e, t) {
      return t.getTrackedSelection(this._selectionId);
    };

    return t;
  }(i);
  t.ReplaceCommandThatPreservesSelection = s;
});