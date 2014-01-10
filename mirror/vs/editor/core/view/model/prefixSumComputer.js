define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a) {
      this.values = a, this.prefixSum = [];
      for (var b = 0, c = this.values.length; b < c; b++) this.prefixSum[b] = 0;
      this.prefixSumValidIndex = -1
    }
    return a.prototype.getCount = function() {
      return this.values.length
    }, a.prototype.insertValue = function(a, b) {
      this.values.splice(a, 0, b), this.prefixSum.splice(a, 0, 0), a - 1 < this.prefixSumValidIndex && (this.prefixSumValidIndex =
        a - 1)
    }, a.prototype.changeValue = function(a, b) {
      if (this.values[a] === b) return;
      this.values[a] = b, a - 1 < this.prefixSumValidIndex && (this.prefixSumValidIndex = a - 1)
    }, a.prototype.removeValues = function(a, b) {
      this.values.splice(a, b), this.prefixSum.splice(a, b), a - 1 < this.prefixSumValidIndex && (this.prefixSumValidIndex =
        a - 1)
    }, a.prototype.getTotalValue = function() {
      return this.values.length === 0 ? 0 : this.getAccumulatedValue(this.values.length - 1)
    }, a.prototype.getAccumulatedValue = function(a) {
      if (a <= this.prefixSumValidIndex) return this.prefixSum[a];
      var b = this.prefixSumValidIndex + 1;
      b === 0 && (this.prefixSum[0] = this.values[0], b++);
      for (var c = b; c <= a; c++) this.prefixSum[c] = this.prefixSum[c - 1] + this.values[c];
      return this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, a), this.prefixSum[a]
    }, a.prototype.getIndexOf = function(a, b) {
      var c = 0,
        d = this.values.length - 1,
        e, f, g;
      while (c <= d) {
        e = c + (d - c) / 2 | 0, g = this.getAccumulatedValue(e), f = g - this.values[e];
        if (a < f) d = e - 1;
        else {
          if (!(a >= g)) break;
          c = e + 1
        }
      }
      b.index = e, b.remainder = a - f
    }, a
  }();
  b.PrefixSumComputer = c
})