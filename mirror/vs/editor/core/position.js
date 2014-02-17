define("vs/editor/core/position", ["require", "exports"], function(e, t) {
  function n(e) {
    return e && "number" == typeof e.lineNumber && "number" == typeof e.column;
  }
  t.isIPosition = n;

  (function(e) {
    function t(e) {
      return {
        startLineNumber: e.lineNumber,
        startColumn: e.column,
        endLineNumber: e.lineNumber,
        endColumn: e.column
      };
    }

    function n(e) {
      return {
        lineNumber: e.startLineNumber,
        column: e.startColumn
      };
    }

    function i(e) {
      return {
        lineNumber: e.endLineNumber,
        column: e.endColumn
      };
    }
    e.asEmptyRange = t;

    e.startPosition = n;

    e.endPosition = i;
  })(t.PositionUtils || (t.PositionUtils = {}));
  var i = (t.PositionUtils, function() {
    function e(e, t) {
      this.lineNumber = e;

      this.column = t;
    }
    e.prototype.equals = function(e) {
      return !!e && this.lineNumber === e.lineNumber && this.column === e.column;
    };

    e.prototype.isBefore = function(e) {
      return this.lineNumber < e.lineNumber ? !0 : e.lineNumber < this.lineNumber ? !1 : this.column < e.column;
    };

    e.prototype.isBeforeOrEqual = function(e) {
      return this.lineNumber < e.lineNumber ? !0 : e.lineNumber < this.lineNumber ? !1 : this.column <= e.column;
    };

    e.prototype.clone = function() {
      return new e(this.lineNumber, this.column);
    };

    e.prototype.toString = function() {
      return "(" + this.lineNumber + "," + this.column + ")";
    };

    return e;
  }());
  t.Position = i;
});