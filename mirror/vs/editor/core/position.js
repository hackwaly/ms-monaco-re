define(["require", "exports"], function(a, b) {
  function c(a) {
    return a && typeof a.lineNumber == "number" && typeof a.column == "number"
  }
  b.isIPosition = c;
  var d = function() {
    function a(a, b) {
      this.lineNumber = a, this.column = b
    }
    return a.prototype.equals = function(a) {
      return !!a && this.lineNumber === a.lineNumber && this.column === a.column
    }, a.prototype.isBefore = function(a) {
      return this.lineNumber < a.lineNumber ? !0 : a.lineNumber < this.lineNumber ? !1 : this.column < a.column
    }, a.prototype.isBeforeOrEqual = function(a) {
      return this.lineNumber < a.lineNumber ? !0 : a.lineNumber < this.lineNumber ? !1 : this.column <= a.column
    }, a.prototype.clone = function() {
      return new a(this.lineNumber, this.column)
    }, a.prototype.toString = function() {
      return "(" + this.lineNumber + "," + this.column + ")"
    }, a
  }();
  b.Position = d
})