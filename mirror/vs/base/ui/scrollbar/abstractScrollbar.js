define(["require", "vs/base/lib/winjs.base", "vs/base/env", "vs/base/dom/dom", "vs/base/dom/mouseEvent"], function(a, b) {
  function g(a) {
    return a + "px"
  }

  function h(a, b, c, d, e) {
    b !== null && (a.style.top = g(b)), c !== null && (a.style.left = g(c)), d !== null && (a.style.bottom = g(d)), e !==
      null && (a.style.right = g(e))
  }

  function i(a, b, c) {
    b !== null && (a.style.width = g(b)), c !== null && (a.style.height = g(c))
  }
  var c = 20,
    d = a("vs/base/env"),
    e = a("vs/base/dom/dom"),
    f = a("vs/base/dom/mouseEvent"),
    j = b.Class.define(function(b, c, d, e, f) {
      this.listenersToRemove = [], this.scrollable = b, this.parent = c, this.options = d, this.visibility = e,
        this.hasArrows = f, this._hookUnbind = [], this.isDragging = !1, this.scrollPosition = 0, this.scrollSize =
        0, this.sliderSize = 0, this.sliderPosition = 0, this.isNeeded = !1, this.isVisible = !1, this.shouldBeVisible = !
        1, this.ARROW_ID = 0, this.arrowIntervals = {}, this.arrowTimeouts = {}, this.hideTimeout = -1
    }, {
      ARROW_IMG_SIZE: 11,
      _createDomNode: function() {
        this.domNode = document.createElement("div"), this._hide(), this.domNode.style.position = "absolute", this.listenersToRemove
          .push(e.addListener(this.domNode, "mousedown", this._domNodeMouseDown.bind(this)))
      },
      _createArrow: function(a, b, c, d, f, g) {
        var j = document.createElement("div");
        return j.className = a, j.style.position = "absolute", i(j, this.ARROW_IMG_SIZE, this.ARROW_IMG_SIZE), h(j,
          b, c, d, f), this.ARROW_ID++, this.listenersToRemove.push(e.addListener(j, "mousedown", this._arrowMouseDown
          .bind(this, this.ARROW_ID, g))), this.listenersToRemove.push(e.addListener(j, "mouseup", this._arrowMouseUp
          .bind(this, this.ARROW_ID))), this.arrowIntervals[this.ARROW_ID] = -1, this.arrowTimeouts[this.ARROW_ID] = -
          1, this.domNode.appendChild(j), j
      },
      _arrowMouseDown: function(a, b, c) {
        var d = function() {
          this.parent.onMouseWheel && this.parent.onMouseWheel(b(c))
        }.bind(this),
          e = function() {
            this.arrowIntervals[a] = window.setInterval(d, 1e3 / 24)
          }.bind(this);
        d(), this._clearArrowTimers(a), this.arrowTimeouts[a] = window.setTimeout(e, 200)
      },
      _clearArrowTimers: function(a) {
        this.arrowIntervals[a] !== -1 && (window.clearInterval(this.arrowIntervals[a]), this.arrowIntervals[a] = -1),
          this.arrowTimeouts[a] !== -1 && (window.clearTimeout(this.arrowTimeouts[a]), this.arrowTimeouts[a] = -1)
      },
      _arrowMouseUp: function(a, b) {
        this._clearArrowTimers(a)
      },
      _createSlider: function(a, b) {
        this.slider = document.createElement("div"), this.slider.className = "slider", this.slider.style.position =
          "absolute", this.slider.style.left = 0, i(this.slider, a, b), this.domNode.appendChild(this.slider), this
          .listenersToRemove.push(e.addListener(this.slider, "mousedown", this._sliderMouseDown.bind(this)))
      },
      destroy: function() {
        this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = [];
        for (var a = 1; a <= this.ARROW_ID; a++) this._clearArrowTimers(a)
      },
      reveal: function() {
        this.shouldBeVisible = !0, this.isNeeded && this._reveal()
      },
      hide: function() {
        this.shouldBeVisible = !1, this._hide()
      },
      _reveal: function() {
        if (this.visibility === "hidden") return;
        if (this.isVisible) return;
        this.isVisible = !0, this.domNode.style.display = "block", window.setTimeout(function() {
          this.domNode.className = this._getDomNodeRevealClassName()
        }.bind(this), 0), this.hideTimeout !== -1 && (window.clearTimeout(this.hideTimeout), this.hideTimeout = -1)
      },
      _hide: function() {
        if (this.visibility === "visible") return;
        if (!this.isVisible) return;
        this.isVisible = !1, this.domNode.className = this._getDomNodeHideClassName(), this.hideTimeout === -1 && (
          this.hideTimeout = window.setTimeout(function() {
            this.hideTimeout = -1, this.isVisible = !1, this.domNode.style.display = "none"
          }.bind(this), 800))
      },
      onElementDimensions: function(a, b) {
        this.dimensions = a, this.visibleSize = b, this.representableSize = b - (this.hasArrows ? 2 * this.options.arrowSize :
          0) - this._getOppositeScrollbarSize(), this.ratio = this.scrollSize > 0 ? this.representableSize / this.scrollSize :
          0, this._renderDomNode(), this._renderSlider()
      },
      onElementScrollSize: function(a) {
        this.scrollSize !== a && (this.scrollSize = a, this.dimensions && (this.ratio = this.scrollSize > 0 ? this.representableSize /
          this.scrollSize : 0, this._renderSlider()))
      },
      onElementScrollPosition: function(a) {
        this.scrollPosition !== a && (this.scrollPosition = a, this.dimensions && this._renderSlider())
      },
      _renderSlider: function() {
        this.isNeeded = this.scrollSize > this.visibleSize, this.isNeeded || (this._hide(), this.isVisible = !1,
          this.domNode.style.display = "none"), this.sliderSize = Math.floor(this.visibleSize * this.ratio);
        var a = 0,
          b;
        this.sliderPosition = Math.floor(this.scrollPosition * this.ratio), this.sliderSize < c && (b = (c - this.sliderSize) /
          2, this.sliderSize = c, this.sliderPosition < b ? a = -this.sliderPosition : a = -b, this.sliderPosition +
          a + this.sliderSize > this.representableSize && (a = this.representableSize - this.sliderSize - this.sliderPosition)
        ), this._updateSlider(this.sliderSize, (this.hasArrows ? this.options.arrowSize : 0) + this.sliderPosition +
          a), this.shouldBeVisible && this.isNeeded && this._reveal()
      },
      _domNodeMouseDown: function(a) {
        var b = new f.MouseEvent(a);
        if (b.target !== this.domNode) return;
        this.onMouseDown(a)
      },
      onMouseDown: function(a) {
        var b = new f.MouseEvent(a),
          c = e.getDomNodePosition(this.domNode),
          d = this._mouseDownRelativePosition(b, c) - (this.hasArrows ? this.options.arrowSize : 0) - this.sliderSize /
            2;
        this.setDesiredScrollPosition(d / this.ratio), this._sliderMouseDown(a)
      },
      _unHookGlobalMouse: function() {
        this._hookUnbind.forEach(function(a) {
          a()
        }), this._hookUnbind = []
      },
      _hookGlobalMouse: function() {
        if (this._hookUnbind.length > 0) return;
        this._hookUnbind.push(e.addThrottledListener(document, "mousemove", this._docMouseMove.bind(this), function(
          b, c) {
          var d = new f.MouseEvent(c);
          return d.preventDefault(), {
            leftButton: d.leftButton,
            posx: d.posx,
            posy: d.posy
          }
        })), this._hookUnbind.push(e.addListener(document, "mouseup", this._sliderDragFinish.bind(this))), d.isInIframe() &&
          (this._hookUnbind.push(e.addListener(document, "mouseout", function(a) {
          var b = new f.MouseEvent(a);
          b.target.tagName.toLowerCase() === "html" && this._sliderDragFinish()
        }.bind(this))), this._hookUnbind.push(e.addListener(document, "mouseover", function(a) {
          var b = new f.MouseEvent(a);
          b.target.tagName.toLowerCase() === "html" && this._sliderDragFinish()
        }.bind(this))), this._hookUnbind.push(e.addListener(document.body, "mouseleave", function(a) {
          this._sliderDragFinish()
        }.bind(this))))
      },
      _sliderMouseDown: function(a) {
        var b = new f.MouseEvent(a);
        b.leftButton && (this.isDragging = !0, this.draggingDelta = this._sliderMousePosition(b) - this.sliderPosition,
          e.toggleClass(this.slider, "active", !0), this._hookGlobalMouse(), b.preventDefault(), this.parent.onDragStart()
        )
      },
      _docMouseMove: function(a) {
        var b = this._sliderMousePosition(a) - this.draggingDelta;
        this.setDesiredScrollPosition(b / this.ratio)
      },
      _sliderDragFinish: function() {
        this._unHookGlobalMouse(), this.isDragging = !1, e.toggleClass(this.slider, "active", !1), this.parent.onDragEnd()
      },
      validateScrollPosition: function(a) {
        return a = Math.round(a), a = Math.max(a, 0), a = Math.min(a, this.scrollSize - this.visibleSize), a
      },
      setDesiredScrollPosition: function(a) {
        a = this.validateScrollPosition(a), this._setScrollPosition(a), this.onElementScrollPosition(a), this._renderSlider()
      },
      _renderDomNode: function() {},
      _getDomNodeRevealClassName: function() {
        return "visible scrollbar"
      },
      _getDomNodeHideClassName: function() {
        return "invisible scrollbar"
      },
      _updateSlider: function(a, b) {},
      _mouseDownRelativePosition: function(a) {},
      _sliderMousePosition: function(a) {},
      _setScrollPosition: function(a) {},
      _getScrollbarSize: function() {},
      _getOppositeScrollbarSize: function() {}
    });
  return {
    AbstractScrollbar: j
  }
})