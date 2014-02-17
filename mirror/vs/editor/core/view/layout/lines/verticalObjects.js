define("vs/editor/core/view/layout/lines/verticalObjects", ["require", "exports",
  "vs/editor/core/view/layout/lines/whitespaceComputer"
], function(e, t, n) {
  var i = function() {
    function e() {
      this.whitespaces = new n.WhitespaceComputer;
    }
    e.prototype.replaceLines = function(e) {
      this.linesCount = e;
    };

    e.prototype.insertWhitespace = function(e, t) {
      return this.whitespaces.insertWhitespace(e, t);
    };

    e.prototype.changeWhitespace = function(e, t) {
      return this.whitespaces.changeWhitespace(e, t);
    };

    e.prototype.changeAfterLineNumberForWhitespace = function(e, t) {
      return this.whitespaces.changeAfterLineNumberForWhitespace(e, t);
    };

    e.prototype.removeWhitespace = function(e) {
      return this.whitespaces.removeWhitespace(e);
    };

    e.prototype.onModelLinesDeleted = function(e, t) {
      this.linesCount -= t - e + 1;

      this.whitespaces.onModelLinesDeleted(e, t);
    };

    e.prototype.onModelLinesInserted = function(e, t) {
      this.linesCount += t - e + 1;

      this.whitespaces.onModelLinesInserted(e, t);
    };

    e.prototype.getTotalHeight = function(e) {
      var t = e * this.linesCount;

      var n = this.whitespaces.getTotalHeight();
      return t + n;
    };

    e.prototype.getVerticalOffsetForLineNumber = function(e, t) {
      var n;
      n = e > 1 ? t * (e - 1) : 0;
      var i = this.whitespaces.getAccumulatedHeightBeforeLineNumber(e);
      return n + i;
    };

    e.prototype.getLineNumberAtOrAfterVerticalOffset = function(e, t) {
      if (0 > e) {
        return 1;
      }
      for (var n, i, o, r = 1, s = this.linesCount; s > r;)
        if (n = Math.floor((r + s) / 2), i = this.getVerticalOffsetForLineNumber(n, t), o = t, e >= i + o) {
          r = n + 1;
        } else {
          if (e >= i) {
            return n;
          }
          s = n;
        }
      return r > this.linesCount ? this.linesCount : r;
    };

    e.prototype.getCenteredLineInViewport = function(e, t, n) {
      for (var i, o, r = this.getLinesViewportData(e, t, n), s = (t - e) / 2, a = r.visibleRangesDeltaTop, u = r.startLineNumber; u <=
        r.endLineNumber; u++)
        if (i = a + r.relativeVerticalOffset[u - r.startLineNumber], o = i + n, a += n, s >= i && o > s || i > s) {
          return u;
        }
      return r.endLineNumber;
    };

    e.prototype.getLinesViewportData = function(e, t, n) {
      var i;

      var o;

      var r = this.getLineNumberAtOrAfterVerticalOffset(e, n);

      var s = this.linesCount;

      var a = this.getVerticalOffsetForLineNumber(r, n);

      var u = this.whitespaces.getFirstWhitespaceIndexAfterLineNumber(r);

      var l = this.whitespaces.getCount();
      if (-1 === u) {
        u = l;
        o = s + 1;
      } else {
        o = this.whitespaces.getAfterLineNumberForWhitespaceIndex(u);
        i = this.whitespaces.getHeightForWhitespaceIndex(u);
      }
      for (var c = a, d = 0, h = [], p = r; s >= p; p++) {
        for (c += n, h.push(d), d = 0; o === p;) {
          d += i;
          c += i;
          u++;
          if (u >= l) {
            o = s + 1;
          } else {
            o = this.whitespaces.getAfterLineNumberForWhitespaceIndex(u);
            i = this.whitespaces.getHeightForWhitespaceIndex(u);
          }
        }
        if (c > t) {
          s = p;
          break;
        }
      }
      for (var f = 1; f < h.length; f++) {
        h[f] += h[f - 1];
      }
      return {
        startLineNumber: r,
        endLineNumber: s,
        visibleRangesDeltaTop: a - e,
        relativeVerticalOffset: h,
        visibleRange: null
      };
    };

    e.prototype.getVerticalOffsetForWhitespaceIndex = function(e, t) {
      var n;

      var n;

      var i = this.whitespaces.getAfterLineNumberForWhitespaceIndex(e);
      n = i >= 1 ? t * i : 0;
      var o;
      o = e > 0 ? this.whitespaces.getAccumulatedHeight(e - 1) : 0;

      return n + o;
    };

    e.prototype.getWhitespaceIndexAtOrAfterVerticallOffset = function(e, t) {
      var n;

      var i;

      var o;

      var r = 0;

      var s = this.whitespaces.getCount() - 1;
      if (0 > s) {
        return -1;
      }
      var a = this.getVerticalOffsetForWhitespaceIndex(s, t);

      var u = this.whitespaces.getHeightForWhitespaceIndex(s);
      if (e >= a + u) {
        return -1;
      }
      for (; s > r;)
        if (n = Math.floor((r + s) / 2), i = this.getVerticalOffsetForWhitespaceIndex(n, t), o = this.whitespaces.getHeightForWhitespaceIndex(
          n), e >= i + o) {
          r = n + 1;
        } else {
          if (e >= i) {
            return n;
          }
          s = n;
        }
      return r;
    };

    e.prototype.getWhitespaceAtVerticalOffset = function(e, t) {
      var n = this.getWhitespaceIndexAtOrAfterVerticallOffset(e, t);
      if (0 > n) {
        return null;
      }
      if (n >= this.whitespaces.getCount()) {
        return null;
      }
      var i = this.getVerticalOffsetForWhitespaceIndex(n, t);
      if (i > e) {
        return null;
      }
      var o = this.whitespaces.getHeightForWhitespaceIndex(n);

      var r = this.whitespaces.getIdForWhitespaceIndex(n);

      var s = this.whitespaces.getAfterLineNumberForWhitespaceIndex(n);
      return {
        id: r,
        afterLineNumber: s,
        verticalOffset: i,
        height: o
      };
    };

    e.prototype.getWhitespaceViewportData = function(e, t, n) {
      var i = this.getWhitespaceIndexAtOrAfterVerticallOffset(e, n);

      var o = this.whitespaces.getCount() - 1;
      if (0 > i) {
        return [];
      }
      var r;

      var s;

      var a;

      var u = [];
      for (r = i; o >= r && (s = this.getVerticalOffsetForWhitespaceIndex(r, n), a = this.whitespaces.getHeightForWhitespaceIndex(
        r), !(s >= t)); r++) {
        u.push({
          id: this.whitespaces.getIdForWhitespaceIndex(r),
          afterLineNumber: this.whitespaces.getAfterLineNumberForWhitespaceIndex(r),
          verticalOffset: s,
          height: a
        });
      }
      return u;
    };

    return e;
  }();
  t.VerticalObjects = i;
});