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

define(["require", "exports", "vs/editor/core/view/viewContext", "vs/editor/core/view/viewEventHandler",
  "vs/css!./glyphMargin"
], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function(a) {
    function b(b) {
      a.call(this);

      this.context = b;

      this.glyphMarginLeft = 0;

      this.glyphMarginWidth = 0;

      this.previousRender = [];

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
      this.glyphMarginLeft = a.glyphMarginLeft;

      this.glyphMarginWidth = a.glyphMarginWidth;

      return !0;
    };

    b.prototype.onScrollChanged = function(a) {
      return a.vertical;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      return !1;
    };

    b.prototype.actualRender = function(a) {
      var b = [];
      if (!this.context.configuration.editor.glyphMargin) {
        return b;
      }
      var c = this.context.model.getDecorationsInRange(a.visibleRange);

      var d = this.context.configuration.editor.lineHeight.toString();

      var f;

      var g;

      var h;

      var i;

      var j;

      var k = {};

      var l;

      var m;

      var n;

      var o;

      var p;
      for (i = 0, j = c.length; i < j; i++) {
        f = c[i];
        if (!f.options.glyphMarginClassName) continue;
        g = f.range;
        if (f.options.isWholeLine)
          for (o = g.startLineNumber; o <= g.endLineNumber; o++) {
            if (!a.lineIsVisible(o)) continue;
            l = a.getViewportVerticalOffsetForLineNumber(o);

            if (!k.hasOwnProperty(l.toString())) {
              k[l.toString()] = {};
            }

            k[l.toString()][f.options.glyphMarginClassName] = !0;
          } else {
            h = a.visibleRangesForRange(g, !1);
            if (h)
              while (h.next()) {
                l = h.getTop();
                if (!k.hasOwnProperty(l.toString())) {
                  k[l.toString()] = {};
                }
                k[l.toString()][f.options.glyphMarginClassName] = !0;
              }
          }
      }
      b.push('<div class="');

      b.push(e.ClassNames.GLYPH_MARGIN);

      b.push('" style="left:');

      b.push(this.glyphMarginLeft.toString());

      b.push("px;width:");

      b.push(this.glyphMarginWidth.toString());

      b.push("px;height:");

      b.push(a.scrollHeight.toString());

      b.push('px;">');
      for (m in k) {
        b.push('<div class="');
        for (n in k[m]) {
          b.push(" ");
          b.push(n);
        }
        b.push('" style="top:');

        b.push(m);

        b.push("px;height:");

        b.push(d);

        b.push('px;"></div>');
      }
      b.push("</div>");

      return b;
    };

    b.prototype.shouldCallRender = function() {
      return this.shouldRender;
    };

    b.prototype.render = function(a) {
      this.shouldRender && (this.previousRender = this.actualRender(a), this.shouldRender = !1);

      return this.previousRender;
    };

    return b;
  }(f.ViewEventHandler);
  b.GlyphMarginOverlay = g;
});