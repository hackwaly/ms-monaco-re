define(["vs/base/lib/winjs.base", "./abstractScrollbar", "vs/base/dom/mouseEvent"], function(a, b, c) {
  function e(a) {
    return a + "px"
  }
  var d = b.AbstractScrollbar;
  var f = a.Class.derive(d, function(b, c, e) {
    d.call(this, b, c, e, e.horizontal, e.horizontalHasArrows), this._createDomNode();
    if (this.options.horizontalHasArrows) {
      var f = (this.options.arrowSize - this.ARROW_IMG_SIZE) / 2,
        g = (this._getScrollbarSize() - this.ARROW_IMG_SIZE) / 2;
      this.leftArrow = this._createArrow("left-arrow", g, f, null, null, this._createMouseWheelEvent.bind(this, 1)),
        this.rightArrow = this._createArrow("right-arrow", g, null, null, f, this._createMouseWheelEvent.bind(this, -
          1))
    }
    this._createSlider(null, this._getScrollbarSize()), this.visibility === "visible" ? this.reveal() : this.hide()
  }, {
    _createMouseWheelEvent: function(a) {
      return new c.MouseWheelEvent(null, a, 0)
    },
    _updateSlider: function(a, b) {
      this.slider.style.width = e(a), this.slider.style.left = e(b)
    },
    _renderDomNode: function() {
      this.domNode.style.width = e(Math.max(0, this.visibleSize - this._getOppositeScrollbarSize())), this.domNode.style
        .height = e(Math.max(0, this._getScrollbarSize())), this.domNode.style.left = "0", this.domNode.style.bottom =
        "0"
    },
    _mouseDownRelativePosition: function(a, b) {
      return a.posx - b.left
    },
    _sliderMousePosition: function(a) {
      return a.posx
    },
    _setScrollPosition: function(a) {
      this.scrollable.setScrollLeft(a)
    },
    _getScrollbarSize: function() {
      return this.options.horizontalScrollbarSize
    },
    _getOppositeScrollbarSize: function() {
      return this.options.verticalScrollbarSize
    }
  }) return {
    HorizontalScrollbar: f
  }
})