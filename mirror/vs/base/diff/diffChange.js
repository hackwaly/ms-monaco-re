define("vs/base/diff/diffChange", ["require", "exports"], function(e, t) {
  t.DifferenceType = {
    Add: 0,
    Remove: 1,
    Change: 2
  };
  var n = function() {
    function e(e, t, n, i) {
      this.originalStart = e;

      this.originalLength = t;

      this.modifiedStart = n;

      this.modifiedLength = i;
    }
    e.prototype.getChangeType = function() {
      return 0 === this.originalLength ? t.DifferenceType.Add : 0 === this.modifiedLength ? t.DifferenceType.Remove :
        t.DifferenceType.Change;
    };

    e.prototype.getOriginalEnd = function() {
      return this.originalStart + this.originalLength;
    };

    e.prototype.getModifiedEnd = function() {
      return this.modifiedStart + this.modifiedLength;
    };

    return e;
  }();
  t.DiffChange = n;
});