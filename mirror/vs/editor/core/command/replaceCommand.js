var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/selection"], function(a, b, c) {
  var d = c;

  var e = function() {
    function a(a, b) {
      this._range = a;

      this._text = b;
    }
    a.prototype.getEditOperations = function(a, b) {
      b.addEditOperation(this._range, this._text);
    };

    a.prototype.computeCursorState = function(a, b) {
      var c = b.getInverseEditOperations();

      var e = c[0].range;
      return new d.Selection(e.endLineNumber, e.endColumn, e.endLineNumber, e.endColumn);
    };

    return a;
  }();
  b.ReplaceCommand = e;
  var f = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.computeCursorState = function(a, b) {
      var c = b.getInverseEditOperations();

      var e = c[0].range;
      return new d.Selection(e.startLineNumber, e.startColumn, e.startLineNumber, e.startColumn);
    };

    return b;
  }(e);
  b.ReplaceCommandWithoutChangingPosition = f;
  var g = function(a) {
    function b(b, c, d, e) {
      a.call(this, b, c);

      this._columnDeltaOffset = e;

      this._lineNumberDeltaOffset = d;
    }
    __extends(b, a);

    b.prototype.computeCursorState = function(a, b) {
      var c = b.getInverseEditOperations();

      var e = c[0].range;
      return new d.Selection(e.endLineNumber + this._lineNumberDeltaOffset, e.endColumn + this._columnDeltaOffset, e.endLineNumber +
        this._lineNumberDeltaOffset, e.endColumn + this._columnDeltaOffset);
    };

    return b;
  }(e);
  b.ReplaceCommandWithOffsetCursorState = g;
  var h = function(a) {
    function b(b, c, d) {
      a.call(this, b, c);

      this._initialSelection = d;
    }
    __extends(b, a);

    b.prototype.getEditOperations = function(b, c) {
      a.prototype.getEditOperations.call(this, b, c);

      this._selectionId = c.trackSelection(this._initialSelection);
    };

    b.prototype.computeCursorState = function(a, b) {
      return b.getTrackedSelection(this._selectionId);
    };

    return b;
  }(e);
  b.ReplaceCommandThatPreservesSelection = h;
});