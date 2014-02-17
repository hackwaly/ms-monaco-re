define("vs/base/ui/scrollbar/impl/horizontalScrollbar", ["require", "exports",
  "vs/base/ui/scrollbar/impl/abstractScrollbar", "vs/base/dom/mouseEvent"
], function(e, t, n, i) {
  function o(e, t, n) {
    e.style[t] !== n && (e.style[t] = n);
  }
  var r = function(e) {
    function t(t, i, o) {
      var r = this;

      var s = new n.ScrollbarState(o.horizontalHasArrows ? o.arrowSize : 0, o.horizontalScrollbarSize, o.verticalScrollbarSize);
      if (e.call(this, i, s, o.horizontal, "horizontal"), this.scrollable = t, this._createDomNode(), o.horizontalHasArrows) {
        var a = (o.arrowSize - n.AbstractScrollbar.ARROW_IMG_SIZE) / 2;

        var u = (o.horizontalScrollbarSize - n.AbstractScrollbar.ARROW_IMG_SIZE) / 2;
        this._createArrow("left-arrow", u, a, null, null, o.arrowSize, o.horizontalScrollbarSize, function() {
          return r._createMouseWheelEvent(1);
        });

        this._createArrow("right-arrow", u, null, null, a, o.arrowSize, o.horizontalScrollbarSize, function() {
          return r._createMouseWheelEvent(-1);
        });
      }
      this._createSlider(Math.floor((o.horizontalScrollbarSize - o.horizontalSliderSize) / 2), 0, null, o.horizontalSliderSize);
    }
    __extends(t, e);

    t.prototype._createMouseWheelEvent = function(e) {
      return new i.StandardMouseWheelEvent(null, e, 0);
    };

    t.prototype._updateSlider = function(e, t) {
      o(this.slider, "width", e + "px");

      o(this.slider, "left", t + "px");
    };

    t.prototype._renderDomNode = function(e, t) {
      o(this.domNode, "width", e + "px");

      o(this.domNode, "height", t + "px");

      o(this.domNode, "left", "0");

      o(this.domNode, "bottom", "0");
    };

    t.prototype._mouseDownRelativePosition = function(e, t) {
      return e.posx - t.left;
    };

    t.prototype._sliderMousePosition = function(e) {
      return e.posx;
    };

    t.prototype._setScrollPosition = function(e) {
      this.scrollable.setScrollLeft(e);
    };

    return t;
  }(n.AbstractScrollbar);
  t.HorizontalScrollbar = r;
});