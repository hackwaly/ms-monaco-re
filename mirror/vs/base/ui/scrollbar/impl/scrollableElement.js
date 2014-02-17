define("vs/base/ui/scrollbar/impl/scrollableElement", ["require", "exports", "vs/base/dom/dom",
  "vs/base/dom/mouseEvent", "vs/base/env", "vs/base/ui/scrollbar/impl/common",
  "vs/base/ui/scrollbar/impl/domNodeScrollable", "vs/base/ui/scrollbar/impl/horizontalScrollbar",
  "vs/base/ui/scrollbar/impl/verticalScrollbar", "vs/base/lifecycle", "vs/css!./scrollbars"
], function(e, t, n, i, o, r, s, a, u, l) {
  var c = 500;

  var d = 50;

  var h = function() {
    function e(e, t) {
      var i = this;
      this.originalElement = e;

      this.originalElement.style.overflow = "hidden";

      this.options = this._createOptions(t);

      this.scrollable = this.options.scrollable ? this.options.scrollable : new s.DomNodeScrollable(this.originalElement);

      this.verticalScrollbarWidth = this.options.verticalScrollbarSize;

      this.horizontalScrollbarHeight = this.options.horizontalScrollbarSize;

      this.verticalScrollbar = new u.VerticalScrollbar(this.scrollable, this, this.options);

      this.horizontalScrollbar = new a.HorizontalScrollbar(this.scrollable, this, this.options);

      this.domNode = document.createElement("div");

      this.domNode.className = "monaco-scrollable-element " + this.options.className;

      this.domNode.setAttribute("aria-hidden", "true");

      this.domNode.setAttribute("role", "presentation");

      this.domNode.style.position = "relative";

      this.domNode.style.overflow = "hidden";

      this.domNode.appendChild(this.originalElement);

      this.domNode.appendChild(this.horizontalScrollbar.domNode);

      this.domNode.appendChild(this.verticalScrollbar.domNode);

      this.options.useShadows && (this.leftShadowDomNode = document.createElement("div"), this.leftShadowDomNode.className =
        "shadow", this.domNode.appendChild(this.leftShadowDomNode));

      this.options.useShadows && (this.topShadowDomNode = document.createElement("div"), this.topShadowDomNode.className =
        "shadow", this.domNode.appendChild(this.topShadowDomNode), this.topLeftShadowDomNode = document.createElement(
          "div"), this.topLeftShadowDomNode.className = "shadow top-left-corner", this.domNode.appendChild(this.topLeftShadowDomNode)
      );

      this.listenOnDomNode = this.options.listenOnDomNode || this.domNode;

      this.toDispose = [];

      this.toDispose.push(this.scrollable.addScrollListener(function() {
        return i._onScroll();
      }));

      this.options.handleMouseWheel && this.handleMouseWheel();

      this.toDispose.push(n.addDisposableListener(this.listenOnDomNode, "mouseover", function(e) {
        return i._onMouseOver(e);
      }));

      this.toDispose.push(n.addDisposableNonBubblingMouseOutListener(this.listenOnDomNode, function(e) {
        return i._onMouseOut(e);
      }));

      this.onElementDimensionsTimeout = -1;

      this.onElementInternalDimensionsTimeout = -1;

      this.hideTimeout = -1;

      this.isDragging = !1;

      this.mouseIsOver = !1;

      this.onElementDimensions(!0);

      this.onElementInternalDimensions(!0);
    }
    e.prototype.dispose = function() {
      this.toDispose = l.disposeAll(this.toDispose);

      this.verticalScrollbar.destroy();

      this.horizontalScrollbar.destroy();

      - 1 !== this.onElementDimensionsTimeout && (window.clearTimeout(this.onElementDimensionsTimeout), this.onElementDimensionsTimeout = -
        1);

      - 1 !== this.onElementInternalDimensionsTimeout && (window.clearTimeout(this.onElementInternalDimensionsTimeout),
        this.onElementInternalDimensionsTimeout = -1);
    };

    e.prototype.destroy = function() {
      this.dispose();
    };

    e.prototype.getDomNode = function() {
      return this.domNode;
    };

    e.prototype.getOverviewRulerLayoutInfo = function() {
      return {
        parent: this.domNode,
        insertBefore: this.verticalScrollbar.domNode,
        top: this.options.verticalHasArrows ? this.options.arrowSize : 0,
        bottom: (this.options.verticalHasArrows ? this.options.arrowSize : 0) + this.options.horizontalScrollbarSize,
        width: this.options.verticalScrollbarSize
      };
    };

    e.prototype.getVerticalSliderDomNode = function() {
      return this.verticalScrollbar.slider;
    };

    e.prototype.delegateVerticalScrollbarMouseDown = function(e) {
      return this.verticalScrollbar.onMouseDown(e);
    };

    e.prototype.onElementDimensions = function(e) {
      "undefined" == typeof e && (e = !1);
      var t = this;
      e ? this.actualElementDimensions() : -1 === this.onElementDimensionsTimeout && (this.onElementDimensionsTimeout =
        window.setTimeout(function() {
          return t.actualElementDimensions();
        }, 0));
    };

    e.prototype.actualElementDimensions = function() {
      this.onElementDimensionsTimeout = -1;

      this.dimensions = this._computeDimensions();

      this.verticalScrollbar.onElementSize(this.dimensions.height);

      this.horizontalScrollbar.onElementSize(this.dimensions.width);
    };

    e.prototype.onElementInternalDimensions = function(e) {
      "undefined" == typeof e && (e = !1);
      var t = this;
      e ? this.actualElementInternalDimensions() : -1 === this.onElementInternalDimensionsTimeout && (this.onElementInternalDimensionsTimeout =
        window.setTimeout(function() {
          return t.actualElementInternalDimensions();
        }, 0));
    };

    e.prototype.actualElementInternalDimensions = function() {
      this.onElementInternalDimensionsTimeout = -1;

      this.horizontalScrollbar.onElementScrollSize(this.scrollable.getScrollWidth());

      this.verticalScrollbar.onElementScrollSize(this.scrollable.getScrollHeight());
    };

    e.prototype.updateClassName = function(e) {
      this.options.className = e;

      o.browser.isMacintosh && (this.options.className += " mac");

      this.domNode.className = "monaco-scrollable-element " + this.options.className;
    };

    e.prototype.handleMouseWheel = function() {
      var e = this;

      var t = function(t) {
        var n = new i.StandardMouseWheelEvent(t);
        e.onMouseWheel(n);
      };
      this.toDispose.push(n.addDisposableListener(this.listenOnDomNode, "mousewheel", t));

      this.toDispose.push(n.addDisposableListener(this.listenOnDomNode, "DOMMouseScroll", t));
    };

    e.prototype.onMouseWheel = function(e) {
      if (this.options.handleMouseWheel) {
        var t = -1;

        var n = -1;
        if (e.deltaY || e.deltaX) {
          var i = e.deltaY;

          var o = e.deltaX;
          if (this.options.flipAxes && (i = e.deltaX, o = e.deltaY), i) {
            var r = this.scrollable.getScrollTop();
            t = this.verticalScrollbar.validateScrollPosition((-1 !== t ? t : r) - d * i);

            t === r && (t = -1);
          }
          if (o) {
            var s = this.scrollable.getScrollLeft();
            n = this.horizontalScrollbar.validateScrollPosition((-1 !== n ? n : s) - d * o);

            n === s && (n = -1);
          }
          (-1 !== t || -1 !== n) && (e.preventDefault(), e.stopPropagation(), -1 !== t && (this.verticalScrollbar.setDesiredScrollPosition(
            t), t = -1), -1 !== n && (this.horizontalScrollbar.setDesiredScrollPosition(n), n = -1));
        }
      }
    };

    e.prototype._onScroll = function() {
      var e = this.scrollable.getScrollHeight();

      var t = this.scrollable.getScrollTop();

      var i = this.scrollable.getScrollWidth();

      var o = this.scrollable.getScrollLeft();
      if (this.verticalScrollbar.onElementScrollPosition(t), this.horizontalScrollbar.onElementScrollPosition(o),
        this.options.useShadows) {
        var r = e > 0 && t > 0;

        var s = this.options.useShadows && i > 0 && o > 0;
        this.topShadowDomNode && n.toggleClass(this.topShadowDomNode, "top", r);

        this.topLeftShadowDomNode && n.toggleClass(this.topLeftShadowDomNode, "top", r);

        this.leftShadowDomNode && n.toggleClass(this.leftShadowDomNode, "left", s);

        this.topLeftShadowDomNode && n.toggleClass(this.topLeftShadowDomNode, "left", s);
      }
      this._reveal();
    };

    e.prototype.onDragStart = function() {
      this.isDragging = !0;

      this._reveal();
    };

    e.prototype.onDragEnd = function() {
      this.isDragging = !1;

      this._hide();
    };

    e.prototype._onMouseOut = function() {
      this.mouseIsOver = !1;

      this._hide();
    };

    e.prototype._onMouseOver = function() {
      this.mouseIsOver = !0;

      this._reveal();
    };

    e.prototype._reveal = function() {
      this.verticalScrollbar.beginReveal();

      this.horizontalScrollbar.beginReveal();

      this._scheduleHide();
    };

    e.prototype._hide = function() {
      this.mouseIsOver || this.isDragging || (this.verticalScrollbar.beginHide(), this.horizontalScrollbar.beginHide());
    };

    e.prototype._scheduleHide = function() {
      -1 !== this.hideTimeout && window.clearTimeout(this.hideTimeout);

      this.hideTimeout = window.setTimeout(this._hide.bind(this), c);
    };

    e.prototype._computeDimensions = function() {
      var e = this.domNode.clientWidth;

      var t = this.domNode.clientHeight;

      var n = t - (this.options.verticalHasArrows ? 2 * this.options.arrowSize : 0) - this.options.horizontalScrollbarSize;

      var i = e - (this.options.horizontalHasArrows ? 2 * this.options.arrowSize : 0) - this.options.verticalScrollbarSize;
      return {
        width: e,
        height: t,
        representableHeight: n,
        representableWidth: i
      };
    };

    e.prototype._createOptions = function(e) {
      function t(e, t, n) {
        return e.hasOwnProperty(t) ? e[t] : n;
      }
      var n = {
        className: t(e, "className", ""),
        useShadows: t(e, "useShadows", !0),
        handleMouseWheel: t(e, "handleMouseWheel", !0),
        flipAxes: t(e, "flipAxes", !1),
        arrowSize: t(e, "arrowSize", 11),
        scrollable: t(e, "scrollable", null),
        listenOnDomNode: t(e, "listenOnDomNode", null),
        horizontal: r.visibilityFromString(t(e, "horizontal", "auto")),
        horizontalScrollbarSize: t(e, "horizontalScrollbarSize", 10),
        horizontalSliderSize: 0,
        horizontalHasArrows: t(e, "horizontalHasArrows", !1),
        vertical: r.visibilityFromString(t(e, "vertical", "auto")),
        verticalScrollbarSize: t(e, "verticalScrollbarSize", 10),
        verticalHasArrows: t(e, "verticalHasArrows", !1),
        verticalSliderSize: 0
      };
      n.horizontalSliderSize = t(e, "horizontalSliderSize", n.horizontalScrollbarSize);

      n.verticalSliderSize = t(e, "verticalSliderSize", n.verticalScrollbarSize);

      o.browser.isMacintosh && (n.className += " mac");

      return n;
    };

    return e;
  }();
  t.ScrollableElement = h;
});