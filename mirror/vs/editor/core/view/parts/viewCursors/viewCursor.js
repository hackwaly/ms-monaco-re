define('vs/editor/core/view/parts/viewCursors/viewCursor', [
  'require',
  'exports'
], function(e, t) {
  var n = function() {
    function e(e, t) {
      this._context = e, this._isInEditableRange = !0, this._domNode = this._createCursorDomNode(t), this._isVisible = !
        0, this.updatePosition({
          lineNumber: 1,
          column: 1
        });
    }
    return e.prototype._createCursorDomNode = function(e) {
      var t = document.createElement('div');
      return t.className = 'cursor', e && (t.className += ' secondary'), t.style.height = this._context.configuration
        .editor.lineHeight + 'px', t.style.top = '0px', t.style.left = '0px', t.setAttribute('role', 'presentation'),
        t.setAttribute('aria-hidden', 'true'), t;
    }, e.prototype.getDomNode = function() {
      return this._domNode;
    }, e.prototype.getIsInEditableRange = function() {
      return this._isInEditableRange;
    }, e.prototype.getPositionTop = function() {
      return this._positionTop;
    }, e.prototype.getPosition = function() {
      return this._position;
    }, e.prototype.show = function() {
      this._isVisible || (this._domNode.style.display = 'block', this._isVisible = !0);
    }, e.prototype.hide = function() {
      this._isVisible && (this._domNode.style.display = 'none', this._isVisible = !1);
    }, e.prototype.onModelFlushed = function() {
      return this.updatePosition({
        lineNumber: 1,
        column: 1
      }), this._isInEditableRange = !0, !0;
    }, e.prototype.onCursorPositionChanged = function(e, t) {
      return this.updatePosition(e), this._isInEditableRange = t, !0;
    }, e.prototype.onConfigurationChanged = function(e) {
      return e.lineHeight && (this._domNode.style.height = this._context.configuration.editor.lineHeight + 'px'), !0;
    }, e.prototype.prepareRender = function(e) {
      var t = e.visibleRangeForPosition(this._position);
      t ? (this._positionTop = t.top, this._positionLeft = t.left) : this._positionTop = -1000;
    }, e.prototype.render = function() {
      this._domNode.style.left = this._positionLeft + 'px', this._domNode.style.top = this._positionTop + 'px';
    }, e.prototype.updatePosition = function(e) {
      this._position = e, this._domNode.setAttribute('lineNumber', this._position.lineNumber.toString()), this._domNode
        .setAttribute('column', this._position.column.toString()), this._positionTop = -1000, this._positionLeft = -
        1000;
    }, e;
  }();
  t.ViewCursor = n;
})