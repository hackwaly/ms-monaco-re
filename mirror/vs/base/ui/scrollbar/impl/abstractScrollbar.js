define("vs/base/ui/scrollbar/impl/abstractScrollbar", ["require", "exports", "vs/base/dom/dom",
  "vs/base/dom/mouseEvent", "vs/base/ui/scrollbar/impl/common", "vs/base/lifecycle",
  "vs/base/dom/globalMouseMoveMonitor"
], function(e, t, n, i, o, r, s) {
  function a(e) {
    return e + "px";
  }

  function u(e, t, n, i, o) {
    null !== t && (e.style.top = a(t));

    null !== n && (e.style.left = a(n));

    null !== i && (e.style.bottom = a(i));

    null !== o && (e.style.right = a(o));
  }

  function l(e, t, n) {
    null !== t && (e.style.width = a(t));

    null !== n && (e.style.height = a(n));
  }
  var c = function() {
    function e(e, t, n) {
      this.visibleSize = 0;

      this.scrollSize = 0;

      this.scrollPosition = 0;

      this.scrollbarSize = t;

      this.oppositeScrollbarSize = n;

      this.arrowSize = e;

      this.refreshComputedValues();
    }
    e.prototype.setVisibleSize = function(e) {
      return this.visibleSize !== e ? (this.visibleSize = e, this.refreshComputedValues(), !0) : !1;
    };

    e.prototype.setScrollSize = function(e) {
      return this.scrollSize !== e ? (this.scrollSize = e, this.refreshComputedValues(), !0) : !1;
    };

    e.prototype.setScrollPosition = function(e) {
      return this.scrollPosition !== e ? (this.scrollPosition = e, this.refreshComputedValues(), !0) : !1;
    };

    e.prototype.refreshComputedValues = function() {
      if (this.computedAvailableSize = Math.max(0, this.visibleSize - this.oppositeScrollbarSize), this.computedRepresentableSize =
        Math.max(0, this.computedAvailableSize - 2 * this.arrowSize), this.computedRatio = this.scrollSize > 0 ? this
        .computedRepresentableSize / this.scrollSize : 0, this.computedIsNeeded = this.scrollSize > this.visibleSize,
        this.computedIsNeeded) {
        if (this.computedSliderSize = Math.floor(this.visibleSize * this.computedRatio), this.computedSliderPosition =
          Math.floor(this.scrollPosition * this.computedRatio), this.computedSliderSize < e.MINIMUM_SLIDER_SIZE) {
          var t = (e.MINIMUM_SLIDER_SIZE - this.computedSliderSize) / 2;
          this.computedSliderSize = e.MINIMUM_SLIDER_SIZE;

          this.computedSliderPosition -= t;

          this.computedSliderPosition + this.computedSliderSize > this.computedRepresentableSize && (this.computedSliderPosition =
            this.computedRepresentableSize - this.computedSliderSize);

          this.computedSliderPosition < 0 && (this.computedSliderPosition = 0);
        }
      } else this.computedSliderSize = this.computedRepresentableSize;

      this.computedSliderPosition = 0;
    };

    e.prototype.getArrowSize = function() {
      return this.arrowSize;
    };

    e.prototype.getRectangleLargeSize = function() {
      return this.computedAvailableSize;
    };

    e.prototype.getRectangleSmallSize = function() {
      return this.scrollbarSize;
    };

    e.prototype.isNeeded = function() {
      return this.computedIsNeeded;
    };

    e.prototype.getSliderSize = function() {
      return this.computedSliderSize;
    };

    e.prototype.getSliderPosition = function() {
      return this.computedSliderPosition;
    };

    e.prototype.convertSliderPositionToScrollPosition = function(e) {
      return e / this.computedRatio;
    };

    e.prototype.validateScrollPosition = function(e) {
      e = Math.round(e);

      e = Math.max(e, 0);

      return e = Math.min(e, this.scrollSize - this.visibleSize);
    };

    e.MINIMUM_SLIDER_SIZE = 20;

    return e;
  }();
  t.ScrollbarState = c;
  var d = function() {
    function e(e, t, i, o, r, a, c, d, h) {
      var f = this;
      this.parent = h;

      this.mouseWheelEventFactory = d;

      this.bgDomNode = document.createElement("div");

      this.bgDomNode.className = "arrow-background";

      this.bgDomNode.style.position = "absolute";

      l(this.bgDomNode, a, c);

      u(this.bgDomNode, null !== t ? 0 : null, null !== i ? 0 : null, null !== o ? 0 : null, null !== r ? 0 : null);

      this.domNode = document.createElement("div");

      this.domNode.className = e;

      this.domNode.style.position = "absolute";

      l(this.domNode, p.ARROW_IMG_SIZE, p.ARROW_IMG_SIZE);

      u(this.domNode, t, i, o, r);

      this.mouseMoveMonitor = new s.GlobalMouseMoveMonitor;

      this.toDispose = [];

      this.toDispose.push(n.addDisposableListener(this.bgDomNode, "mousedown", function(e) {
        return f._arrowMouseDown(e);
      }));

      this.toDispose.push(n.addDisposableListener(this.domNode, "mousedown", function(e) {
        return f._arrowMouseDown(e);
      }));

      this.toDispose.push(this.mouseMoveMonitor);

      this.interval = -1;

      this.timeout = -1;
    }
    e.prototype.dispose = function() {
      this.toDispose = r.disposeAll(this.toDispose);

      this._clearArrowTimers();
    };

    e.prototype._arrowMouseDown = function(e) {
      var t = this;

      var n = function() {
        t.parent.onMouseWheel(t.mouseWheelEventFactory());
      };

      var o = function() {
        t.interval = window.setInterval(n, 1e3 / 24);
      };
      n();

      this._clearArrowTimers();

      this.timeout = window.setTimeout(o, 200);

      this.mouseMoveMonitor.startMonitoring(s.standardMouseMoveMerger, function() {}, function() {
        t._clearArrowTimers();
      });
      var r = new i.StandardMouseEvent(e);
      r.preventDefault();
    };

    e.prototype._clearArrowTimers = function() {
      -1 !== this.interval && (window.clearInterval(this.interval), this.interval = -1);

      - 1 !== this.timeout && (window.clearTimeout(this.timeout), this.timeout = -1);
    };

    return e;
  }();

  var h = function() {
    function e(e, t, n) {
      this.visibility = e;

      this.visibleClassName = t;

      this.invisibleClassName = n;

      this.domNode = null;

      this.isVisible = !1;

      this.isNeeded = !1;

      this.shouldBeVisible = !1;

      this.fadeAwayTimeout = -1;
    }
    e.prototype.dispose = function() {
      -1 !== this.fadeAwayTimeout && (window.clearTimeout(this.fadeAwayTimeout), this.fadeAwayTimeout = -1);
    };

    e.prototype.applyVisibilitySetting = function(e) {
      return 1 === this.visibility ? !1 : 2 === this.visibility ? !0 : e;
    };

    e.prototype.setShouldBeVisible = function(e) {
      var t = this.applyVisibilitySetting(e);
      this.shouldBeVisible !== t && (this.shouldBeVisible = t, this.ensureVisibility());
    };

    e.prototype.setIsNeeded = function(e) {
      this.isNeeded !== e && (this.isNeeded = e, this.ensureVisibility());
    };

    e.prototype.setDomNode = function(e) {
      this.domNode = e;

      this.domNode.className = this.invisibleClassName;

      this.domNode.style.display = "none";

      this.setShouldBeVisible(!1);
    };

    e.prototype.ensureVisibility = function() {
      return this.isNeeded ? (this.shouldBeVisible ? this._reveal() : this._hide(!0), void 0) : (this._hide(!1), void 0);
    };

    e.prototype._reveal = function() {
      var e = this;
      this.isVisible || (this.isVisible = !0, window.setTimeout(function() {
        e.domNode.className = e.visibleClassName;
      }, 0), this.domNode.style.display = "block", -1 !== this.fadeAwayTimeout && (window.clearTimeout(this.fadeAwayTimeout),
        this.fadeAwayTimeout = -1));
    };

    e.prototype._hide = function(e) {
      var t = this;
      this.isVisible && (this.isVisible = !1, this.domNode.className = this.invisibleClassName, e ? -1 === this.fadeAwayTimeout &&
        (this.fadeAwayTimeout = window.setTimeout(function() {
          t.fadeAwayTimeout = -1;

          t.domNode.style.display = "none";
        }, 800)) : this.domNode.style.display = "none");
    };

    return e;
  }();

  var p = function() {
    function e(e, t, n, i) {
      this.parent = e;

      this.scrollbarState = t;

      this.visibilityController = new h(n, "visible scrollbar " + i, "invisible scrollbar " + i);

      this.mouseMoveMonitor = new s.GlobalMouseMoveMonitor;

      this.toDispose = [];

      this.toDispose.push(this.visibilityController);

      this.toDispose.push(this.mouseMoveMonitor);
    }
    e.prototype._createDomNode = function() {
      var e = this;
      this.domNode = document.createElement("div");

      this.visibilityController.setDomNode(this.domNode);

      this.domNode.style.position = "absolute";

      this.toDispose.push(n.addDisposableListener(this.domNode, "mousedown", function(t) {
        return e._domNodeMouseDown(t);
      }));
    };

    e.prototype._createArrow = function(e, t, n, i, o, r, s, a) {
      var u = new d(e, t, n, i, o, r, s, a, this.parent);
      this.domNode.appendChild(u.bgDomNode);

      this.domNode.appendChild(u.domNode);

      this.toDispose.push(u);
    };

    e.prototype._createSlider = function(e, t, i, o) {
      var r = this;
      this.slider = document.createElement("div");

      this.slider.className = "slider";

      this.slider.style.position = "absolute";

      u(this.slider, e, t, null, null);

      l(this.slider, i, o);

      this.domNode.appendChild(this.slider);

      this.toDispose.push(n.addDisposableListener(this.slider, "mousedown", function(e) {
        return r._sliderMouseDown(e);
      }));
    };

    e.prototype.destroy = function() {
      this.toDispose = r.disposeAll(this.toDispose);
    };

    e.prototype.onElementSize = function(e) {
      this.scrollbarState.setVisibleSize(e) && (this._renderDomNode(this.scrollbarState.getRectangleLargeSize(), this
        .scrollbarState.getRectangleSmallSize()), this._renderSlider(), this.visibilityController.setIsNeeded(this.scrollbarState
        .isNeeded()));
    };

    e.prototype.onElementScrollSize = function(e) {
      this.scrollbarState.setScrollSize(e) && (this._renderSlider(), this.visibilityController.setIsNeeded(this.scrollbarState
        .isNeeded()));
    };

    e.prototype.onElementScrollPosition = function(e) {
      this.scrollbarState.setScrollPosition(e) && (this._renderSlider(), this.visibilityController.setIsNeeded(this.scrollbarState
        .isNeeded()));
    };

    e.prototype.beginReveal = function() {
      this.visibilityController.setShouldBeVisible(!0);
    };

    e.prototype.beginHide = function() {
      this.visibilityController.setShouldBeVisible(!1);
    };

    e.prototype._renderSlider = function() {
      this._updateSlider(this.scrollbarState.getSliderSize(), this.scrollbarState.getArrowSize() + this.scrollbarState
        .getSliderPosition());
    };

    e.prototype._domNodeMouseDown = function(e) {
      var t = new i.StandardMouseEvent(e);
      t.target === this.domNode && this.onMouseDown(e);
    };

    e.prototype.onMouseDown = function(e) {
      var t = new i.StandardMouseEvent(e);

      var o = n.getDomNodePosition(this.domNode);

      var r = this._mouseDownRelativePosition(t, o) - this.scrollbarState.getArrowSize() - this.scrollbarState.getSliderSize() /
        2;
      this.setDesiredScrollPosition(this.scrollbarState.convertSliderPositionToScrollPosition(r));

      this._sliderMouseDown(e);
    };

    e.prototype._sliderMouseDown = function(e) {
      var t = this;

      var o = new i.StandardMouseEvent(e);
      if (o.leftButton) {
        var r = this._sliderMousePosition(o) - this.scrollbarState.getSliderPosition();
        n.toggleClass(this.slider, "active", !0);

        this.mouseMoveMonitor.startMonitoring(s.standardMouseMoveMerger, function(e) {
          var n = t._sliderMousePosition(e) - r;
          t.setDesiredScrollPosition(t.scrollbarState.convertSliderPositionToScrollPosition(n));
        }, function() {
          n.toggleClass(t.slider, "active", !1);

          t.parent.onDragEnd();
        });

        o.preventDefault();

        this.parent.onDragStart();
      }
    };

    e.prototype.validateScrollPosition = function(e) {
      return this.scrollbarState.validateScrollPosition(e);
    };

    e.prototype.setDesiredScrollPosition = function(e) {
      e = this.validateScrollPosition(e);

      this._setScrollPosition(e);

      this.onElementScrollPosition(e);

      this._renderSlider();
    };

    e.prototype._renderDomNode = function() {};

    e.prototype._updateSlider = function() {};

    e.prototype._mouseDownRelativePosition = function() {
      return 0;
    };

    e.prototype._sliderMousePosition = function() {
      return 0;
    };

    e.prototype._setScrollPosition = function() {};

    e.ARROW_IMG_SIZE = 11;

    return e;
  }();
  t.AbstractScrollbar = p;
});