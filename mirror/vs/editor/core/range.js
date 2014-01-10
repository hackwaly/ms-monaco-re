define(["require", "exports", "vs/editor/core/position"], function(a, b, c) {
  function e(a) {
    return a && typeof a.startLineNumber == "number" && typeof a.startColumn == "number" && typeof a.endLineNumber ==
      "number" && typeof a.endColumn == "number"
  }

  function h(a) {
    return new g(a.startLineNumber, a.startColumn, a.endLineNumber, a.endColumn)
  }
  var d = c;
  b.isIRange = e;
  var f = function() {
    function a() {}
    return a.isEmpty = function(a) {
      return a.startLineNumber === a.endLineNumber && a.startColumn === a.endColumn
    }, a.containsPosition = function(a, b) {
      return b.lineNumber < a.startLineNumber || b.lineNumber > a.endLineNumber ? !1 : b.lineNumber === a.startLineNumber &&
        b.column < a.startColumn ? !1 : b.lineNumber === a.endLineNumber && b.column > a.endColumn ? !1 : !0
    }, a.containsRange = function(a, b) {
      return b.startLineNumber < a.startLineNumber || b.endLineNumber < a.startLineNumber ? !1 : b.startLineNumber >
        a.endLineNumber || b.endLineNumber > a.endLineNumber ? !1 : b.startLineNumber === a.startLineNumber && b.startColumn <
        a.startColumn ? !1 : b.endLineNumber === a.endLineNumber && b.endColumn > a.endColumn ? !1 : !0
    }, a.intersectRanges = function(a, b) {
      var c = a.startLineNumber,
        d = a.startColumn,
        e = a.endLineNumber,
        f = a.endColumn,
        h = b.startLineNumber,
        i = b.startColumn,
        j = b.endLineNumber,
        k = b.endColumn;
      return c < h ? (c = h, d = i) : c === h && (d = Math.max(d, i)), e > j ? (e = j, f = k) : e === j && (f = Math.min(
        f, k)), c > e ? null : c === e && d > f ? null : new g(c, d, e, f)
    }, a.plusRange = function(a, b) {
      var c, d, e, f;
      return b.startLineNumber < a.startLineNumber ? (c = b.startLineNumber, d = b.startColumn) : b.startLineNumber ===
        a.startLineNumber ? (c = b.startLineNumber, d = Math.min(b.startColumn, a.startColumn)) : (c = a.startLineNumber,
          d = a.startColumn), b.endLineNumber > a.endLineNumber ? (e = b.endLineNumber, f = b.endColumn) : b.endLineNumber ===
        a.endLineNumber ? (e = b.endLineNumber, f = Math.max(b.endColumn, a.endColumn)) : (e = a.endLineNumber, f = a
          .endColumn), new g(c, d, e, f)
    }, a.equalsRange = function(a, b) {
      return !!a && !! b && a.startLineNumber === b.startLineNumber && a.startColumn === b.startColumn && a.endLineNumber ===
        b.endLineNumber && a.endColumn === b.endColumn
    }, a.compareRangesUsingStarts = function(a, b) {
      if (a.startLineNumber === b.startLineNumber) return a.startColumn === b.startColumn ? a.endLineNumber === b.endLineNumber ?
        a.endColumn - b.endColumn : a.endLineNumber - b.endLineNumber : a.startColumn - b.startColumn;
      return a.startLineNumber - b.startLineNumber
    }, a.compareRangesUsingEnds = function(a, b) {
      if (a.endLineNumber === b.endLineNumber) return a.endColumn === b.endColumn ? a.startLineNumber === b.startLineNumber ?
        a.startColumn - b.startColumn : a.startLineNumber - b.startLineNumber : a.endColumn - b.endColumn;
      return a.endLineNumber - b.endLineNumber
    }, a
  }();
  b.RangeUtils = f;
  var g = function() {
    function a(a, b, c, d) {
      a > c || a === c && b > d ? (this.startLineNumber = c, this.startColumn = d, this.endLineNumber = a, this.endColumn =
        b) : (this.startLineNumber = a, this.startColumn = b, this.endLineNumber = c, this.endColumn = d)
    }
    return a.prototype.isEmpty = function() {
      return f.isEmpty(this)
    }, a.prototype.containsPosition = function(a) {
      return f.containsPosition(this, a)
    }, a.prototype.containsRange = function(a) {
      return f.containsRange(this, a)
    }, a.prototype.plusRange = function(a) {
      return f.plusRange(this, a)
    }, a.prototype.equalsRange = function(a) {
      return f.equalsRange(this, a)
    }, a.prototype.getEndPosition = function() {
      return new d.Position(this.endLineNumber, this.endColumn)
    }, a.prototype.getStartPosition = function() {
      return new d.Position(this.startLineNumber, this.startColumn)
    }, a.prototype.cloneRange = function() {
      return new a(this.startLineNumber, this.startColumn, this.endLineNumber, this.endColumn)
    }, a.prototype.toString = function() {
      return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn +
        "]"
    }, a.prototype.setEndPosition = function(b, c) {
      return new a(this.startLineNumber, this.startColumn, b, c)
    }, a.prototype.setStartPosition = function(b, c) {
      return new a(b, c, this.endLineNumber, this.endColumn)
    }, a
  }();
  b.Range = g, b.create = h
})