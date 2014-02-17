define(["require", "exports"], function(a, b) {
  var c = function() {
    function a() {
      this.heights = [], this.isAccurate = [], this.prefixSum = [], this.prefixSumValidIndex = 0
    }
    return a.prototype.replaceLines = function(a, b) {
      this.heights = [];
      for (var c = 1; c <= a; c++) this.heights[c] = 1;
      if (b) {
        this.isAccurate = [];
        for (var c = 0; c < this.heights.length; c++) this.isAccurate[c] = !0
      } else this.isAccurate = new Array(this.heights.length);
      this.prefixSum = [], this.prefixSumValidIndex = 0
    }, a.prototype.changeLines = function(a, b) {
      var c, d, e = !1;
      for (c = 0; c < b.length; c++) {
        if (b[c] === 0) continue;
        d = a + c, e ? this.heights[d] = b[c] : this.heights[d] !== b[c] && (this.heights[d] = b[c], this.prefixSumValidIndex =
          Math.min(this.prefixSumValidIndex, d - 1), e = !0), this.isAccurate[d] = !0
      }
    }, a.prototype.invalidateLineHeights = function() {
      this.isAccurate = new Array(this.heights.length)
    }, a.prototype.invalidateLineHeight = function(a) {
      this.isAccurate[a] = !1
    }, a.prototype.resetLineHeightsAndMarkAsValid = function() {
      var a, b;
      for (a = 0, b = this.heights.length; a < b; a++) this.heights[a] = 1;
      for (a = 0, b = this.isAccurate.length; a < b; a++) this.isAccurate[a] = !0;
      this.prefixSumValidIndex = 0
    }, a.prototype.onModelLinesDeleted = function(a, b) {
      this.heights.splice(a, b - a + 1), this.isAccurate.splice(a, b - a + 1), this.prefixSum.splice(a, b - a + 1),
        this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, a - 1)
    }, a.prototype.onModelLinesInserted = function(a, b, c) {
      for (var d = a; d <= b; d++) this.heights.splice(d, 0, 1), this.isAccurate.splice(d, 0, c), this.prefixSum.splice(
        d, 0, 1);
      this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, a - 1)
    }, a.prototype.getCount = function() {
      return this.heights.length - 1
    }, a.prototype.getTotalHeight = function() {
      return this.heights.length === 0 ? 0 : this.getAccumulatedHeight(this.heights.length - 1)
    }, a.prototype.getAccumulatedHeight = function(a) {
      var b = Math.max(1, this.prefixSumValidIndex + 1);
      b === 1 && (this.prefixSum[1] = this.heights[1], b++);
      for (var c = b; c <= a; c++) this.prefixSum[c] = this.prefixSum[c - 1] + this.heights[c];
      return this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, a), this.prefixSum[a]
    }, a.prototype.getHeight = function(a) {
      return this.heights[a]
    }, a.prototype.heightIsAccurate = function(a) {
      return !!this.isAccurate[a]
    }, a
  }() b.LineHeightComputer = c
})