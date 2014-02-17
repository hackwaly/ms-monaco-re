var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/view/viewContext", "vs/editor/core/view/viewEventHandler",
  "vs/css!./linesDecorations"
], function(a, b, c, d) {
  var e = c,
    f = d,
    g = function(a) {
      function b(b) {
        a.call(this), this.context = b, this.decorationsLeft = 0, this.decorationsWidth = 0, this.previousRender = [],
          this.context.addEventHandler(this)
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this.context.removeEventHandler(this), this.context = null, this.previousRender = null
      }, b.prototype.onModelFlushed = function() {
        return !0
      }, b.prototype.onModelDecorationsChanged = function(a) {
        return !0
      }, b.prototype.onModelLinesDeleted = function(a) {
        return !0
      }, b.prototype.onModelLineChanged = function(a) {
        return !0
      }, b.prototype.onModelLinesInserted = function(a) {
        return !0
      }, b.prototype.onCursorPositionChanged = function(a) {
        return !1
      }, b.prototype.onCursorSelectionChanged = function(a) {
        return !1
      }, b.prototype.onCursorRevealRange = function(a) {
        return !1
      }, b.prototype.onConfigurationChanged = function(a) {
        return !0
      }, b.prototype.onConfigurationFontChanged = function() {
        return !0
      }, b.prototype.onConfigurationLineHeightChanged = function() {
        return !0
      }, b.prototype.onLayoutChanged = function(a) {
        return this.decorationsLeft = a.decorationsLeft, this.decorationsWidth = a.decorationsWidth, !0
      }, b.prototype.onScrollChanged = function(a) {
        return a.vertical
      }, b.prototype.onZonesChanged = function() {
        return !0
      }, b.prototype.onScrollWidthChanged = function() {
        return !1
      }, b.prototype.onScrollHeightChanged = function(a) {
        return !1
      }, b.prototype.actualRender = function(a) {
        var b = [],
          c = this.context.model.getDecorationsInRange(a.visibleRange),
          d = this.context.configuration.editor.lineHeight.toString(),
          f, g, h, i, j, k = {}, l, m, n, o, p;
        for (i = 0, j = c.length; i < j; i++) {
          f = c[i];
          if (!f.options.linesDecorationsClassName) continue;
          g = f.range;
          if (f.options.isWholeLine)
            for (o = g.startLineNumber; o <= g.endLineNumber; o++) {
              if (!a.lineIsVisible(o)) continue;
              l = a.getViewportVerticalOffsetForLineNumber(o), k.hasOwnProperty(l.toString()) || (k[l.toString()] = {}),
                k[l.toString()][f.options.linesDecorationsClassName] = !0
            } else {
              h = a.visibleRangesForRange(g, !1);
              if (h)
                while (h.next()) l = h.getTop(), k.hasOwnProperty(l.toString()) || (k[l.toString()] = {}), k[l.toString()]
                [f.options.linesDecorationsClassName] = !0
            }
        }
        b.push('<div class="'), b.push(e.ClassNames.LINES_DECORATIONS), b.push('" style="left:'), b.push(this.decorationsLeft
          .toString()), b.push("px;width:"), b.push(this.decorationsWidth.toString()), b.push("px;height:"), b.push(a
          .scrollHeight.toString()), b.push('px;">');
        for (m in k) {
          b.push('<div class="');
          for (n in k[m]) b.push(" "), b.push(n);
          b.push('" style="top:'), b.push(m), b.push("px;height:"), b.push(d), b.push('px;"></div>')
        }
        return b.push("</div>"), b
      }, b.prototype.shouldCallRender = function() {
        return this.shouldRender
      }, b.prototype.render = function(a) {
        return this.shouldRender && (this.previousRender = this.actualRender(a), this.shouldRender = !1), this.previousRender
      }, b
    }(f.ViewEventHandler);
  b.LinesDecorationsOverlay = g
})