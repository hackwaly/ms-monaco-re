define(["require", "vs/base/lib/winjs.base", "vs/css!./scrollbars", "vs/base/env", "vs/base/objects", "vs/base/dom/dom",
  "vs/base/dom/mouseEvent", "./horizontalScrollbar", "./verticalScrollbar", "./domNodeScrollable"
], function(a, b) {
  var c = a("vs/base/env");

  var d = a("vs/base/objects");

  var e = a("vs/base/dom/dom");

  var f = a("vs/base/dom/mouseEvent");

  var g = a("./domNodeScrollable").DomNodeScrollable;

  var h = a("./verticalScrollbar").VerticalScrollbar;

  var i = a("./horizontalScrollbar").HorizontalScrollbar;

  var j = 500;

  var k = 50;

  var l = {
    useNative: !1,
    arrowSize: 11,
    zIndexDelta: 10,
    className: "",
    horizontal: "auto",
    vertical: "auto",
    horizontalHasArrows: !1,
    flipAxes: !1,
    verticalHasArrows: !1,
    horizontalScrollbarSize: 10,
    verticalScrollbarSize: 10,
    useShadows: !0,
    handleMouseWheel: !0
  };

  var m = b.Class.define(function(b, c) {
    this.originalElement = b;

    this.originalElement.style.overflow = "hidden";

    this.options = this._createOptions(c);

    this.scrollable = this.options.scrollable ? this.options.scrollable : new g(this.originalElement);

    this.verticalScrollbarWidth = this.options.verticalScrollbarSize;

    this.horizontalScrollbarHeight = this.options.horizontalScrollbarSize;

    this.verticalScrollbar = new h(this.scrollable, this, this.options);

    this.horizontalScrollbar = new i(this.scrollable, this, this.options);

    this.domNode = document.createElement("div");

    this.domNode.className = "monaco-scrollable-element " + this.options.className;

    this.domNode.setAttribute("aria-hidden", "true");

    this.domNode.setAttribute("role", "presentation");

    this.domNode.style.position = "relative";

    this.domNode.style.overflow = "hidden";

    this.domNode.appendChild(this.originalElement);

    this.domNode.appendChild(this.horizontalScrollbar.domNode);

    this.domNode.appendChild(this.verticalScrollbar.domNode);

    if (this.options.useShadows) {
      this.leftShadowDomNode = document.createElement("div");
      this.leftShadowDomNode.className = "shadow";
      this.domNode.appendChild(this.leftShadowDomNode);
      this.topShadowDomNode = document.createElement("div");
      this.topShadowDomNode.className = "shadow";
      this.domNode.appendChild(this.topShadowDomNode);
      this.topLeftShadowDomNode = document.createElement("div");
      this.topLeftShadowDomNode.className = "shadow top-left-corner";
      this.domNode.appendChild(this.topLeftShadowDomNode);
    }

    this.listenOnDomNode = this.options.listenOnDomNode || this.domNode;

    this.listenersToRemove = [];

    this.listenersToRemove.push(this.scrollable.addListener("scroll", this._onScroll.bind(this)));

    if (this.options.handleMouseWheel) {
      this.handleMouseWheel();
    }

    this.listenersToRemove.push(e.addListener(this.listenOnDomNode, "mouseover", this._onMouseOver.bind(this)));

    this.listenersToRemove.push(e.addNonBubblingMouseOutListener(this.listenOnDomNode, this._onMouseOut.bind(this)));

    this.onElementDimensionsTimeout = -1;

    this.onElementInternalDimensionsTimeout = -1;

    this.isDragging = !1;

    this.mouseIsOver = !1;

    this.onElementDimensions(!0);

    this.onElementInternalDimensions(!0);
  }, {
    destroy: function() {
      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = [];

      this.verticalScrollbar.destroy();

      this.horizontalScrollbar.destroy();

      if (this.onElementDimensionsTimeout !== -1) {
        window.clearTimeout(this.onElementDimensionsTimeout);
        this.onElementDimensionsTimeout = -1;
      }

      if (this.onElementInternalDimensionsTimeout !== -1) {
        window.clearTimeout(this.onElementInternalDimensionsTimeout);
        this.onElementInternalDimensionsTimeout = -1;
      }
    },
    getDomNode: function() {
      return this.domNode;
    },
    getOverviewRulerLayoutInfo: function() {
      return {
        parent: this.domNode,
        insertBefore: this.verticalScrollbar.domNode,
        top: this.options.verticalHasArrows ? this.options.arrowSize : 0,
        bottom: (this.options.verticalHasArrows ? this.options.arrowSize : 0) + this.options.horizontalScrollbarSize,
        width: this.options.verticalScrollbarSize
      };
    },
    getVerticalSliderDomNode: function() {
      return this.verticalScrollbar.slider;
    },
    delegateVerticalScrollbarMouseDown: function(a) {
      return this.verticalScrollbar.onMouseDown(a);
    },
    onElementDimensions: function(a) {
      if (!this.actualElementDimensions) {
        this.actualElementDimensions = function() {
          this.onElementDimensionsTimeout = -1;

          this.dimensions = this._computeDimensions();

          this.verticalScrollbar.onElementDimensions(this.dimensions, this.dimensions.height);

          this.horizontalScrollbar.onElementDimensions(this.dimensions, this.dimensions.width);
        }.bind(this);
      }

      if (a) {
        this.actualElementDimensions();
      } else {
        if (this.onElementDimensionsTimeout === -1) {
          this.onElementDimensionsTimeout = window.setTimeout(this.actualElementDimensions, 0);
        }
      }
    },
    onElementInternalDimensions: function(a) {
      if (!this.actualElementInternalDimensions) {
        this.actualElementInternalDimensions = function() {
          this.onElementInternalDimensionsTimeout = -1;

          this.horizontalScrollbar.onElementScrollSize(this.scrollable.getScrollWidth());

          this.verticalScrollbar.onElementScrollSize(this.scrollable.getScrollHeight());
        }.bind(this);
      }

      if (a) {
        this.actualElementInternalDimensions();
      } else {
        if (this.onElementInternalDimensionsTimeout === -1) {
          this.onElementInternalDimensionsTimeout = window.setTimeout(this.actualElementInternalDimensions, 0);
        }
      }
    },
    updateClassName: function(a) {
      this.options.className = a;

      if (c.browser.isMacintosh) {
        this.options.className += " mac";
      }

      this.domNode.className = "monaco-scrollable-element " + this.options.className;
    },
    handleMouseWheel: function() {
      var a = -1;

      var b = -1;

      var c = function() {
        if (a !== -1) {
          this.verticalScrollbar.setDesiredScrollPosition(a);
          a = -1;
        }

        if (b !== -1) {
          this.horizontalScrollbar.setDesiredScrollPosition(b);
          b = -1;
        }
      }.bind(this);
      this.onMouseWheel = function(d) {
        if (d.deltaY || d.deltaX) {
          var f = d.deltaY;

          var g = d.deltaX;
          if (this.options.flipAxes) {
            f = d.deltaX;
            g = d.deltaY;
          }
          if (f) {
            var h = this.scrollable.getScrollTop();
            a = this.verticalScrollbar.validateScrollPosition((a !== -1 ? a : h) - k * f);

            if (a === h) {
              a = -1;
            }
          }
          if (g) {
            var i = this.scrollable.getScrollLeft();
            b = this.horizontalScrollbar.validateScrollPosition((b !== -1 ? b : i) - k * g);

            if (b === i) {
              b = -1;
            }
          }
          if (a !== -1 || b !== -1) {
            d.preventDefault();
            d.stopPropagation();
            e.scheduleAtNextAnimationFrame(c);
          }
        }
      };
      var d = function(a) {
        var b = new f.MouseWheelEvent(a);
        this.onMouseWheel(b);
      }.bind(this);
      this.listenersToRemove.push(e.addListener(this.listenOnDomNode, "mousewheel", d));

      this.listenersToRemove.push(e.addListener(this.listenOnDomNode, "DOMMouseScroll", d));
    },
    _onScroll: function() {
      var a = this.scrollable.getScrollHeight();

      var b = this.scrollable.getScrollTop();

      var c = this.scrollable.getScrollWidth();

      var d = this.scrollable.getScrollLeft();
      this.verticalScrollbar.onElementScrollPosition(b);

      this.horizontalScrollbar.onElementScrollPosition(d);
      if (this.options.useShadows) {
        var f = a > 0 && b > 0;

        var g = c > 0 && d > 0;
        e.toggleClass(this.topShadowDomNode, "top", f);

        e.toggleClass(this.topLeftShadowDomNode, "top", f);

        e.toggleClass(this.leftShadowDomNode, "left", g);

        e.toggleClass(this.topLeftShadowDomNode, "left", g);
      }
      this._reveal();
    },
    onDragStart: function() {
      this.isDragging = !0;

      this._reveal();
    },
    onDragEnd: function() {
      this.isDragging = !1;

      this._hide();
    },
    _onMouseOut: function(a) {
      this.mouseIsOver = !1;

      this._hide();
    },
    _onMouseOver: function(a) {
      this.mouseIsOver = !0;

      this._reveal();
    },
    _reveal: function() {
      this.verticalScrollbar.reveal();

      this.horizontalScrollbar.reveal();

      this._beginHide();
    },
    _hide: function() {
      if (!this.mouseIsOver && !this.isDragging) {
        this.verticalScrollbar.hide();
        this.horizontalScrollbar.hide();
      }
    },
    _beginHide: function() {
      if (this.hideTimeout !== -1) {
        window.clearTimeout(this.hideTimeout);
      }

      this.hideTimeout = window.setTimeout(this._hide.bind(this), j);
    },
    _computeDimensions: function() {
      var a = this.domNode.clientWidth;

      var b = this.domNode.clientHeight;

      var c = b - (this.options.verticalHasArrows ? 2 * this.options.arrowSize : 0) - this.options.horizontalScrollbarSize;

      var d = a - (this.options.horizontalHasArrows ? 2 * this.options.arrowSize : 0) - this.options.verticalScrollbarSize;
      return {
        width: a,
        height: b,
        representableHeight: c,
        representableWidth: d
      };
    },
    _createOptions: function(a) {
      var b = d.clone(l);

      var e = ["useNative", "arrowSize", "zIndexDelta", "className", "scrollable", "horizontal", "vertical",
        "horizontalHasArrows", "verticalHasArrows", "horizontalScrollbarSize", "verticalScrollbarSize", "flipAxes",
        "useShadows", "handleMouseWheel", "listenOnDomNode"
      ];
      for (var f = 0; f < e.length; f++) {
        if (a.hasOwnProperty(e[f])) {
          b[e[f]] = a[e[f]];
        }
      }
      c.browser.isMacintosh && (b.className += " mac");

      return b;
    }
  });

  var n = function(a, b) {
    var c = document.createElement("div");

    var d = new m(c, b);
    a(c);
    var f = {
      _parent: null,
      appendTo: function(a) {
        a.appendChild(d.getDomNode());

        this._parent = a;

        this.layout();
      },
      layout: function(a, b) {
        if (!this._parent) return;
        if (a !== null) {
          if (typeof a == "undefined") {
            if (e.isAncestor(this._parent, document.body)) {
              a = e.getTotalHeight(this._parent) + "px";
            } else {
              a = c.style.height;
            }
          }
          c.style.height = d.getDomNode().style.height = a;
        }

        if (b !== null) {
          if (typeof b == "undefined") {
            if (e.isAncestor(this._parent, document.body)) {
              b = e.getTotalWidth(this._parent) + "px";
            } else {
              b = c.style.width;
            }
          }
          c.style.width = d.getDomNode().style.width = b;
        }

        d.onElementDimensions();

        d.onElementInternalDimensions();
      }
    };
    return f;
  };
  return {
    ScrollableElement: m,
    div: n
  };
});