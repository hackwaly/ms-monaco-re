var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/view/lines/viewLine", "vs/editor/core/view/lines/viewLayer",
  "vs/editor/core/view/viewContext", "vs/editor/core/range", "vs/base/time/schedulers"
], function(a, b, c, d, e, f, g) {
  var h = c;

  var i = d;

  var j = e;

  var k = f;

  var l = g;

  var m = function() {
    function a(a) {
      this.visibleRanges = a;

      this.lastValidIndex = this.visibleRanges.length - 1;

      this.index = -1;
    }
    a.prototype.next = function() {
      return this.index === this.lastValidIndex ? !1 : (this.index++, !0);
    };

    a.prototype.getTop = function() {
      return this.visibleRanges[this.index].top;
    };

    a.prototype.getLeft = function() {
      return this.visibleRanges[this.index].left;
    };

    a.prototype.getWidth = function() {
      return this.visibleRanges[this.index].width;
    };

    a.prototype.getHeight = function() {
      return this.visibleRanges[this.index].height;
    };

    a.prototype.toArray = function() {
      return this.visibleRanges;
    };

    return a;
  }();

  var n = function(a) {
    function b(b, c) {
      var d = this;
      a.call(this, b, c);

      this.domNode.className = j.ClassNames.VIEW_LINES;

      this._maxLineWidth = 0;

      this._asyncUpdateLineWidths = new l.RunOnceScheduler(function() {
        d._updateLineWidths();
      }, 200);

      this._currentVisibleRange = new k.Range(1, 1, 1, 1);

      this._lastCursorRevealRangeVerticallyEvent = null;

      this._lastCursorRevealRangeHorizontallyEvent = null;

      this._context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this._context.removeEventHandler(this);

      this._asyncUpdateLineWidths.dispose();

      a.prototype.dispose.call(this);
    };

    b.prototype.onConfigurationChanged = function(b) {
      var c = a.prototype.onConfigurationChanged.call(this, b);
      if (b.viewWordWrapChanged || b.wrappingColumnChanged) {
        this._maxLineWidth = 0;
      }
      return c;
    };

    b.prototype.onLayoutChanged = function(b) {
      var c = a.prototype.onLayoutChanged.call(this, b);
      this._maxLineWidth = 0;

      return c;
    };

    b.prototype.onModelFlushed = function() {
      var b = a.prototype.onModelFlushed.call(this);
      this._maxLineWidth = 0;

      return b;
    };

    b.prototype.onModelDecorationsChanged = function(b) {
      var c = a.prototype.onModelDecorationsChanged.call(this, b);
      for (var d = 0; d < this._lines.length; d++) {
        this._lines[d].onModelDecorationsChanged();
      }
      return !0;
    };

    b.prototype.onCursorRevealRange = function(a) {
      this._lastCursorRevealRangeVerticallyEvent = a;
      var b = this.computeScrollTopToRevealRange(this._layoutProvider.getCurrentViewport(), this._lastCursorRevealRangeVerticallyEvent
        .range, this._lastCursorRevealRangeVerticallyEvent.revealVerticalInCenter);
      b.isAccurate && (this._lastCursorRevealRangeVerticallyEvent = null);

      a.revealHorizontal && (this._lastCursorRevealRangeHorizontallyEvent = a);

      this._layoutProvider.setScrollTop(b.newScrollTop);

      return !0;
    };

    b.prototype.getPositionFromDOMInfo = function(a, b) {
      var c = this._getLineNumberFromDOMInfo(a);
      if (c === -1) {
        return null;
      }
      if (this._context.model.getLineMaxColumn(c) === 1) {
        return {
          lineNumber: c,
          column: 1
        };
      }
      var d = c - this._rendLineNumberStart;
      if (d < 0 || d >= this._lines.length) {
        return null;
      }
      var e = this._lines[d].getColumnOfNodeOffset(c, a, b);
      return {
        lineNumber: c,
        column: e
      };
    };

    b.prototype._getLineNumberFromDOMInfo = function(a) {
      while (a && a.nodeType === 1) {
        if (a.className === j.ClassNames.VIEW_LINE) {
          return parseInt(a.getAttribute("lineNumber"), 10);
        }
        a = a.parentElement;
      }
      return -1;
    };

    b.prototype.getLineWidth = function(a) {
      var b = a - this._rendLineNumberStart;
      return b < 0 || b >= this._lines.length ? -1 : this._lines[b].getWidth();
    };

    b.prototype.getInnerSpansTopOffset = function(a) {
      var b = a - this._rendLineNumberStart;
      return b < 0 || b >= this._lines.length ? 0 : this._lines[b].getInnerSpansTopOffset();
    };

    b.prototype.visibleRangesForRange2 = function(a, c, d, e) {
      if (this.shouldRender) {
        return null;
      }
      var f = a.endLineNumber;
      a = k.RangeUtils.intersectRanges(a, this._currentVisibleRange);
      if (!a) {
        return null;
      }
      var g;

      var h = [];

      var i;

      var j;

      var l;

      var n;

      var o = this.domNode.getBoundingClientRect();

      var p = o.top - c;

      var q = o.left;
      for (i = a.startLineNumber; i <= a.endLineNumber; i++) {
        j = i - this._rendLineNumberStart;
        if (j < 0 || j >= this._lines.length) continue;
        l = i === a.startLineNumber ? a.startColumn : 1;

        n = i === a.endLineNumber ? a.endColumn : this._context.model.getLineMaxColumn(i);

        g = this._lines[j].getVisibleRangesForRange(i, l, n, p, d, q, this._guardElement);

        if (g && g.length > 0) {
          if (e && i < f) {
            g[g.length - 1].width += b.LINE_FEED_WIDTH;
          }
          h = h.concat(g);
        }
      }
      return h.length === 0 ? null : new m(h);
    };

    b.prototype._createLine = function(a) {
      return h.createLine(this._context, a);
    };

    b.prototype._renderAndUpdateLineHeights = function(b) {
      a.prototype._renderLines.call(this, b);
      var c = b.visibleRangesDeltaTop + "px";
      if (this.domNode.style.top !== c) {
        this.domNode.style.top = c;
      }
      if (this._lastCursorRevealRangeHorizontallyEvent) {
        var d = this.computeScrollLeftToRevealRange(this._lastCursorRevealRangeHorizontallyEvent.range);
        this._lastCursorRevealRangeHorizontallyEvent = null;
        var e = this._context.configuration.getWrappingColumn();

        var f = e === 0;
        if (!this._context.configuration.editor.viewWordWrap && !f) {
          this._ensureMaxLineWidth(d.maxHorizontalOffset);
        }

        this._layoutProvider.setScrollLeft(d.scrollLeft);
      }
      var g = [];

      var h = this._context.configuration.editor.lineHeight;

      var i;

      var j = !1;

      var k;
      for (k = 0; k < this._lines.length; k++) {
        if (b.shouldUpdateHeight[k]) {
          j = !0;
          i = this._lines[k].getHeight();
          g[k] = Math.max(1, Math.round(i / h));
        } else {
          g[k] = 0;
        }
      }
      if (j) {
        this._layoutProvider.updateLineHeights(this._rendLineNumberStart, g);
      }
    };

    b.prototype._updateLineWidths = function() {
      var a;

      var b = 1;

      var c;
      if (!this._context.configuration.editor.viewWordWrap)
        for (a = 0; a < this._lines.length; a++) {
          c = this._lines[a].getWidth();
          b = Math.max(b, c);
        }
      this._ensureMaxLineWidth(b);
    };

    b.prototype.render = function() {
      var a = 0;
      if (this._lastCursorRevealRangeVerticallyEvent) {
        if (this._rendLineNumberStart > this._lastCursorRevealRangeVerticallyEvent.range.endLineNumber) {
          a = this._lastCursorRevealRangeVerticallyEvent.range.endLineNumber;
        } else {
          a = this._lastCursorRevealRangeVerticallyEvent.range.startLineNumber;
        }
      }
      var b = this._layoutProvider.getLinesViewportData(a);
      if (!this.shouldRender) {
        b.visibleRange = this._currentVisibleRange;
        return b;
      }
      this.shouldRender = !1;

      this._renderAndUpdateLineHeights(b);
      if (this._lastCursorRevealRangeVerticallyEvent) {
        var c = this.computeScrollTopToRevealRange(this._layoutProvider.getCurrentViewport(), this._lastCursorRevealRangeVerticallyEvent
          .range, this._lastCursorRevealRangeVerticallyEvent.revealVerticalInCenter);
        this._lastCursorRevealRangeVerticallyEvent = null;
        var d = this._layoutProvider.getScrollTop();
        if (d !== c.newScrollTop) {
          this._layoutProvider.setScrollTop(c.newScrollTop);
          b = this._layoutProvider.getLinesViewportData(0);
          this.shouldRender = !1;
          this._renderAndUpdateLineHeights(b);
        }
      }
      this._asyncUpdateLineWidths.schedule();

      this._currentVisibleRange = new k.Range(0 + this._rendLineNumberStart, 1, this._lines.length - 1 + this._rendLineNumberStart,
        this._context.model.getLineMaxColumn(this._lines.length - 1 + this._rendLineNumberStart));

      b.visibleRange = this._currentVisibleRange;

      return b;
    };

    b.prototype._ensureMaxLineWidth = function(a) {
      if (this._maxLineWidth < a) {
        this._maxLineWidth = a;
        this._layoutProvider.onMaxLineWidthChanged(this._maxLineWidth);
      }
    };

    b.prototype.computeScrollTopToRevealRange = function(a, b, c) {
      var d = a.top;

      var e = a.height;

      var f = d + e;

      var g;

      var h;

      var i;
      g = this._layoutProvider.getVerticalOffsetForLineNumber(b.startLineNumber);

      h = this._layoutProvider.getVerticalOffsetForLineNumber(b.endLineNumber) + this._layoutProvider.heightInPxForLine(
        b.endLineNumber) + this._context.configuration.editor.lineHeight;
      var j = h - g;
      if (this._context.configuration.editor.viewWordWrap) {
        i = !1;
        if (this._currentVisibleRange.containsRange(b)) {
          var k = this.visibleRangesForRange2(b, this._layoutProvider.getVerticalOffsetForLineNumber(this._rendLineNumberStart),
            0, !1);
          if (k) {
            g = Number.MAX_VALUE;

            h = Number.MIN_VALUE;
            while (k.next()) {
              g = Math.min(g, k.getTop());
              h = Math.max(h, k.getTop() + k.getHeight());
            }
            h += this._context.configuration.editor.lineHeight;

            i = !0;
          }
        }
      } else {
        i = !0;
      }
      var l;
      if (c) {
        var m = (g + h) / 2;
        l = Math.max(0, m - e / 2);
      } else {
        l = this.computeMinimumScrolling(d, f, g, h);
      }
      return {
        newScrollTop: l,
        isAccurate: i
      };
    };

    b.prototype.computeScrollLeftToRevealRange = function(a) {
      var c = 0;
      if (a.startLineNumber !== a.endLineNumber) {
        return {
          scrollLeft: 0,
          maxHorizontalOffset: c
        };
      }
      var d = this._layoutProvider.getCurrentViewport();

      var e = d.left;

      var f = e + d.width;

      var g = this.visibleRangesForRange2(a, 0, 0, !1);

      var h = Number.MAX_VALUE;

      var i = 0;
      if (!g) {
        return {
          scrollLeft: e,
          maxHorizontalOffset: c
        };
      }
      while (g.next()) {
        if (g.getLeft() < h) {
          h = g.getLeft();
        }
        if (g.getLeft() + g.getWidth() > i) {
          i = g.getLeft() + g.getWidth();
        }
      }
      c = i;

      h = Math.max(0, h - b.HORIZONTAL_EXTRA_PX);

      i += b.HORIZONTAL_EXTRA_PX;
      var j = this.computeMinimumScrolling(e, f, h, i);
      return {
        scrollLeft: j,
        maxHorizontalOffset: c
      };
    };

    b.prototype.computeMinimumScrolling = function(a, b, c, d) {
      var e = b - a;

      var f = d - c;
      return f < e ? c < a ? c : d > b ? Math.max(0, d - e) : a : c;
    };

    b.LINE_FEED_WIDTH = 10;

    b.HORIZONTAL_EXTRA_PX = 30;

    return b;
  }(i.ViewLayer);
  b.ViewLines = n;
});