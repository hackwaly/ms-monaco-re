define("vs/editor/core/view/overlays/decorations/decorations", ["require", "exports",
  "vs/editor/core/view/viewEventHandler", "vs/css!./decorations"
], function(e, t, n) {
  var i = function(e) {
    function t(t) {
      e.call(this);

      this._context = t;

      this._contentLeft = 0;

      this._previousRender = null;

      this._horizontalScrollChanged = !1;

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
      this._contentLeft = e.contentLeft;

      return !0;
    };

    t.prototype.onScrollChanged = function(e) {
      e.horizontal && (this._horizontalScrollChanged = !0);

      return e.vertical;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onScrollWidthChanged = function() {
      return !0;
    };

    t.prototype.onScrollHeightChanged = function() {
      return !1;
    };

    t.prototype._actualRender = function(e) {
      var t;

      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c;

      var d = [];

      var h = [];

      var p = [];

      var f = this._context.model.getDecorationsInRange(e.visibleRange);

      var g = this._context.configuration.editor.lineHeight.toString();

      var m = 0;
      for (d.push('<div class="decorations-layer" style="left:'), d.push(this._contentLeft.toString()), d.push(
        "px;width:"), d.push(e.scrollWidth.toString()), d.push("px;height:"), d.push(e.scrollHeight.toString()), d.push(
        'px;">'), a = 0, u = f.length; u > a; a++)
        if (t = f[a], n = t.range, t.options.className)
          if (t.options.isWholeLine)
            for (l = n.startLineNumber; l <= n.endLineNumber; l++) e.lineIsVisible(l) && (r = e.heightInPxForLine(l),
              s = e.getViewportVerticalOffsetForLineNumber(l), m++, d.push('<div class="cdr '), d.push(t.options.className),
              d.push('" style="top:'), d.push(s.toString()), d.push("px;left:0;width:100%;height:"), d.push(r.toString()),
              d.push('px;"></div>'));
          else if (i = e.visibleRangesForRange(n, !1))
        for (l = 0, c = i.length; c > l; l++) o = i[l];

      m++;

      d.push('<div class="cdr ');

      d.push(t.options.className);

      d.push('" style="top:');

      d.push(o.top.toString());

      d.push("px;left:");

      h.push(o.left);

      p.push(d.length);

      d.push((o.left - e.viewportLeft).toString());

      d.push("px;width:");

      d.push(o.width.toString());

      d.push("px;height:");

      d.push(g.toString());

      d.push('px;"></div>');
      d.push("</div>");

      return {
        html: d,
        lefts: h,
        leftsIndices: p,
        piecesCount: m
      };
    };

    t.prototype.shouldCallRender = function() {
      return this.shouldRender || this._horizontalScrollChanged;
    };

    t.prototype.render = function(e, t) {
      if (this.shouldRender) this._previousRender = this._actualRender(e);

      this.shouldRender = !1;

      this._horizontalScrollChanged = !1;
      else if (this._horizontalScrollChanged) {
        var n;

        var i;

        var o = this._previousRender.html;

        var r = this._previousRender.lefts;

        var s = this._previousRender.leftsIndices;
        for (n = 0, i = r.length; i > n; n++) o[s[n]] = (r[n] - e.viewportLeft).toString();
        this._horizontalScrollChanged = !1;
      }
      t && (t.renderedDecorationsPieces += this._previousRender.piecesCount);

      return this._previousRender.html;
    };

    return t;
  }(n.ViewEventHandler);
  t.DecorationsOverlay = i;
});