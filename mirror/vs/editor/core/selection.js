define("vs/editor/core/selection", ["require", "exports", "vs/editor/core/range", "vs/editor/editor"], function(e, t, n) {
  function i(e) {
    return e && "number" == typeof e.selectionStartLineNumber && "number" == typeof e.selectionStartColumn &&
      "number" == typeof e.positionLineNumber && "number" == typeof e.positionColumn;
  }

  function o(e, t, n, i, o) {
    return 0 === o ? new r(e, t, n, i) : new r(n, i, e, t);
  }
  t.isISelection = i;

  t.createWithDirection = o;
  var r = function(e) {
    function t(t, n, i, o) {
      this.selectionStartLineNumber = t;

      this.selectionStartColumn = n;

      this.positionLineNumber = i;

      this.positionColumn = o;

      e.call(this, t, n, i, o);
    }
    __extends(t, e);

    t.prototype.clone = function() {
      return new t(this.selectionStartLineNumber, this.selectionStartColumn, this.positionLineNumber, this.positionColumn);
    };

    t.prototype.equalsSelection = function(e) {
      return this.selectionStartLineNumber === e.selectionStartLineNumber && this.selectionStartColumn === e.selectionStartColumn &&
        this.positionLineNumber === e.positionLineNumber && this.positionColumn === e.positionColumn;
    };

    t.prototype.getDirection = function() {
      return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ?
        0 : 1;
    };

    t.prototype.setEndPosition = function(e, n) {
      return 0 === this.getDirection() ? new t(this.startLineNumber, this.startColumn, e, n) : new t(e, n, this.startLineNumber,
        this.startColumn);
    };

    t.prototype.setStartPosition = function(e, n) {
      return 0 === this.getDirection() ? new t(e, n, this.endLineNumber, this.endColumn) : new t(this.endLineNumber,
        this.endColumn, e, n);
    };

    return t;
  }(n.Range);
  t.Selection = r;
});