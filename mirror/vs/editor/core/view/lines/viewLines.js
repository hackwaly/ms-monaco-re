define("vs/editor/core/view/lines/viewLines", ["require", "exports", "vs/editor/core/view/lines/viewLine",
  "vs/editor/core/view/lines/viewLayer", "vs/editor/core/view/viewContext", "vs/editor/core/range",
  "vs/base/time/schedulers"
], function(e, t, n, i, o, r, s) {
  var a = function(e) {
    function t(t, n) {
      var i = this;
      e.call(this, t, n);

      this.domNode.className = o.ClassNames.VIEW_LINES;

      this._maxLineWidth = 0;

      this._asyncUpdateLineWidths = new s.RunOnceScheduler(function() {
        i._updateLineWidths();
      }, 200);

      this._currentVisibleRange = new r.Range(1, 1, 1, 1);

      this._lastCursorRevealRangeHorizontallyEvent = null;

      this._context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._context.removeEventHandler(this);

      this._asyncUpdateLineWidths.dispose();

      e.prototype.dispose.call(this);
    };

    t.prototype.onConfigurationChanged = function(t) {
      var n = e.prototype.onConfigurationChanged.call(this, t);
      t.wrappingColumn && (this._maxLineWidth = 0);

      return n;
    };

    t.prototype.onLayoutChanged = function(t) {
      var n = e.prototype.onLayoutChanged.call(this, t);
      this._maxLineWidth = 0;

      return n;
    };

    t.prototype.onModelFlushed = function() {
      var t = e.prototype.onModelFlushed.call(this);
      this._maxLineWidth = 0;

      return t;
    };

    t.prototype.onModelDecorationsChanged = function(t) {
      for (var n = e.prototype.onModelDecorationsChanged.call(this, t), i = 0; i < this._lines.length; i++) {
        this._lines[i].onModelDecorationsChanged();
      }
      return n || !0;
    };

    t.prototype.onCursorRevealRange = function(e) {
      var t = this._computeScrollTopToRevealRange(this._layoutProvider.getCurrentViewport(), e.range, e.revealVerticalInCenter);
      e.revealHorizontal && (this._lastCursorRevealRangeHorizontallyEvent = e);

      this._layoutProvider.setScrollTop(t);

      return !0;
    };

    t.prototype.getPositionFromDOMInfo = function(e, t) {
      var n = this._getLineNumberFromDOMInfo(e);
      if (-1 === n) {
        return null;
      }
      if (1 === this._context.model.getLineMaxColumn(n)) {
        return {
          lineNumber: n,
          column: 1
        };
      }
      var i = n - this._rendLineNumberStart;
      if (0 > i || i >= this._lines.length) {
        return null;
      }
      var o = this._lines[i].getColumnOfNodeOffset(n, e, t);
      return {
        lineNumber: n,
        column: o
      };
    };

    t.prototype._getLineNumberFromDOMInfo = function(e) {
      for (; e && 1 === e.nodeType;) {
        if (e.className === o.ClassNames.VIEW_LINE) {
          return parseInt(e.getAttribute("lineNumber"), 10);
        }
        e = e.parentElement;
      }
      return -1;
    };

    t.prototype.getLineWidth = function(e) {
      var t = e - this._rendLineNumberStart;
      return 0 > t || t >= this._lines.length ? -1 : this._lines[t].getWidth();
    };

    t.prototype.visibleRangesForRange2 = function(e, n, i) {
      if (this.shouldRender) {
        return null;
      }
      var o = e.endLineNumber;
      if (e = r.intersectRanges(e, this._currentVisibleRange), !e) {
        return null;
      }
      var s;

      var a;

      var u;

      var l;

      var c;

      var d;

      var h;

      var p = [];

      var f = this._context.configuration.editor.lineHeight;

      var g = this.domNode.getBoundingClientRect();

      var m = g.top;

      var v = g.left;
      for (i && (h = this._context.model.convertViewPositionToModelPosition(e.startLineNumber, 1).lineNumber), a = e.startLineNumber; a <=
        e.endLineNumber; a++)
        if (u = a - this._rendLineNumberStart, !(0 > u || u >= this._lines.length) && (l = a === e.startLineNumber ?
          e.startColumn : 1, c = a === e.endLineNumber ? e.endColumn : this._context.model.getLineMaxColumn(a), s =
          this._lines[u].getVisibleRangesForRange(a, l, c, m, v, this._guardElement), s && s.length > 0)) {
          for (var y = 0, _ = s.length; _ > y; y++) {
            s[y].top = (s[y].top / f + .5 | 0) * f + n;
            s[y].height = f;
          }
          if (i && o > a) {
            d = h;
            h = this._context.model.convertViewPositionToModelPosition(a + 1, 1).lineNumber;
            if (d !== h) {
              s[s.length - 1].width += t.LINE_FEED_WIDTH;
            }
          }

          p = p.concat(s);
        }
      return 0 === p.length ? null : p;
    };

    t.prototype._createLine = function(e) {
      return n.createLine(this._context, e);
    };

    t.prototype._renderAndUpdateLineHeights = function(t, n) {
      e.prototype._renderLines.call(this, t, n);

      this._currentVisibleRange = new r.Range(0 + this._rendLineNumberStart, 1, this._lines.length - 1 + this._rendLineNumberStart,
        this._context.model.getLineMaxColumn(this._lines.length - 1 + this._rendLineNumberStart));
      var i = t.visibleRangesDeltaTop + "px";
      if (this.domNode.style.top !== i && (this.domNode.style.top = i), this._lastCursorRevealRangeHorizontallyEvent) {
        var o = this._computeScrollLeftToRevealRange(this._lastCursorRevealRangeHorizontallyEvent.range);
        this._lastCursorRevealRangeHorizontallyEvent = null;
        var s = this._context.configuration.getWrappingColumn();

        var a = 0 === s;
        if (!a) {
          this._ensureMaxLineWidth(o.maxHorizontalOffset);
        }

        this._layoutProvider.setScrollLeft(o.scrollLeft);
      }
    };

    t.prototype._updateLineWidths = function() {
      var e;

      var t;

      var n = 1;
      for (e = 0; e < this._lines.length; e++) {
        t = this._lines[e].getWidth();
        n = Math.max(n, t);
      }
      this._ensureMaxLineWidth(n);
    };

    t.prototype.render = function(e) {
      var t = this._layoutProvider.getLinesViewportData();
      this.shouldRender && (this.shouldRender = !1, this._renderAndUpdateLineHeights(t, e), this._asyncUpdateLineWidths
        .schedule());

      t.visibleRange = this._currentVisibleRange;

      return t;
    };

    t.prototype._ensureMaxLineWidth = function(e) {
      if (this._maxLineWidth < e) {
        this._maxLineWidth = e;
        this._layoutProvider.onMaxLineWidthChanged(this._maxLineWidth);
      }
    };

    t.prototype._computeScrollTopToRevealRange = function(e, t, n) {
      var i;

      var o;

      var r = e.top;

      var s = e.height;

      var a = r + s;
      i = this._layoutProvider.getVerticalOffsetForLineNumber(t.startLineNumber);

      o = this._layoutProvider.getVerticalOffsetForLineNumber(t.endLineNumber) + this._layoutProvider.heightInPxForLine(
        t.endLineNumber);

      if (!n) {
        o += this._context.configuration.editor.lineHeight;
      }
      var u;
      if (n) {
        var l = (i + o) / 2;
        u = Math.max(0, l - s / 2);
      } else {
        u = this._computeMinimumScrolling(r, a, i, o);
      }
      return u;
    };

    t.prototype._computeScrollLeftToRevealRange = function(e) {
      var n = 0;
      if (e.startLineNumber !== e.endLineNumber) {
        return {
          scrollLeft: 0,
          maxHorizontalOffset: n
        };
      }
      var i = this._layoutProvider.getCurrentViewport();

      var o = i.left;

      var r = o + i.width;

      var s = this.visibleRangesForRange2(e, 0, !1);

      var a = Number.MAX_VALUE;

      var u = 0;
      if (!s) {
        return {
          scrollLeft: o,
          maxHorizontalOffset: n
        };
      }
      var l;

      var c;
      for (l = 0; l < s.length; l++) {
        c = s[l];
        if (c.left < a) {
          a = c.left;
        }
        if (c.left + c.width > u) {
          u = c.left + c.width;
        }
      }
      n = u;

      a = Math.max(0, a - t.HORIZONTAL_EXTRA_PX);

      u += this._context.configuration.editor.revealHorizontalRightPadding;
      var d = this._computeMinimumScrolling(o, r, a, u);
      return {
        scrollLeft: d,
        maxHorizontalOffset: n
      };
    };

    t.prototype._computeMinimumScrolling = function(e, t, n, i) {
      var o = t - e;

      var r = i - n;
      return o > r ? e > n ? n : i > t ? Math.max(0, i - o) : e : n;
    };

    t.LINE_FEED_WIDTH = 10;

    t.HORIZONTAL_EXTRA_PX = 30;

    return t;
  }(i.ViewLayer);
  t.ViewLines = a;
});