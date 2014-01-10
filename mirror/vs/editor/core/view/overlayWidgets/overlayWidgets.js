var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/view/viewContext", "vs/editor/editor",
  "vs/editor/core/view/viewEventHandler", "vs/css!./overlayWidgets"
], function(a, b, c, d, e) {
  var f = c,
    g = d,
    h = e,
    i = function(a) {
      function b(b) {
        a.call(this), this.context = b, this.widgets = {}, this.verticalScrollbarWidth = 0, this.domNode = document.createElement(
          "div"), this.domNode.className = f.ClassNames.OVERLAY_WIDGETS, this.domNode.setAttribute("aria-hidden",
          "true"), this.domNode.setAttribute("role", "presentation"), this.context.addEventHandler(this)
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this.context.removeEventHandler(this), this.context = null, this.widgets = null
      }, b.prototype.onLayoutChanged = function(a) {
        return this.verticalScrollbarWidth = a.verticalScrollbarWidth, this.domNode.style.width = a.width + "px", !0
      }, b.prototype.addWidget = function(a) {
        this.widgets[a.getId()] = {
          widget: a,
          preference: null
        };
        var b = a.getDomNode();
        b.style.position = "absolute", b.setAttribute("widgetId", a.getId()), this.domNode.appendChild(b)
      }, b.prototype.setWidgetPosition = function(a, b) {
        var c = this.widgets[a.getId()];
        c.preference = b, this._renderWidget(c)
      }, b.prototype.removeWidget = function(a) {
        var b = a.getId();
        if (this.widgets.hasOwnProperty(b)) {
          var c = this.widgets[b],
            d = c.widget.getDomNode();
          d.parentNode.removeChild(d), delete this.widgets[b]
        }
      }, b.prototype._renderWidget = function(a) {
        if (a.preference === null) return;
        if (a.preference === g.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER) {
          var b = a.widget.getDomNode();
          b.style.top = "0px", b.style.right = 2 * this.verticalScrollbarWidth + "px"
        }
      }, b.prototype.prepareRender = function(a) {
        return null
      }, b.prototype.render = function(a, b) {
        if (!this.shouldRender) return;
        this.shouldRender = !1;
        var c;
        for (c in this.widgets) this.widgets.hasOwnProperty(c) && this._renderWidget(this.widgets[c])
      }, b
    }(h.ViewEventHandler);
  b.ViewOverlayWidgets = i
})