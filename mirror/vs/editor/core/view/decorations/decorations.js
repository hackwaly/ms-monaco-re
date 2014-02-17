var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/view/viewEventHandler", "vs/css!./decorations"], function(a, b, c) {
  var d = c;

  var e = function(a) {
    function b(b) {
      a.call(this);

      this.context = b;

      this.contentLeft = 0;

      this.previousRender = null;

      this.horizontalScrollChanged = !1;

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.context = null;

      this.previousRender = null;
    };

    b.prototype.onModelFlushed = function() {
      return !0;
    };

    b.prototype.onModelDecorationsChanged = function(a) {
      return !0;
    };

    b.prototype.onModelLinesDeleted = function(a) {
      return !0;
    };

    b.prototype.onModelLineChanged = function(a) {
      return !0;
    };

    b.prototype.onModelLinesInserted = function(a) {
      return !0;
    };

    b.prototype.onCursorPositionChanged = function(a) {
      return !1;
    };

    b.prototype.onCursorSelectionChanged = function(a) {
      return !1;
    };

    b.prototype.onCursorRevealRange = function(a) {
      return !1;
    };

    b.prototype.onConfigurationChanged = function(a) {
      return !0;
    };

    b.prototype.onConfigurationFontChanged = function() {
      return !0;
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      return !0;
    };

    b.prototype.onLayoutChanged = function(a) {
      this.contentLeft = a.contentLeft;

      return !0;
    };

    b.prototype.onScrollChanged = function(a) {
      a.horizontal && (this.horizontalScrollChanged = !0);

      return a.vertical;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onScrollWidthChanged = function() {
      return !0;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      return !1;
    };

    b.prototype.actualRender = function(a) {
      var b = [];

      var c = [];

      var d = [];

      var e = this.context.model.getDecorationsInRange(a.visibleRange);

      var f;

      var g;

      var h;

      var i = this.context.configuration.editor.lineHeight.toString();

      var j;

      var k;

      var l;

      var m;

      var n;
      b.push('<div class="decorations-layer" style="left:');

      b.push(this.contentLeft.toString());

      b.push("px;width:");

      b.push(a.scrollWidth.toString());

      b.push("px;height:");

      b.push(a.scrollHeight.toString());

      b.push('px;">');
      for (l = 0, m = e.length; l < m; l++) {
        f = e[l];

        g = f.range;
        if (!f.options.className) continue;
        if (f.options.isWholeLine)
          for (n = g.startLineNumber; n <= g.endLineNumber; n++) {
            if (!a.lineIsVisible(n)) continue;
            j = a.heightInPxForLine(n);

            k = a.getViewportVerticalOffsetForLineNumber(n);

            b.push('<div class="');

            b.push(f.options.className);

            b.push('" style="top:');

            b.push(k.toString());

            b.push("px;left:0;width:100%;height:");

            b.push(j.toString());

            b.push('px;"></div>');
          } else {
            h = a.visibleRangesForRange(g, !1);
            if (h)
              while (h.next()) b.push('<div class="');

            b.push(f.options.className);

            b.push('" style="top:');

            b.push(h.getTop().toString());

            b.push("px;left:");

            c.push(h.getLeft());

            d.push(b.length);

            b.push((h.getLeft() - a.viewportLeft).toString());

            b.push("px;width:");

            b.push(h.getWidth().toString());

            b.push("px;height:");

            b.push(i.toString());

            b.push('px;"></div>');
          }
      }
      b.push("</div>");

      return {
        html: b,
        lefts: c,
        leftsIndices: d
      };
    };

    b.prototype.shouldCallRender = function() {
      return this.shouldRender || this.horizontalScrollChanged;
    };

    b.prototype.render = function(a) {
      if (this.shouldRender) this.previousRender = this.actualRender(a);

      this.shouldRender = !1;

      this.horizontalScrollChanged = !1;
      else if (this.horizontalScrollChanged) {
        var b;

        var c;

        var d = this.previousRender.html;

        var e = this.previousRender.lefts;

        var f = this.previousRender.leftsIndices;
        for (b = 0, c = e.length; b < c; b++) d[f[b]] = (e[b] - a.viewportLeft).toString();
        this.horizontalScrollChanged = !1;
      }
      return this.previousRender.html;
    };

    return b;
  }(d.ViewEventHandler);
  b.DecorationsOverlay = e;
});