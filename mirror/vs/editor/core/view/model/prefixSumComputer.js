define("vs/editor/core/view/model/prefixSumComputer", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e) {
      this.values = e;

      this.prefixSum = [];
      for (var t = 0, n = this.values.length; n > t; t++) {
        this.prefixSum[t] = 0;
      }
      this.prefixSumValidIndex = -1;
    }
    e.prototype.getCount = function() {
      return this.values.length;
    };

    e.prototype.insertValue = function(e, t) {
      this.values.splice(e, 0, t);

      this.prefixSum.splice(e, 0, 0);

      e - 1 < this.prefixSumValidIndex && (this.prefixSumValidIndex = e - 1);
    };

    e.prototype.changeValue = function(e, t) {
      this.values[e] !== t && (this.values[e] = t, e - 1 < this.prefixSumValidIndex && (this.prefixSumValidIndex = e -
        1));
    };

    e.prototype.removeValues = function(e, t) {
      this.values.splice(e, t);

      this.prefixSum.splice(e, t);

      e - 1 < this.prefixSumValidIndex && (this.prefixSumValidIndex = e - 1);
    };

    e.prototype.getTotalValue = function() {
      return 0 === this.values.length ? 0 : this.getAccumulatedValue(this.values.length - 1);
    };

    e.prototype.getAccumulatedValue = function(e) {
      if (0 > e) {
        return 0;
      }
      if (e <= this.prefixSumValidIndex) {
        return this.prefixSum[e];
      }
      var t = this.prefixSumValidIndex + 1;
      0 === t && (this.prefixSum[0] = this.values[0], t++);
      for (var n = t; e >= n; n++) {
        this.prefixSum[n] = this.prefixSum[n - 1] + this.values[n];
      }
      this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, e);

      return this.prefixSum[e];
    };

    e.prototype.getIndexOf = function(e, t) {
      for (var n, i, o, r = 0, s = this.values.length - 1; s >= r;)
        if (n = r + (s - r) / 2 | 0, o = this.getAccumulatedValue(n), i = o - this.values[n], i > e) {
          s = n - 1;
        } else {
          if (!(e >= o)) break;
          r = n + 1;
        }
      t.index = n;

      t.remainder = e - i;
    };

    return e;
  }();
  t.PrefixSumComputer = n;
});