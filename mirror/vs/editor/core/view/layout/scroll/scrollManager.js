define(["require", "exports", "vs/base/ui/scrollbar/scrollableElement", "vs/editor/core/constants",
  "vs/editor/core/view/viewContext", "vs/editor/core/view/layout/scroll/editorScrollable", "vs/base/dom/dom",
  "vs/base/lifecycle"
], function(a, b, c, d, e, f, g, h) {
  function o(a, b, c) {
    a.hasOwnProperty(c) && (b[c] = a[c])
  }
  var i = c,
    j = d,
    k = e,
    l = f,
    m = g,
    n = h,
    p = function() {
      function a(a, b, c, d) {
        var e = this;
        this.toDispose = [], this.configuration = a, this.privateViewEventBus = b, this.linesContent = c, this.scrollable =
          new l.EditorScrollable(c), this.toDispose.push(this.scrollable), this.toDispose.push(this.scrollable.addScrollListener(
            function(a) {
              e.privateViewEventBus.emit(j.EventType.ViewScrollChanged, a)
            }));
        var f = {
          scrollable: this.scrollable,
          listenOnDomNode: d,
          vertical: this.configuration.editor.scrollbar.vertical,
          horizontal: this.configuration.editor.scrollbar.horizontal,
          className: k.ClassNames.SCROLLABLE_ELEMENT + " " + this.configuration.editor.theme
        };
        o(this.configuration.editor.scrollbar, f, "verticalHasArrows"), o(this.configuration.editor.scrollbar, f,
          "horizontalHasArrows"), o(this.configuration.editor.scrollbar, f, "verticalScrollbarSize"), o(this.configuration
          .editor.scrollbar, f, "horizontalScrollbarSize"), o(this.configuration.editor.scrollbar, f, "useShadows"),
          o(this.configuration.editor.scrollbar, f, "handleMouseWheel"), o(this.configuration.editor.scrollbar, f,
            "arrowSize"), this.scrollbar = new i.ScrollableElement(c, f), this.toDispose.push(this.scrollable.addInternalSizeChangeListener(
            function() {
              e.scrollbar.onElementInternalDimensions()
            })), this.toDispose.push(this.configuration.addListener2(j.EventType.ConfigurationChanged, function(a) {
            e.scrollbar.updateClassName(e.configuration.editor.theme)
          }));
        var g = function(a, b, c) {
          if (b) {
            var d = a.scrollTop;
            d && (e.scrollable.setScrollTop(e.getScrollTop() + d), a.scrollTop = 0)
          }
          if (c) {
            var f = a.scrollLeft;
            f && (e.scrollable.setScrollLeft(e.getScrollLeft() + f), a.scrollLeft = 0)
          }
        };
        this.toDispose.push(m.addDisposableListener(d, "scroll", function(a) {
          return g(d, !0, !0)
        })), this.toDispose.push(m.addDisposableListener(c, "scroll", function(a) {
          return g(c, !0, !1)
        }))
      }
      return a.prototype.dispose = function() {
        this.toDispose = n.disposeAll(this.toDispose), this.scrollable.dispose(), this.scrollbar && (this.scrollbar.destroy(),
          this.scrollbar = null)
      }, a.prototype.getVerticalScrollbarWidth = function() {
        return this.scrollbar.verticalScrollbarWidth
      }, a.prototype.getHorizontalScrollbarHeight = function() {
        return this.scrollbar.horizontalScrollbarHeight
      }, a.prototype.onSizeProviderLayoutChanged = function() {
        this.scrollbar && this.scrollbar.onElementDimensions()
      }, a.prototype.getScrolledTopFromAbsoluteTop = function(a) {
        return a - this.scrollable.getScrollTop()
      }, a.prototype.getOverviewRulerLayoutInfo = function() {
        return this.scrollbar ? this.scrollbar.getOverviewRulerLayoutInfo() : null
      }, a.prototype.getScrollbarContainerDomNode = function() {
        return this.scrollbar ? this.scrollbar.getDomNode() : this.linesContent
      }, a.prototype.delegateVerticalScrollbarMouseDown = function(a) {
        this.scrollbar && this.scrollbar.delegateVerticalScrollbarMouseDown(a)
      }, a.prototype.getWidth = function() {
        return this.scrollable.getWidth()
      }, a.prototype.setWidth = function(a) {
        this.scrollable.setWidth(a)
      }, a.prototype.getHeight = function() {
        return this.scrollable.getHeight()
      }, a.prototype.setHeight = function(a) {
        this.scrollable.setHeight(a)
      }, a.prototype.getScrollHeight = function() {
        return this.scrollable.getScrollHeight()
      }, a.prototype.setScrollHeight = function(a) {
        this.scrollable.setScrollHeight(a)
      }, a.prototype.getScrollWidth = function() {
        return this.scrollable.getScrollWidth()
      }, a.prototype.setScrollWidth = function(a) {
        this.scrollable.setScrollWidth(a)
      }, a.prototype.getScrollLeft = function() {
        return this.scrollable.getScrollLeft()
      }, a.prototype.setScrollLeft = function(a) {
        this.scrollable.setScrollLeft(a)
      }, a.prototype.getScrollTop = function() {
        return this.scrollable.getScrollTop()
      }, a.prototype.setScrollTop = function(a) {
        this.scrollable.setScrollTop(a)
      }, a.prototype.addScrollListener = function(a) {
        return this.scrollable.addScrollListener(a)
      }, a
    }();
  b.ScrollManager = p
})