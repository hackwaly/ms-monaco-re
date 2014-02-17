define('vs/editor/core/view/overlays/linesDecorations/linesDecorations', [
  'require',
  'exports',
  'vs/editor/core/view/viewContext',
  'vs/editor/core/view/viewEventHandler',
  'vs/css!./linesDecorations'
], function(e, t, n, i) {
  var o = function(e) {
    function t(t) {
      e.call(this), this._context = t, this._decorationsLeft = 0, this._decorationsWidth = 0, this._previousRender =
        null, this._context.addEventHandler(this);
    }
    return __extends(t, e), t.prototype.dispose = function() {
      this._context.removeEventHandler(this), this._context = null, this._previousRender = null;
    }, t.prototype.onModelFlushed = function() {
      return !0;
    }, t.prototype.onModelDecorationsChanged = function() {
      return !0;
    }, t.prototype.onModelLinesDeleted = function() {
      return !0;
    }, t.prototype.onModelLineChanged = function() {
      return !0;
    }, t.prototype.onModelLinesInserted = function() {
      return !0;
    }, t.prototype.onCursorPositionChanged = function() {
      return !1;
    }, t.prototype.onCursorSelectionChanged = function() {
      return !1;
    }, t.prototype.onCursorRevealRange = function() {
      return !1;
    }, t.prototype.onConfigurationChanged = function() {
      return !0;
    }, t.prototype.onLayoutChanged = function(e) {
      return this._decorationsLeft = e.decorationsLeft, this._decorationsWidth = e.decorationsWidth, !0;
    }, t.prototype.onScrollChanged = function(e) {
      return e.vertical;
    }, t.prototype.onZonesChanged = function() {
      return !0;
    }, t.prototype.onScrollWidthChanged = function() {
      return !1;
    }, t.prototype.onScrollHeightChanged = function() {
      return !1;
    }, t.prototype._actualRender = function(e) {
      var t, i, o, r, s, a, u, l, c, d, h = [],
        p = 0,
        f = this._context.model.getDecorationsInRange(e.visibleRange),
        g = this._context.configuration.editor.lineHeight.toString(),
        m = {};
      for (r = 0, s = f.length; s > r; r++)
        if (t = f[r], t.options.linesDecorationsClassName)
          if (i = t.range, t.options.isWholeLine)
            for (c = i.startLineNumber; c <= i.endLineNumber; c++)
              e.lineIsVisible(c) && (a = e.getViewportVerticalOffsetForLineNumber(c), m.hasOwnProperty(a.toString()) ||
                (m[a.toString()] = {}), m[a.toString()][t.options.linesDecorationsClassName] = !0);
          else if (o = e.visibleRangesForRange(i, !1))
        for (c = 0, d = o.length; d > c; c++)
          a = o[c].top, m.hasOwnProperty(a.toString()) || (m[a.toString()] = {}), m[a.toString()][t.options.linesDecorationsClassName] = !
            0;
      h.push('<div class="'), h.push(n.ClassNames.LINES_DECORATIONS), h.push('" style="left:'), h.push(this._decorationsLeft
        .toString()), h.push('px;width:'), h.push(this._decorationsWidth.toString()), h.push('px;height:'), h.push(e.scrollHeight
        .toString()), h.push('px;">');
      for (u in m) {
        h.push('<div class="cldr');
        for (l in m[u])
          p++, h.push(' '), h.push(l);
        h.push('" style="top:'), h.push(u), h.push('px;height:'), h.push(g), h.push('px;"></div>');
      }
      return h.push('</div>'), {
        html: h,
        renderedCount: p
      };
    }, t.prototype.shouldCallRender = function() {
      return this.shouldRender;
    }, t.prototype.render = function(e, t) {
      return this.shouldRender && (this._previousRender = this._actualRender(e), this.shouldRender = !1), t && (t.renderedLinesDecorations +=
        this._previousRender.renderedCount), this._previousRender.html;
    }, t;
  }(i.ViewEventHandler);
  t.LinesDecorationsOverlay = o;
})