var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/view/viewEventHandler", "vs/css!./selections"], function(a, b, c) {
  var d = c,
    e;
  (function(a) {
    a[a.EXTERN = 0] = "EXTERN", a[a.INTERN = 1] = "INTERN", a[a.FLAT = 2] = "FLAT"
  })(e || (e = {}));
  var f = function(a) {
    function b(b) {
      a.call(this), this.context = b, this.selections = [], this.contentLeft = 0, this.previousRender = null, this.horizontalScrollChanged = !
        1, this.context.addEventHandler(this)
    }
    return __extends(b, a), b.prototype.dispose = function() {
      this.context.removeEventHandler(this), this.context = null, this.selections = null, this.previousRender = null
    }, b.prototype.onModelFlushed = function() {
      return !0
    }, b.prototype.onModelDecorationsChanged = function(a) {
      return !1
    }, b.prototype.onModelLinesDeleted = function(a) {
      return !0
    }, b.prototype.onModelLineChanged = function(a) {
      return !0
    }, b.prototype.onModelLinesInserted = function(a) {
      return !0
    }, b.prototype.onCursorPositionChanged = function(a) {
      return !1
    }, b.prototype.onCursorSelectionChanged = function(a) {
      return this.selections = [a.selection], this.selections = this.selections.concat(a.secondarySelections), !0
    }, b.prototype.onCursorRevealRange = function(a) {
      return !1
    }, b.prototype.onConfigurationChanged = function(a) {
      return !0
    }, b.prototype.onConfigurationFontChanged = function() {
      return !0
    }, b.prototype.onConfigurationLineHeightChanged = function() {
      return !0
    }, b.prototype.onLayoutChanged = function(a) {
      return this.contentLeft = a.contentLeft, !0
    }, b.prototype.onScrollChanged = function(a) {
      return a.horizontal && (this.horizontalScrollChanged = !0), a.vertical
    }, b.prototype.onZonesChanged = function() {
      return !0
    }, b.prototype.onScrollWidthChanged = function() {
      return !1
    }, b.prototype.onScrollHeightChanged = function(a) {
      return !1
    }, b.prototype.visibleRangesHaveGaps = function(a) {
      if (a.length <= 1) return !1;
      var b, c, d, e;
      b = a[0].top;
      for (d = 1, e = a.length; d < e; d++) {
        c = a[d].top;
        if (c === b) return !0;
        b = c
      }
      return !1
    }, b.prototype.enrichVisibleRangesWithStyle = function(a) {
      var b, c, d, f, g, h, i, j, k, l, m;
      for (l = 0, m = a.length; l < m; l++) b = a[l], c = b.left, d = b.left + b.width, j = {
        top: e.EXTERN,
        bottom: e.EXTERN
      }, k = {
        top: e.EXTERN,
        bottom: e.EXTERN
      }, l > 0 && (f = a[l - 1].left, g = a[l - 1].left + a[l - 1].width, c === f ? j.top = e.FLAT : c > f && (j.top =
        e.INTERN), d === g ? k.top = e.FLAT : f < d && d < g && (k.top = e.INTERN)), l + 1 < m && (h = a[l + 1].left,
        i = a[l + 1].left + a[l + 1].width, c === h ? j.bottom = e.FLAT : h < c && c < i && (j.bottom = e.INTERN), d ===
        i ? k.bottom = e.FLAT : d < i && (k.bottom = e.INTERN)), b.startStyle = j, b.endStyle = k
    }, b.prototype.getVisibleRangesWithStyle = function(a, b) {
      var c = b.visibleRangesForRange(a, !0),
        d = c ? c.toArray() : [],
        e = this.visibleRangesHaveGaps(d);
      return !e && this.context.configuration.editor.roundedSelection && this.enrichVisibleRangesWithStyle(d), d
    }, b.prototype.createSelectionPiece = function(a, b, c, d, e, f, g, h, i) {
      g.push('<div class="'), g.push(a), g.push('" style="top:'), g.push(b.toString()), g.push("px;left:"), h.push(c),
        i.push(g.length), g.push((c - f).toString()), g.push("px;width:"), g.push(d.toString()), g.push("px;height:"),
        g.push(e), g.push('px;"></div>')
    }, b.prototype.actualRenderOneSelection = function(a, c, d, f, g) {
      var h = a.length > 0 && a[0].startStyle,
        i, j = this.context.configuration.editor.lineHeight.toString(),
        k, l;
      for (k = 0; k < a.length; k++) {
        l = a[k];
        if (h) {
          if (l.startStyle.top === e.INTERN || l.startStyle.bottom === e.INTERN) this.createSelectionPiece(b.SELECTION_CLASS_NAME,
            l.top, l.left - b.ROUNDED_PIECE_WIDTH, b.ROUNDED_PIECE_WIDTH, j, c, d, f, g), i = b.EDITOR_BACKGROUND_CLASS_NAME,
            l.startStyle.top === e.INTERN && (i += " " + b.SELECTION_TOP_RIGHT), l.startStyle.bottom === e.INTERN &&
            (i += " " + b.SELECTION_BOTTOM_RIGHT), this.createSelectionPiece(i, l.top, l.left - b.ROUNDED_PIECE_WIDTH,
              b.ROUNDED_PIECE_WIDTH, j, c, d, f, g);
          if (l.endStyle.top === e.INTERN || l.endStyle.bottom === e.INTERN) this.createSelectionPiece(b.SELECTION_CLASS_NAME,
            l.top, l.left + l.width, b.ROUNDED_PIECE_WIDTH, j, c, d, f, g), i = b.EDITOR_BACKGROUND_CLASS_NAME, l.endStyle
            .top === e.INTERN && (i += " " + b.SELECTION_TOP_LEFT), l.endStyle.bottom === e.INTERN && (i += " " + b.SELECTION_BOTTOM_LEFT),
            this.createSelectionPiece(i, l.top, l.left + l.width, b.ROUNDED_PIECE_WIDTH, j, c, d, f, g)
        }
        i = b.SELECTION_CLASS_NAME, h && (l.startStyle.top === e.EXTERN && (i += " " + b.SELECTION_TOP_LEFT), l.startStyle
          .bottom === e.EXTERN && (i += " " + b.SELECTION_BOTTOM_LEFT), l.endStyle.top === e.EXTERN && (i += " " + b.SELECTION_TOP_RIGHT),
          l.endStyle.bottom === e.EXTERN && (i += " " + b.SELECTION_BOTTOM_RIGHT)), this.createSelectionPiece(i, l.top,
          l.left, l.width, j, c, d, f, g)
      }
    }, b.prototype.actualRender = function(a) {
      var b = [],
        c = [],
        d = [],
        e, f, g;
      b.push('<div class="selections-layer" style="left:'), b.push(this.contentLeft.toString()), b.push("px;width:"),
        b.push(a.scrollWidth.toString()), b.push("px;height:"), b.push(a.scrollHeight.toString()), b.push('px;">');
      for (g = 0; g < this.selections.length; g++) {
        e = this.selections[g];
        if (e.isEmpty()) continue;
        f = this.getVisibleRangesWithStyle(e, a), this.actualRenderOneSelection(f, a.viewportLeft, b, c, d)
      }
      return b.push("</div>"), {
        html: b,
        lefts: c,
        leftsIndices: d
      }
    }, b.prototype.shouldCallRender = function() {
      return this.shouldRender || this.horizontalScrollChanged
    }, b.prototype.render = function(a) {
      if (this.shouldRender) this.previousRender = this.actualRender(a), this.shouldRender = !1, this.horizontalScrollChanged = !
        1;
      else if (this.horizontalScrollChanged) {
        var b, c, d = this.previousRender.html,
          e = this.previousRender.lefts,
          f = this.previousRender.leftsIndices;
        for (b = 0, c = e.length; b < c; b++) d[f[b]] = (e[b] - a.viewportLeft).toString();
        this.horizontalScrollChanged = !1
      }
      return this.previousRender.html
    }, b.SELECTION_CLASS_NAME = "selected-text", b.SELECTION_TOP_LEFT = "top-left-radius", b.SELECTION_BOTTOM_LEFT =
      "bottom-left-radius", b.SELECTION_TOP_RIGHT = "top-right-radius", b.SELECTION_BOTTOM_RIGHT =
      "bottom-right-radius", b.EDITOR_BACKGROUND_CLASS_NAME = "monaco-editor-background", b.ROUNDED_PIECE_WIDTH = 10,
      b
  }(d.ViewEventHandler);
  b.SelectionsOverlay = f
})