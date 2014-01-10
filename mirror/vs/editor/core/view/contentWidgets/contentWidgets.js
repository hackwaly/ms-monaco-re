var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/view/viewContext", "vs/editor/editor",
  "vs/editor/core/view/viewEventHandler", "vs/css!./contentWidgets"
], function(a, b, c, d, e) {
  var f = c,
    g = d,
    h = e,
    i = function(a) {
      function b(b) {
        a.call(this), this.context = b, this.widgets = {}, this.contentWidth = 0, this.shouldRender = !0, this.domNode =
          document.createElement("div"), this.domNode.className = f.ClassNames.CONTENT_WIDGETS, this.context.addEventHandler(
            this)
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this.context.removeEventHandler(this), this.context = null, this.widgets = null, this.domNode = null
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
        this.contentWidth = a.contentWidth;
        var b;
        for (b in this.widgets) this.widgets.hasOwnProperty(b) && (this.widgets[b].widget.getDomNode().style.maxWidth =
          this.contentWidth + "px");
        return !0
      }, b.prototype.onScrollChanged = function(a) {
        return a.vertical
      }, b.prototype.onZonesChanged = function() {
        return !0
      }, b.prototype.onScrollWidthChanged = function() {
        return !1
      }, b.prototype.onScrollHeightChanged = function(a) {
        return !1
      }, b.prototype.addWidget = function(a) {
        this.widgets[a.getId()] = {
          widget: a,
          position: null,
          preference: null,
          isVisible: !1
        };
        var b = a.getDomNode();
        b.style.position = "absolute", b.style.maxWidth = this.contentWidth + "px", b.style.top = "-1000px", b.setAttribute(
          "widgetId", a.getId()), this.domNode.appendChild(b), this.shouldRender = !0
      }, b.prototype.setWidgetPosition = function(a, b, c) {
        var d = this.widgets[a.getId()];
        d.position = b, d.preference = c, this.shouldRender = !0
      }, b.prototype.removeWidget = function(a) {
        var b = a.getId();
        if (this.widgets.hasOwnProperty(b)) {
          var c = this.widgets[b],
            d = c.widget.getDomNode();
          d.parentNode.removeChild(d), delete this.widgets[b]
        }
      }, b.prototype.layoutBoxInViewport = function(a, b, c) {
        var d = c.visibleRangeForPosition(a);
        if (!d) return null;
        var e = b.clientWidth,
          f = b.clientHeight,
          g = d.top,
          h = g,
          i = d.top + d.height,
          j = c.viewportHeight - i,
          k = g - f,
          l = h >= f,
          m = i,
          n = j >= f,
          o = d.left;
        return o + e > c.viewportLeft + c.viewportWidth && (o = c.viewportLeft + c.viewportWidth - e), o < c.viewportLeft &&
          (o = c.viewportLeft), {
          aboveTop: k,
          fitsAbove: l,
          belowTop: m,
          fitsBelow: n,
          left: o
        }
      }, b.prototype.prepareRenderWidgetAtExactPosition = function(a, b) {
        var c = b.visibleRangeForPosition(a);
        return c ? {
          top: c.top,
          left: c.left
        } : null
      }, b.prototype.prepareRenderWidget = function(a, b) {
        var c = this;
        if (!a.position || !a.preference) return null;
        var d = this.context.model.validateModelPosition(a.position),
          e = this.context.model.convertModelPositionToViewPosition(d.lineNumber, d.column),
          f, h, i, j = null,
          k = function() {
            if (j) return;
            var d = a.widget.getDomNode();
            j = c.layoutBoxInViewport(e, d, b)
          };
        for (h = 1; h <= 2; h++)
          for (i = 0; i < a.preference.length; i++) {
            f = a.preference[i];
            if (f === g.ContentWidgetPositionPreference.ABOVE) {
              k();
              if (!j) return null;
              if (h === 2 || j.fitsAbove) return {
                top: j.aboveTop,
                left: j.left
              }
            } else {
              if (f !== g.ContentWidgetPositionPreference.BELOW) return this.prepareRenderWidgetAtExactPosition(e, b);
              k();
              if (!j) return null;
              if (h === 2 || j.fitsBelow) return {
                top: j.belowTop,
                left: j.left
              }
            }
          }
      }, b.prototype.prepareRender = function(a) {
        if (!this.shouldRender) return null;
        var b = {}, c, d;
        for (d in this.widgets) this.widgets.hasOwnProperty(d) && (c = this.prepareRenderWidget(this.widgets[d], a),
          c && (b[d] = c));
        return b
      }, b.prototype.render = function(a, b) {
        if (!this.shouldRender) return;
        this.shouldRender = !1;
        var c, d, e;
        for (c in this.widgets) this.widgets.hasOwnProperty(c) && (d = this.widgets[c], e = this.widgets[c].widget.getDomNode(),
          a.hasOwnProperty(c) ? (e.style.top = a[c].top + "px", e.style.left = a[c].left + "px", d.isVisible || (d.isVisible = !
            0)) : d.isVisible && (d.isVisible = !1, e.style.top = "-1000px"))
      }, b
    }(h.ViewEventHandler);
  b.ViewContentWidgets = i
})