define("vs/editor/core/view/layout/lines/whitespaceComputer", ["require", "exports"], function(e, t) {
  var n = function() {
    function e() {
      this.heights = [];

      this.ids = [];

      this.afterLineNumbers = [];

      this.prefixSum = [];

      this.prefixSumValidIndex = -1;

      this.whitespaceId2Index = {};

      this.lastWhitespaceId = 0;
    }
    e.findInsertionIndex = function(e, t) {
      for (var n, i = 0, o = e.length; o > i;) {
        n = Math.floor((i + o) / 2);
        t < e[n] ? o = n : i = n + 1;
      }
      return i;
    };

    e.prototype.insertWhitespace = function(t, n) {
      var i = ++this.lastWhitespaceId;

      var o = e.findInsertionIndex(this.afterLineNumbers, t);
      this.insertWhitespaceAtIndex(i, o, t, n);

      return i;
    };

    e.prototype.insertWhitespaceAtIndex = function(e, t, n, i) {
      this.heights.splice(t, 0, i);

      this.ids.splice(t, 0, e);

      this.afterLineNumbers.splice(t, 0, n);

      this.prefixSum.splice(t, 0, 0);
      var o;

      var r;
      for (o in this.whitespaceId2Index) {
        if (this.whitespaceId2Index.hasOwnProperty(o)) {
          r = this.whitespaceId2Index[o];
          if (r >= t) {
            this.whitespaceId2Index[o] = r + 1;
          }
        }
      }
      this.whitespaceId2Index[e.toString()] = t;

      this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, t - 1);
    };

    e.prototype.changeWhitespace = function(e, t) {
      var n = e.toString();
      if (this.whitespaceId2Index.hasOwnProperty(n)) {
        var i = this.whitespaceId2Index[n];
        if (this.heights[i] !== t) {
          this.heights[i] = t;
          this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, i - 1);
          return !0;
        }
      }
      return !1;
    };

    e.prototype.changeAfterLineNumberForWhitespace = function(t, n) {
      var i = t.toString();
      if (this.whitespaceId2Index.hasOwnProperty(i)) {
        var o = this.whitespaceId2Index[i];
        if (this.afterLineNumbers[o] !== n) {
          var r = this.heights[o];
          this.removeWhitespace(t);
          var s = e.findInsertionIndex(this.afterLineNumbers, n);
          this.insertWhitespaceAtIndex(t, s, n, r);

          return !0;
        }
      }
      return !1;
    };

    e.prototype.removeWhitespace = function(e) {
      var t = e.toString();
      if (this.whitespaceId2Index.hasOwnProperty(t)) {
        var n = this.whitespaceId2Index[t];
        delete this.whitespaceId2Index[t];

        this.removeWhitespaceAtIndex(n);

        return !0;
      }
      return !1;
    };

    e.prototype.removeWhitespaceAtIndex = function(e) {
      this.heights.splice(e, 1);

      this.ids.splice(e, 1);

      this.afterLineNumbers.splice(e, 1);

      this.prefixSum.splice(e, 1);

      this.prefixSumValidIndex = Math.min(this.prefixSumValidIndex, e - 1);
      var t;

      var n;
      for (t in this.whitespaceId2Index) {
        if (this.whitespaceId2Index.hasOwnProperty(t)) {
          n = this.whitespaceId2Index[t];
          if (n >= e) {
            this.whitespaceId2Index[t] = n - 1;
          }
        }
      }
    };

    e.prototype.onModelLinesDeleted = function(e, t) {
      var n;

      var i;

      var o;
      for (i = 0, o = this.afterLineNumbers.length; o > i; i++) {
        n = this.afterLineNumbers[i];
        n >= e && t >= n ? this.afterLineNumbers[i] = e - 1 : n > t && (this.afterLineNumbers[i] -= t - e + 1);
      }
    };

    e.prototype.onModelLinesInserted = function(e, t) {
      var n;

      var i;

      var o;
      for (i = 0, o = this.afterLineNumbers.length; o > i; i++) {
        n = this.afterLineNumbers[i];
        if (n >= e) {
          this.afterLineNumbers[i] += t - e + 1;
        }
      }
    };

    e.prototype.getTotalHeight = function() {
      return 0 === this.heights.length ? 0 : this.getAccumulatedHeight(this.heights.length - 1);
    };

    e.prototype.getAccumulatedHeight = function(e) {
      var t = Math.max(0, this.prefixSumValidIndex + 1);
      if (0 === t) {
        this.prefixSum[0] = this.heights[0];
        t++;
      }
      for (var n = t; e >= n; n++) {
        this.prefixSum[n] = this.prefixSum[n - 1] + this.heights[n];
      }
      this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, e);

      return this.prefixSum[e];
    };

    e.prototype.getAccumulatedHeightBeforeLineNumber = function(e) {
      var t = this.findLastWhitespaceBeforeLineNumber(e);
      return -1 === t ? 0 : this.getAccumulatedHeight(t);
    };

    e.prototype.findLastWhitespaceBeforeLineNumber = function(e) {
      for (var t, n = this.afterLineNumbers, i = 0, o = n.length - 1; o >= i;)
        if (t = Math.floor((i + o) / 2), n[t] < e) {
          if (t + 1 >= n.length || n[t + 1] >= e) {
            return t;
          }
          i = t + 1;
        } else {
          o = t - 1;
        }
      return -1;
    };

    e.prototype.findFirstWhitespaceAfterLineNumber = function(e) {
      var t = this.findLastWhitespaceBeforeLineNumber(e);

      var n = t + 1;
      return n < this.heights.length ? n : -1;
    };

    e.prototype.getFirstWhitespaceIndexAfterLineNumber = function(e) {
      return this.findFirstWhitespaceAfterLineNumber(e);
    };

    e.prototype.getCount = function() {
      return this.heights.length;
    };

    e.prototype.getAfterLineNumberForWhitespaceIndex = function(e) {
      return this.afterLineNumbers[e];
    };

    e.prototype.getIdForWhitespaceIndex = function(e) {
      return this.ids[e];
    };

    e.prototype.getHeightForWhitespaceIndex = function(e) {
      return this.heights[e];
    };

    return e;
  }();
  t.WhitespaceComputer = n;
});