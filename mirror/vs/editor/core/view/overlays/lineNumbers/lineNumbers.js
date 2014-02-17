define('vs/editor/core/view/overlays/lineNumbers/lineNumbers', [
  'require',
  'exports',
  'vs/editor/core/view/viewContext',
  'vs/editor/core/view/viewEventHandler',
  'vs/css!./lineNumbers'
], function(e, t, n, i) {
  var o = function(e) {
    function t(t) {
      e.call(this), this._context = t, this._lineNumbersLeft = 0, this._lineNumbersWidth = 0, this._previousRender = [],
        this._context.addEventHandler(this);
    }
    return __extends(t, e), t.prototype.dispose = function() {
      this._context.removeEventHandler(this), this._context = null, this._previousRender = null;
    }, t.prototype.onModelFlushed = function() {
      return !0;
    }, t.prototype.onModelDecorationsChanged = function() {
      return !1;
    }, t.prototype.onModelLinesDeleted = function() {
      return !0;
    }, t.prototype.onModelLineChanged = function() {
      return !0;
    }, t.prototype.onModelLinesInserted = function() {
      return !0;
    }, t.prototype.onCursorPositionChanged = function() {
      return !1;
    }, t.prototype.onCursorSelectionChanged = function() {
      return !1;
    }, t.prototype.onCursorRevealRange = function() {
      return !1;
    }, t.prototype.onConfigurationChanged = function() {
      return !0;
    }, t.prototype.onLayoutChanged = function(e) {
      return this._lineNumbersLeft = e.lineNumbersLeft, this._lineNumbersWidth = e.lineNumbersWidth, !0;
    }, t.prototype.onScrollChanged = function(e) {
      return e.vertical;
    }, t.prototype.onZonesChanged = function() {
      return !0;
    }, t.prototype.onScrollWidthChanged = function() {
      return !1;
    }, t.prototype.onScrollHeightChanged = function() {
      return !1;
    }, t.prototype._actualRender = function(e) {
      var t = [];
      if (!this._context.configuration.editor.lineNumbers)
        return t;
      var i, o;
      for (t.push('<div class="'), t.push(n.ClassNames.LINE_NUMBERS), t.push('" style="left:'), t.push(this._lineNumbersLeft
        .toString()), t.push('px;width:'), t.push(this._lineNumbersWidth.toString()), t.push('px;height:'), t.push(
        e.scrollHeight.toString()), t.push('px;">'), o = e.visibleRange.startLineNumber; o <= e.visibleRange.endLineNumber; o++)
        i = e.getViewportVerticalOffsetForLineNumber(o), t.push('<div class="clnr" style="top:'), t.push(i.toString()),
          t.push('px;">'), t.push(this._context.model.getLineRenderLineNumber(o)), t.push('</div>');
      return t.push('</div>'), t;
    }, t.prototype.shouldCallRender = function() {
      return this.shouldRender;
    }, t.prototype.render = function(e) {
      return this.shouldRender && (this._previousRender = this._actualRender(e), this.shouldRender = !1), this._previousRender;
    }, t;
  }(i.ViewEventHandler);
  t.LineNumbersOverlay = o;
})