define("vs/base/ui/scrollbar/impl/verticalScrollbar", ["require", "exports",
  "vs/base/ui/scrollbar/impl/abstractScrollbar", "vs/base/dom/mouseEvent"
], function(e, t, n, i) {
  function o(e, t, n) {
    if (e.style[t] !== n) {
      e.style[t] = n;
    }
  }
  var r = function(e) {
    function t(t, i, o) {
      var r = this;

      var s = new n.ScrollbarState(o.verticalHasArrows ? o.arrowSize : 0, o.verticalScrollbarSize, o.horizontalScrollbarSize);
      if (e.call(this, i, s, o.vertical, "vertical"), this.scrollable = t, this._createDomNode(), o.verticalHasArrows) {
        var a = (o.arrowSize - n.AbstractScrollbar.ARROW_IMG_SIZE) / 2;

        var u = (o.verticalScrollbarSize - n.AbstractScrollbar.ARROW_IMG_SIZE) / 2;
        this._createArrow("up-arrow", a, u, null, null, o.verticalScrollbarSize, o.arrowSize, function() {
          return r._createMouseWheelEvent(1);
        });

        this._createArrow("down-arrow", null, u, a, null, o.verticalScrollbarSize, o.arrowSize, function() {
          return r._createMouseWheelEvent(-1);
        });
      }
      this._createSlider(0, Math.floor((o.verticalScrollbarSize - o.verticalSliderSize) / 2), o.verticalSliderSize,
        null);
    }
    __extends(t, e);

    t.prototype._createMouseWheelEvent = function(e) {
      return new i.StandardMouseWheelEvent(null, 0, e);
    };

    t.prototype._updateSlider = function(e, t) {
      o(this.slider, "height", e + "px");

      o(this.slider, "top", t + "px");
    };

    t.prototype._renderDomNode = function(e, t) {
      o(this.domNode, "width", t + "px");

      o(this.domNode, "height", e + "px");

      o(this.domNode, "right", "0");

      o(this.domNode, "top", "0");
    };

    t.prototype._mouseDownRelativePosition = function(e, t) {
      return e.posy - t.top;
    };

    t.prototype._sliderMousePosition = function(e) {
      return e.posy;
    };

    t.prototype._setScrollPosition = function(e) {
      this.scrollable.setScrollTop(e);
    };

    return t;
  }(n.AbstractScrollbar);
  t.VerticalScrollbar = r;
});