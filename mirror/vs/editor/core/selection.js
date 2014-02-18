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

define(["require", "exports", "vs/editor/core/range", "vs/editor/editor"], function(a, b, c, d) {
  function g(a) {
    return a && typeof a.selectionStartLineNumber == "number" && typeof a.selectionStartColumn == "number" && typeof a
      .positionLineNumber == "number" && typeof a.positionColumn == "number";
  }

  function h(a, b, c, d, e) {
    return e === f.SelectionDirection.LTR ? new i(a, b, c, d) : new i(c, d, a, b);
  }
  var e = c;

  var f = d;
  b.isISelection = g;

  b.createWithDirection = h;
  var i = function(a) {
    function b(b, c, d, e) {
      this.selectionStartLineNumber = b;

      this.selectionStartColumn = c;

      this.positionLineNumber = d;

      this.positionColumn = e;

      a.call(this, b, c, d, e);
    }
    __extends(b, a);

    b.prototype.clone = function() {
      return new b(this.selectionStartLineNumber, this.selectionStartColumn, this.positionLineNumber, this.positionColumn);
    };

    b.prototype.equalsSelection = function(a) {
      return this.selectionStartLineNumber === a.selectionStartLineNumber && this.selectionStartColumn === a.selectionStartColumn &&
        this.positionLineNumber === a.positionLineNumber && this.positionColumn === a.positionColumn;
    };

    b.prototype.getDirection = function() {
      return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ?
        f.SelectionDirection.LTR : f.SelectionDirection.RTL;
    };

    b.prototype.setEndPosition = function(a, c) {
      return this.getDirection() === f.SelectionDirection.LTR ? new b(this.startLineNumber, this.startColumn, a, c) :
        new b(a, c, this.startLineNumber, this.startColumn);
    };

    b.prototype.setStartPosition = function(a, c) {
      return this.getDirection() === f.SelectionDirection.LTR ? new b(a, c, this.endLineNumber, this.endColumn) : new b(
        this.endLineNumber, this.endColumn, a, c);
    };

    return b;
  }(e.Range);
  b.Selection = i;
});