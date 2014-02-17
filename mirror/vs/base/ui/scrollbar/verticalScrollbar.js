define(["vs/base/lib/winjs.base", "./abstractScrollbar", "vs/base/dom/mouseEvent"], function(a, b, c) {
  function e(a) {
    return a + "px"
  }
  var d = b.AbstractScrollbar;
  var f = a.Class.derive(d, function(b, c, e) {
    d.call(this, b, c, e, e.vertical, e.verticalHasArrows), this._createDomNode();
    if (this.options.verticalHasArrows) {
      var f = (this.options.arrowSize - this.ARROW_IMG_SIZE) / 2,
        g = (this._getScrollbarSize() - this.ARROW_IMG_SIZE) / 2;
      this.topArrow = this._createArrow("up-arrow", f, g, null, null, this._createMouseWheelEvent.bind(this, 1)),
        this.bottomArrow = this._createArrow("down-arrow", null, g, f, null, this._createMouseWheelEvent.bind(this, -
          1))
    }
    this._createSlider(this._getScrollbarSize(), null), this.visibility === "visible" ? this.reveal() : this.hide()
  }, {
    _createMouseWheelEvent: function(a) {
      return new c.MouseWheelEvent(null, 0, a)
    },
    _updateSlider: function(a, b) {
      this.slider.style.height = e(a), this.slider.style.top = e(b)
    },
    _renderDomNode: function() {
      this.domNode.style.width = e(Math.max(0, this._getScrollbarSize())), this.domNode.style.height = e(Math.max(0,
        this.visibleSize - this._getOppositeScrollbarSize())), this.domNode.style.right = "0", this.domNode.style.top =
        "0"
    },
    _mouseDownRelativePosition: function(a, b) {
      return a.posy - b.top
    },
    _sliderMousePosition: function(a) {
      return a.posy
    },
    _setScrollPosition: function(a) {
      this.scrollable.setScrollTop(a)
    },
    _getScrollbarSize: function() {
      return this.options.verticalScrollbarSize
    },
    _getOppositeScrollbarSize: function() {
      return this.options.horizontalScrollbarSize
    }
  }) return {
    VerticalScrollbar: f
  }
})