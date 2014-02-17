define("vs/editor/core/view/overlays/glyphMargin/glyphMargin", ["require", "exports", "vs/editor/core/view/viewContext",
  "vs/editor/core/view/viewEventHandler", "vs/css!./glyphMargin"
], function(e, t, n, i) {
  var o = function(e) {
    function t(t) {
      e.call(this);

      this._context = t;

      this._glyphMarginLeft = 0;

      this._glyphMarginWidth = 0;

      this._previousRender = null;

      this._context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._context.removeEventHandler(this);

      this._context = null;

      this._previousRender = null;
    };

    t.prototype.onModelFlushed = function() {
      return !0;
    };

    t.prototype.onModelDecorationsChanged = function() {
      return !0;
    };

    t.prototype.onModelLinesDeleted = function() {
      return !0;
    };

    t.prototype.onModelLineChanged = function() {
      return !0;
    };

    t.prototype.onModelLinesInserted = function() {
      return !0;
    };

    t.prototype.onCursorPositionChanged = function() {
      return !1;
    };

    t.prototype.onCursorSelectionChanged = function() {
      return !1;
    };

    t.prototype.onCursorRevealRange = function() {
      return !1;
    };

    t.prototype.onConfigurationChanged = function() {
      return !0;
    };

    t.prototype.onLayoutChanged = function(e) {
      this._glyphMarginLeft = e.glyphMarginLeft;

      this._glyphMarginWidth = e.glyphMarginWidth;

      return !0;
    };

    t.prototype.onScrollChanged = function(e) {
      return e.vertical;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    t.prototype.onScrollHeightChanged = function() {
      return !1;
    };

    t.prototype._actualRender = function(e) {
      var t = [];

      var i = 0;
      if (!this._context.configuration.editor.glyphMargin) {
        return {
          html: t,
          count: i
        };
      }
      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c;

      var d;

      var h;

      var p;

      var f = this._context.model.getDecorationsInRange(e.visibleRange);

      var g = this._context.configuration.editor.lineHeight.toString();

      var m = {};
      for (a = 0, u = f.length; u > a; a++)
        if (o = f[a], o.options.glyphMarginClassName)
          if (r = o.range, o.options.isWholeLine)
            for (h = r.startLineNumber; h <= r.endLineNumber; h++) {
              e.lineIsVisible(h) && (l = e.getViewportVerticalOffsetForLineNumber(h), m.hasOwnProperty(l.toString()) ||
                (m[l.toString()] = {}), m[l.toString()][o.options.glyphMarginClassName] = !0);
            } else if (s = e.visibleRangesForRange(r, !1))
              for (h = 0, p = s.length; p > h; h++) {
                l = s[h].top;
                m.hasOwnProperty(l.toString()) || (m[l.toString()] = {});
                m[l.toString()][o.options.glyphMarginClassName] = !0;
              }
      t.push('<div class="');

      t.push(n.ClassNames.GLYPH_MARGIN);

      t.push('" style="left:');

      t.push(this._glyphMarginLeft.toString());

      t.push("px;width:");

      t.push(this._glyphMarginWidth.toString());

      t.push("px;height:");

      t.push(e.scrollHeight.toString());

      t.push('px;">');
      for (c in m) {
        t.push('<div class="cgmr');
        for (d in m[c]) {
          i++;
          t.push(" ");
          t.push(d);
        }
        t.push('" style="top:');

        t.push(c);

        t.push("px;height:");

        t.push(g);

        t.push('px;"></div>');
      }
      t.push("</div>");

      return {
        html: t,
        count: i
      };
    };

    t.prototype.shouldCallRender = function() {
      return this.shouldRender;
    };

    t.prototype.render = function(e, t) {
      this.shouldRender && (this._previousRender = this._actualRender(e), this.shouldRender = !1);

      t && (t.renderedMarginGlyphs += this._previousRender.count);

      return this._previousRender.html;
    };

    return t;
  }(i.ViewEventHandler);
  t.GlyphMarginOverlay = o;
});