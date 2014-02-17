define("vs/editor/core/range", ["require", "exports", "vs/editor/core/position"], function(e, t, n) {
  function i(e) {
    return e && "number" == typeof e.startLineNumber && "number" == typeof e.startColumn && "number" == typeof e.endLineNumber &&
      "number" == typeof e.endColumn;
  }

  function o(e) {
    return e.startLineNumber === e.endLineNumber && e.startColumn === e.endColumn;
  }

  function r(e, t) {
    return t.lineNumber < e.startLineNumber || t.lineNumber > e.endLineNumber ? !1 : t.lineNumber === e.startLineNumber &&
      t.column < e.startColumn ? !1 : t.lineNumber === e.endLineNumber && t.column > e.endColumn ? !1 : !0;
  }

  function s(e, t) {
    return t.startLineNumber < e.startLineNumber || t.endLineNumber < e.startLineNumber ? !1 : t.startLineNumber > e.endLineNumber ||
      t.endLineNumber > e.endLineNumber ? !1 : t.startLineNumber === e.startLineNumber && t.startColumn < e.startColumn ? !
      1 : t.endLineNumber === e.endLineNumber && t.endColumn > e.endColumn ? !1 : !0;
  }

  function a(e, t) {
    var n = e.startLineNumber;

    var i = e.startColumn;

    var o = e.endLineNumber;

    var r = e.endColumn;

    var s = t.startLineNumber;

    var a = t.startColumn;

    var u = t.endLineNumber;

    var l = t.endColumn;
    s > n ? (n = s, i = a) : n === s && (i = Math.max(i, a));

    o > u ? (o = u, r = l) : o === u && (r = Math.min(r, l));

    return n > o ? null : n === o && i > r ? null : new g(n, i, o, r);
  }

  function u(e, t) {
    var n;

    var i;

    var o;

    var r;
    t.startLineNumber < e.startLineNumber ? (n = t.startLineNumber, i = t.startColumn) : t.startLineNumber === e.startLineNumber ?
      (n = t.startLineNumber, i = Math.min(t.startColumn, e.startColumn)) : (n = e.startLineNumber, i = e.startColumn);

    t.endLineNumber > e.endLineNumber ? (o = t.endLineNumber, r = t.endColumn) : t.endLineNumber === e.endLineNumber ?
      (o = t.endLineNumber, r = Math.max(t.endColumn, e.endColumn)) : (o = e.endLineNumber, r = e.endColumn);

    return new g(n, i, o, r);
  }

  function l(e, t) {
    return !!e && !! t && e.startLineNumber === t.startLineNumber && e.startColumn === t.startColumn && e.endLineNumber ===
      t.endLineNumber && e.endColumn === t.endColumn;
  }

  function c(e, t) {
    return e.startLineNumber === t.startLineNumber ? e.startColumn === t.startColumn ? e.endLineNumber === t.endLineNumber ?
      e.endColumn - t.endColumn : e.endLineNumber - t.endLineNumber : e.startColumn - t.startColumn : e.startLineNumber -
      t.startLineNumber;
  }

  function d(e, t) {
    return e.endLineNumber === t.endLineNumber ? e.endColumn === t.endColumn ? e.startLineNumber === t.startLineNumber ?
      e.startColumn - t.startColumn : e.startLineNumber - t.startLineNumber : e.endColumn - t.endColumn : e.endLineNumber -
      t.endLineNumber;
  }

  function h(e) {
    return e.endLineNumber > e.startLineNumber;
  }

  function p(e) {
    return 17 * e.startLineNumber + 23 * e.startColumn + 29 * e.endLineNumber + 37 * e.endColumn;
  }

  function f(e) {
    return new g(e.startLineNumber, e.startColumn, e.endLineNumber, e.endColumn);
  }
  t.isIRange = i;

  t.isEmpty = o;

  t.containsPosition = r;

  t.containsRange = s;

  t.intersectRanges = a;

  t.plusRange = u;

  t.equalsRange = l;

  t.compareRangesUsingStarts = c;

  t.compareRangesUsingEnds = d;

  t.spansMultipleLines = h;

  t.hashCode = p;
  var g = function() {
    function e(e, t, n, i) {
      if (e > n || e === n && t > i) {
        this.startLineNumber = n;
        this.startColumn = i;
        this.endLineNumber = e;
        this.endColumn = t;
      }

      {
        this.startLineNumber = e;
        this.startColumn = t;
        this.endLineNumber = n;
        this.endColumn = i;
      }
    }
    e.prototype.isEmpty = function() {
      return t.isEmpty(this);
    };

    e.prototype.containsPosition = function(e) {
      return t.containsPosition(this, e);
    };

    e.prototype.containsRange = function(e) {
      return t.containsRange(this, e);
    };

    e.prototype.plusRange = function(e) {
      return t.plusRange(this, e);
    };

    e.prototype.intersectRanges = function(e) {
      return t.intersectRanges(this, e);
    };

    e.prototype.equalsRange = function(e) {
      return t.equalsRange(this, e);
    };

    e.prototype.getEndPosition = function() {
      return new n.Position(this.endLineNumber, this.endColumn);
    };

    e.prototype.getStartPosition = function() {
      return new n.Position(this.startLineNumber, this.startColumn);
    };

    e.prototype.cloneRange = function() {
      return new e(this.startLineNumber, this.startColumn, this.endLineNumber, this.endColumn);
    };

    e.prototype.toString = function() {
      return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn +
        "]";
    };

    e.prototype.setEndPosition = function(t, n) {
      return new e(this.startLineNumber, this.startColumn, t, n);
    };

    e.prototype.setStartPosition = function(t, n) {
      return new e(t, n, this.endLineNumber, this.endColumn);
    };

    return e;
  }();
  t.Range = g;

  t.create = f;
});