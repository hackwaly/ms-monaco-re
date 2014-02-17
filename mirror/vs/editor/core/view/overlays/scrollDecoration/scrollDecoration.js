define("vs/editor/core/view/overlays/scrollDecoration/scrollDecoration", ["require", "exports",
  "vs/editor/core/view/viewContext", "vs/editor/core/view/viewEventHandler", "vs/css!./scrollDecoration"
], function(e, t, n, i) {
  var o = function(e) {
    function t(t) {
      e.call(this);

      this._context = t;

      this._width = 0;

      this._previousRender = [];

      this._context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._context.removeEventHandler(this);

      this._context = null;

      this._previousRender = null;
    };

    t.prototype.onModelFlushed = function() {
      return !0;
    };

    t.prototype.onModelDecorationsChanged = function() {
      return !1;
    };

    t.prototype.onModelLinesDeleted = function() {
      return !0;
    };

    t.prototype.onModelLineChanged = function() {
      return !0;
    };

    t.prototype.onModelLinesInserted = function() {
      return !0;
    };

    t.prototype.onCursorPositionChanged = function() {
      return !1;
    };

    t.prototype.onCursorSelectionChanged = function() {
      return !1;
    };

    t.prototype.onCursorRevealRange = function() {
      return !1;
    };

    t.prototype.onConfigurationChanged = function() {
      return !0;
    };

    t.prototype.onLayoutChanged = function(e) {
      this._width = e.width;

      return !0;
    };

    t.prototype.onScrollChanged = function(e) {
      return e.vertical;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    t.prototype.onScrollHeightChanged = function() {
      return !1;
    };

    t.prototype._actualRender = function(e) {
      var t = [];
      return this._context.configuration.editor.scrollbar.useShadows ? 0 === e.getViewportVerticalOffsetForLineNumber(
        1) ? t : (t.push('<div class="'), t.push(n.ClassNames.SCROLL_DECORATION), t.push('" style="width:'), t.push(
        this._width.toString()), t.push('px;"></div>'), t) : t;
    };

    t.prototype.shouldCallRender = function() {
      return this.shouldRender;
    };

    t.prototype.render = function(e) {
      this.shouldRender && (this._previousRender = this._actualRender(e), this.shouldRender = !1);

      return this._previousRender;
    };

    return t;
  }(i.ViewEventHandler);
  t.ScrollDecorationOverlay = o;
});