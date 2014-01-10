var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/dom/dom", "vs/editor/core/view/viewEventHandler"], function(a, b, c, d) {
  var e = c,
    f = d,
    g = function(a) {
      function b(b) {
        a.call(this), this.context = b, this.dynamicOverlays = [], this.overlays = [], this.domNode = document.createElement(
          "div"), this.domNode.className = "view-overlays", this.domNode.style.position = "absolute", this.domNode.setAttribute(
          "role", "presentation"), this.domNode.setAttribute("aria-hidden", "true"), this.backgroundDomNode =
          document.createElement("div"), this.backgroundDomNode.className = "background", this.domNode.appendChild(
            this.backgroundDomNode), this.staticDomNode = document.createElement("div"), this.staticDomNode.className =
          "static", this.domNode.appendChild(this.staticDomNode), this.dynamicDomNode = document.createElement("div"),
          this.dynamicDomNode.className = "dynamic", this.domNode.appendChild(this.dynamicDomNode), this.scrollHeight =
          0, this.context.addEventHandler(this)
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this.context.removeEventHandler(this), this.context = null;
        for (var a = 0; a < this.dynamicOverlays.length; a++) this.dynamicOverlays[a].dispose();
        this.dynamicOverlays = null;
        for (var a = 0; a < this.overlays.length; a++) this.overlays[a].dispose();
        this.overlays = null
      }, b.prototype.onViewFocusChanged = function(a) {
        return e.toggleClass(this.dynamicDomNode, "focused", a), !1
      }, b.prototype.onLayoutChanged = function(a) {
        return this.backgroundDomNode.style.width = a.width + "px", !1
      }, b.prototype.addDynamicOverlay = function(a) {
        this.dynamicOverlays.push(a)
      }, b.prototype.addOverlay = function(a) {
        this.overlays.push(a), this.staticDomNode.appendChild(a.getDomNode())
      }, b.prototype.prepareRender = function(a) {
        var b = !1;
        for (var c = 0; !b && c < this.dynamicOverlays.length; c++) b = this.dynamicOverlays[c].shouldCallRender() ||
          b;
        var d = null;
        if (b) {
          d = [];
          for (var c = 0; c < this.dynamicOverlays.length; c++) d = d.concat(this.dynamicOverlays[c].render(a))
        }
        for (var c = 0; c < this.overlays.length; c++) this.overlays[c].prepareRender(a);
        return {
          pieces: d
        }
      }, b.prototype.render = function(a, b) {
        a.pieces && (this.dynamicDomNode.innerHTML = a.pieces.join(""));
        for (var c = 0; c < this.overlays.length; c++) this.overlays[c].render(b);
        this.scrollHeight !== b.scrollHeight && (this.scrollHeight = b.scrollHeight, this.backgroundDomNode.style.height =
          this.scrollHeight + "px"), this.backgroundDomNode.style.top = b.getViewportVerticalOffsetForLineNumber(b.visibleRange
          .startLineNumber) + "px"
      }, b
    }(f.ViewEventHandler);
  b.ViewOverlays = g
})