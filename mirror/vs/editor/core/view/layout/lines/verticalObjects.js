define(["require", "exports", "vs/editor/core/view/layout/lines/lineHeightComputer",
  "vs/editor/core/view/layout/lines/whitespaceComputer"
], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function() {
    function a() {
      this.lines = new e.LineHeightComputer;

      this.whitespaces = new f.WhitespaceComputer;
    }
    a.prototype._estimateLineHeight = function(a, b, c, d) {
      if (b === -1) {
        return 1;
      }
      if (d !== -1) {
        a = Math.min(a, d);
      }
      var e = Math.floor(a * c / b);
      return e < 1 ? 1 : e;
    };

    a.prototype.replaceLines = function(a, b) {
      this.lines.replaceLines(a.getLineCount(), !b);
    };

    a.prototype.changeLines = function(a, b) {
      this.lines.changeLines(a, b);
    };

    a.prototype.invalidateLineHeights = function() {
      this.lines.invalidateLineHeights();
    };

    a.prototype.resetLineHeightsAndMarkAsValid = function() {
      this.lines.resetLineHeightsAndMarkAsValid();
    };

    a.prototype.insertWhitespace = function(a, b) {
      return this.whitespaces.insertWhitespace(a, b);
    };

    a.prototype.changeWhitespace = function(a, b) {
      return this.whitespaces.changeWhitespace(a, b);
    };

    a.prototype.changeAfterLineNumberForWhitespace = function(a, b) {
      return this.whitespaces.changeAfterLineNumberForWhitespace(a, b);
    };

    a.prototype.removeWhitespace = function(a) {
      return this.whitespaces.removeWhitespace(a);
    };

    a.prototype.onModelLinesDeleted = function(a, b) {
      this.lines.onModelLinesDeleted(a, b);

      this.whitespaces.onModelLinesDeleted(a, b);
    };

    a.prototype.onModelLineChanged = function(a, b) {
      if (b) {
        this.lines.invalidateLineHeight(a);
      }
    };

    a.prototype.onModelLinesInserted = function(a, b, c) {
      this.lines.onModelLinesInserted(a, b, !c);

      this.whitespaces.onModelLinesInserted(a, b);
    };

    a.prototype.getTotalHeight = function(a) {
      var b = a * this.lines.getTotalHeight();

      var c = this.whitespaces.getTotalHeight();
      return b + c;
    };

    a.prototype.getVerticalOffsetForLineNumber = function(a, b) {
      var c;
      if (a > 1) {
        c = b * this.lines.getAccumulatedHeight(a - 1);
      } else {
        c = 0;
      }
      var d = this.whitespaces.getAccumulatedHeightBeforeLineNumber(a);
      return c + d;
    };

    a.prototype.getHeightForLineNumber = function(a, b) {
      return b * this.lines.getHeight(a);
    };

    a.prototype.getLineNumberAtOrAfterVerticalOffset = function(a, b, c, d) {
      if (typeof c == "undefined") {
        c = 1;
      }

      if (typeof d == "undefined") {
        d = this.lines.getCount();
      }
      var e;

      var f;

      var g;
      while (c < d) {
        e = Math.floor((c + d) / 2);

        f = this.getVerticalOffsetForLineNumber(e, b);

        g = this.getHeightForLineNumber(e, b);
        if (a >= f + g) {
          c = e + 1;
        } else {
          if (a >= f) {
            return e;
          }
          d = e;
        }
      }
      return c;
    };

    a.prototype.getLinesViewportData = function(a, b, c, d, e, f, g, h) {
      var i = this.getLineNumberAtOrAfterVerticalOffset(b, d);
      if (a && a < i) {
        i = a;
      }
      var j = this.lines.getCount();

      var k = this.getVerticalOffsetForLineNumber(i, d);

      var l = this.whitespaces.getFirstWhitespaceIndexAfterLineNumber(i);

      var m = this.whitespaces.getCount();

      var n;

      var o;
      if (l === -1) {
        l = m;
        o = j + 1;
      } else {
        o = this.whitespaces.getAfterLineNumberForWhitespaceIndex(l);
        n = this.whitespaces.getHeightForWhitespaceIndex(l);
      }
      var p = k;

      var q;

      var r = [0];

      var s = [];
      for (var t = i; t <= j; t++) {
        if (this.lines.heightIsAccurate(t)) {
          p += this.getHeightForLineNumber(t, d);
        } else {
          s[t - i] = !0;
          q = this._estimateLineHeight(e.getLineContent(t).length, f, g, h);
          p += q * d;
        }

        r[t + 1 - i] = 0;
        while (o === t) {
          r[t + 1 - i] += n;
          p += n;
          l++;
          if (l >= m) {
            o = j + 1;
          } else {
            o = this.whitespaces.getAfterLineNumberForWhitespaceIndex(l);
            n = this.whitespaces.getHeightForWhitespaceIndex(l);
          }
        }
        if (p > c)
          if (!a || a <= t) {
            j = t;
            break;
          }
      }
      for (var u = 1; u < r.length; u++) {
        r[u] += r[u - 1];
      }
      return {
        startLineNumber: i,
        endLineNumber: j,
        visibleRangesDeltaTop: k - b,
        relativeVerticalOffset: r,
        shouldUpdateHeight: s,
        visibleRange: null
      };
    };

    a.prototype.getVerticalOffsetForWhitespaceIndex = function(a, b) {
      var c;

      var d = this.whitespaces.getAfterLineNumberForWhitespaceIndex(a);

      var c;
      if (d >= 1) {
        c = b * this.lines.getAccumulatedHeight(d);
      } else {
        c = 0;
      }
      var e;
      a > 0 ? e = this.whitespaces.getAccumulatedHeight(a - 1) : e = 0;

      return c + e;
    };

    a.prototype.getWhitespaceIndexAtOrAfterVerticallOffset = function(a, b) {
      var c;

      var d = 0;

      var e = this.whitespaces.getCount() - 1;

      var f;

      var g;
      if (e < 0) {
        return -1;
      }
      var h = this.getVerticalOffsetForWhitespaceIndex(e, b);

      var i = this.whitespaces.getHeightForWhitespaceIndex(e);
      if (a >= h + i) {
        return -1;
      }
      while (d < e) {
        c = Math.floor((d + e) / 2);

        f = this.getVerticalOffsetForWhitespaceIndex(c, b);

        g = this.whitespaces.getHeightForWhitespaceIndex(c);
        if (a >= f + g) {
          d = c + 1;
        } else {
          if (a >= f) {
            return c;
          }
          e = c;
        }
      }
      return d;
    };

    a.prototype.getWhitespaceAtVerticalOffset = function(a, b) {
      var c = this.getWhitespaceIndexAtOrAfterVerticallOffset(a, b);
      if (c < 0) {
        return null;
      }
      if (c >= this.whitespaces.getCount()) {
        return null;
      }
      var d = this.getVerticalOffsetForWhitespaceIndex(c, b);
      if (d >= a) {
        return null;
      }
      var e = this.whitespaces.getHeightForWhitespaceIndex(c);

      var f = this.whitespaces.getIdForWhitespaceIndex(c);

      var g = this.whitespaces.getAfterLineNumberForWhitespaceIndex(c);
      return {
        id: f,
        afterLineNumber: g,
        verticalOffset: d,
        height: e
      };
    };

    a.prototype.getWhitespacesInViewport = function(a, b, c) {
      var d = this.getWhitespaceIndexAtOrAfterVerticallOffset(a, c);

      var e = this.whitespaces.getCount() - 1;
      if (d < 0) {
        return [];
      }
      var f = [];

      var g;

      var h;

      var i;
      for (g = d; g <= e; g++) {
        h = this.getVerticalOffsetForWhitespaceIndex(g, c);

        i = this.whitespaces.getHeightForWhitespaceIndex(g);
        if (h >= b) break;
        f.push({
          id: this.whitespaces.getIdForWhitespaceIndex(g),
          afterLineNumber: this.whitespaces.getAfterLineNumberForWhitespaceIndex(g),
          verticalOffset: h,
          height: i
        });
      }
      return f;
    };

    return a;
  }();
  b.VerticalObjects = g;
});