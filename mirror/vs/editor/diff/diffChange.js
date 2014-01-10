define(["vs/base/lib/winjs.base"], function(a) {
  var b = {
    Add: 0,
    Remove: 1,
    Change: 2
  }, c = a.Class.define(function(b, c, d, e) {
      this.originalStart = b, this.originalLength = c, this.modifiedStart = d, this.modifiedLength = e
    }, {
      getChangeType: function() {
        return this.originalLength === 0 ? b.Add : this.modifiedLength === 0 ? b.Remove : b.Change
      },
      getOriginalEnd: function() {
        return this.originalStart + this.originalLength
      },
      getModifiedEnd: function() {
        return this.modifiedStart + this.modifiedLength
      }
    });
  return {
    DifferenceType: b,
    DiffChange: c
  }
})