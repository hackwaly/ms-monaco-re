define(["require", "exports"], function(a, b) {
  var c = function() {
    function a() {
      this.heights = [], this.ids = [], this.afterLineNumbers = [], this.prefixSum = [], this.prefixSumValidIndex = -
        1, this.whitespaceId2Index = {}, this.lastWhitespaceId = 0
    }
    return a.findInsertionIndex = function(a, b) {
      var c = 0,
        d = a.length,
        e;
      while (c < d) e = Math.floor((c + d) / 2), b < a[e] ? d = e : c = e + 1;
      return c
    }, a.prototype.insertWhitespace = function(b, c) {
      var d = ++this.lastWhitespaceId,
        e = a.findInsertionIndex(this.afterLineNumbers, b);
      return this.insertWhitespaceAtIndex(d, e, b, c), d
    }, a.prototype.insertWhitespaceAtIndex = function(a, b, c, d) {
      this.heights.splice(b, 0, d), this.ids.splice(b, 0, a), this.afterLineNumbers.splice(b, 0, c), this.prefixSum.splice(
        b, 0, 0);
      var e, f;
      for (e in this.whitespaceId2Index) this.whitespaceId2Index.hasOwnProperty(e) && (f = this.whitespaceId2Index[e],
        f >= b && (this.whitespaceId2Index[e] = f + 1));
      this.whitespaceId2Index[a.toString()] = b, this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, b - 1)
    }, a.prototype.changeWhitespace = function(a, b) {
      var c = a.toString();
      if (this.whitespaceId2Index.hasOwnProperty(c)) {
        var d = this.whitespaceId2Index[c];
        if (this.heights[d] !== b) return this.heights[d] = b, this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex,
          d - 1), !0
      }
      return !1
    }, a.prototype.changeAfterLineNumberForWhitespace = function(b, c) {
      var d = b.toString();
      if (this.whitespaceId2Index.hasOwnProperty(d)) {
        var e = this.whitespaceId2Index[d];
        if (this.afterLineNumbers[e] !== c) {
          var f = this.heights[e];
          this.removeWhitespace(b);
          var g = a.findInsertionIndex(this.afterLineNumbers, c);
          return this.insertWhitespaceAtIndex(b, g, c, f), !0
        }
      }
      return !1
    }, a.prototype.removeWhitespace = function(a) {
      var b = a.toString();
      if (this.whitespaceId2Index.hasOwnProperty(b)) {
        var c = this.whitespaceId2Index[b];
        return delete this.whitespaceId2Index[b], this.removeWhitespaceAtIndex(c), !0
      }
      return !1
    }, a.prototype.removeWhitespaceAtIndex = function(a) {
      this.heights.splice(a, 1), this.ids.splice(a, 1), this.afterLineNumbers.splice(a, 1), this.prefixSum.splice(a,
        1), this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, a - 1);
      var b, c;
      for (b in this.whitespaceId2Index) this.whitespaceId2Index.hasOwnProperty(b) && (c = this.whitespaceId2Index[b],
        c >= a && (this.whitespaceId2Index[b] = c - 1))
    }, a.prototype.onModelLinesDeleted = function(a, b) {
      var c, d, e;
      for (d = 0, e = this.afterLineNumbers.length; d < e; d++) c = this.afterLineNumbers[d], a <= c && c <= b ? this
        .afterLineNumbers[d] = a - 1 : c > b && (this.afterLineNumbers[d] -= b - a + 1)
    }, a.prototype.onModelLinesInserted = function(a, b) {
      var c, d, e;
      for (d = 0, e = this.afterLineNumbers.length; d < e; d++) c = this.afterLineNumbers[d], a <= c && (this.afterLineNumbers[
        d] += b - a + 1)
    }, a.prototype.getTotalHeight = function() {
      return this.heights.length === 0 ? 0 : this.getAccumulatedHeight(this.heights.length - 1)
    }, a.prototype.getAccumulatedHeight = function(a) {
      var b = Math.max(0, this.prefixSumValidIndex + 1);
      b === 0 && (this.prefixSum[0] = this.heights[0], b++);
      for (var c = b; c <= a; c++) this.prefixSum[c] = this.prefixSum[c - 1] + this.heights[c];
      return this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, a), this.prefixSum[a]
    }, a.prototype.getAccumulatedHeightBeforeLineNumber = function(a) {
      var b = this.findLastWhitespaceBeforeLineNumber(a);
      return b === -1 ? 0 : this.getAccumulatedHeight(b)
    }, a.prototype.findLastWhitespaceBeforeLineNumber = function(a) {
      var b = this.afterLineNumbers,
        c = 0,
        d = b.length - 1,
        e;
      while (c <= d) {
        e = Math.floor((c + d) / 2);
        if (b[e] < a) {
          if (e + 1 >= b.length || b[e + 1] >= a) return e;
          c = e + 1
        } else d = e - 1
      }
      return -1
    }, a.prototype.findFirstWhitespaceAfterLineNumber = function(a) {
      var b = this.findLastWhitespaceBeforeLineNumber(a),
        c = b + 1;
      return c < this.heights.length ? c : -1
    }, a.prototype.getFirstWhitespaceIndexAfterLineNumber = function(a) {
      return this.findFirstWhitespaceAfterLineNumber(a)
    }, a.prototype.getCount = function() {
      return this.heights.length
    }, a.prototype.getAfterLineNumberForWhitespaceIndex = function(a) {
      return this.afterLineNumbers[a]
    }, a.prototype.getIdForWhitespaceIndex = function(a) {
      return this.ids[a]
    }, a.prototype.getHeightForWhitespaceIndex = function(a) {
      return this.heights[a]
    }, a
  }();
  b.WhitespaceComputer = c
})