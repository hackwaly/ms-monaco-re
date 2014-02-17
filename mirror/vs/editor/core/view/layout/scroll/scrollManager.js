define("vs/editor/core/view/layout/scroll/scrollManager", ["require", "exports",
  "vs/base/ui/scrollbar/impl/scrollableElement", "vs/editor/core/constants", "vs/editor/core/view/viewContext",
  "vs/editor/core/view/layout/scroll/editorScrollable", "vs/base/dom/dom", "vs/base/lifecycle"
], function(e, t, n, i, o, r, s, a) {
  function u(e, t, n) {
    e.hasOwnProperty(n) && (t[n] = e[n]);
  }
  var l = function() {
    function e(e, t, a, l) {
      var c = this;
      this.toDispose = [];

      this.configuration = e;

      this.privateViewEventBus = t;

      this.linesContent = a;

      this.scrollable = new r.EditorScrollable(a);

      this.toDispose.push(this.scrollable);

      this.toDispose.push(this.scrollable.addScrollListener(function(e) {
        c.privateViewEventBus.emit(i.EventType.ViewScrollChanged, e);
      }));
      var d = {
        scrollable: this.scrollable,
        listenOnDomNode: l,
        vertical: this.configuration.editor.scrollbar.vertical,
        horizontal: this.configuration.editor.scrollbar.horizontal,
        className: o.ClassNames.SCROLLABLE_ELEMENT + " " + this.configuration.editor.theme,
        useShadows: !1
      };
      u(this.configuration.editor.scrollbar, d, "verticalHasArrows");

      u(this.configuration.editor.scrollbar, d, "horizontalHasArrows");

      u(this.configuration.editor.scrollbar, d, "verticalScrollbarSize");

      u(this.configuration.editor.scrollbar, d, "verticalSliderSize");

      u(this.configuration.editor.scrollbar, d, "horizontalScrollbarSize");

      u(this.configuration.editor.scrollbar, d, "horizontalSliderSize");

      u(this.configuration.editor.scrollbar, d, "handleMouseWheel");

      u(this.configuration.editor.scrollbar, d, "arrowSize");

      this.scrollbar = new n.ScrollableElement(a, d);

      this.toDispose.push(this.scrollbar);

      this.toDispose.push(this.scrollable.addInternalSizeChangeListener(function() {
        c.scrollbar.onElementInternalDimensions();
      }));

      this.toDispose.push(this.configuration.addListener2(i.EventType.ConfigurationChanged, function() {
        c.scrollbar.updateClassName(c.configuration.editor.theme);
      }));
      var h = function(e, t, n) {
        if (t) {
          var i = e.scrollTop;
          i && (c.scrollable.setScrollTop(c.getScrollTop() + i), e.scrollTop = 0);
        }
        if (n) {
          var o = e.scrollLeft;
          o && (c.scrollable.setScrollLeft(c.getScrollLeft() + o), e.scrollLeft = 0);
        }
      };
      this.toDispose.push(s.addDisposableListener(l, "scroll", function() {
        return h(l, !0, !0);
      }));

      this.toDispose.push(s.addDisposableListener(a, "scroll", function() {
        return h(a, !0, !1);
      }));
    }
    e.prototype.dispose = function() {
      this.toDispose = a.disposeAll(this.toDispose);
    };

    e.prototype.getVerticalScrollbarWidth = function() {
      return this.scrollbar.verticalScrollbarWidth;
    };

    e.prototype.getHorizontalScrollbarHeight = function() {
      return this.scrollbar.horizontalScrollbarHeight;
    };

    e.prototype.onSizeProviderLayoutChanged = function() {
      this.scrollbar && this.scrollbar.onElementDimensions();
    };

    e.prototype.getScrolledTopFromAbsoluteTop = function(e) {
      return e - this.scrollable.getScrollTop();
    };

    e.prototype.getOverviewRulerLayoutInfo = function() {
      return this.scrollbar ? this.scrollbar.getOverviewRulerLayoutInfo() : null;
    };

    e.prototype.getScrollbarContainerDomNode = function() {
      return this.scrollbar ? this.scrollbar.getDomNode() : this.linesContent;
    };

    e.prototype.delegateVerticalScrollbarMouseDown = function(e) {
      this.scrollbar && this.scrollbar.delegateVerticalScrollbarMouseDown(e);
    };

    e.prototype.getWidth = function() {
      return this.scrollable.getWidth();
    };

    e.prototype.setWidth = function(e) {
      this.scrollable.setWidth(e);
    };

    e.prototype.getHeight = function() {
      return this.scrollable.getHeight();
    };

    e.prototype.setHeight = function(e) {
      this.scrollable.setHeight(e);
    };

    e.prototype.getScrollHeight = function() {
      return this.scrollable.getScrollHeight();
    };

    e.prototype.setScrollHeight = function(e) {
      this.scrollable.setScrollHeight(e);
    };

    e.prototype.getScrollWidth = function() {
      return this.scrollable.getScrollWidth();
    };

    e.prototype.setScrollWidth = function(e) {
      this.scrollable.setScrollWidth(e);
    };

    e.prototype.getScrollLeft = function() {
      return this.scrollable.getScrollLeft();
    };

    e.prototype.setScrollLeft = function(e) {
      this.scrollable.setScrollLeft(e);
    };

    e.prototype.getScrollTop = function() {
      return this.scrollable.getScrollTop();
    };

    e.prototype.setScrollTop = function(e) {
      this.scrollable.setScrollTop(e);
    };

    e.prototype.addScrollListener = function(e) {
      return this.scrollable.addScrollListener(e);
    };

    return e;
  }();
  t.ScrollManager = l;
});